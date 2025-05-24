import { ref, onMounted, onBeforeUnmount, type Ref, watch } from 'vue'
import { BrowserMultiFormatReader, type IScannerControls, BarcodeFormat } from '@zxing/browser'

export interface BarcodeScannerOptions {
    formats?: BarcodeFormat[];
    tryHarder?: boolean;
    autostart?: boolean;
    preferBackCamera?: boolean;
    resetAfterScan?: boolean;
    resetDelay?: number;
}

export function useBarcodeScanner(
    videoElement: Ref<HTMLVideoElement | null>,
    options: BarcodeScannerOptions = {}
) {
    // Default options
    const {
        formats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128],
        tryHarder = true,
        autostart = true,
        preferBackCamera = true,
        resetAfterScan = true,
        resetDelay = 1500
    } = options;

    // Reactive state
    const barcode = ref<string | null>(null);
    const isSupported = ref<boolean>(false);
    const error = ref<string | null>(null);
    const status = ref<'idle' | 'changing' | 'error' | 'scanning' | 'scanned'>('idle');
    const permissionStatus = ref<'loading' | 'allowed' | 'denied'>('loading');
    const currentDeviceIndex = ref(0);
    const devices = ref<MediaDeviceInfo[]>([]);

    // Internal state
    let codeReader: BrowserMultiFormatReader | null = null;
    let controls: IScannerControls | null = null;
    let resetTimer: number | null = null;

    /**
     * Check if the camera is supported by the browser
     */
    const checkCameraSupport = (): boolean => {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    };

    /**
     * Request camera permission from the user
     */
    const requestCameraPermission = async (): Promise<boolean> => {
        try {
            permissionStatus.value = 'loading';
            await navigator.mediaDevices.getUserMedia({ video: true });
            permissionStatus.value = 'allowed';
            return true;
        } catch (err) {
            error.value = 'Camera permission denied or failed.';
            permissionStatus.value = 'denied';
            console.error('[BarcodeScanner] Permission error:', err);
            return false;
        }
    };

    /**
     * Get available video devices
     */
    const getVideoDevices = async (): Promise<MediaDeviceInfo[]> => {
        try {
            const availableDevices = await BrowserMultiFormatReader.listVideoInputDevices();
            devices.value = availableDevices;
            return availableDevices;
        } catch (err) {
            console.error('[BarcodeScanner] Failed to list devices:', err);
            error.value = 'Failed to get camera devices.';
            return [];
        }
    };

    /**
     * Find the best camera device to use based on options
     */
    const findBestDevice = (deviceList: MediaDeviceInfo[]): MediaDeviceInfo | null => {
        if (!deviceList.length) return null;

        // Try to find back camera if preferred
        if (preferBackCamera) {
            const backCamera = deviceList.find(device =>
                /back|rear|environment/i.test(device.label)
            );

            if (backCamera) {
                currentDeviceIndex.value = deviceList.findIndex(d => d.deviceId === backCamera.deviceId);
                return backCamera;
            }
        }

        // Fallback to first camera
        currentDeviceIndex.value = 0;
        return deviceList[0];
    };

    /**
     * Initialize the barcode reader with hints
     */
    const initializeReader = async () => {
        if (codeReader) {
            // If we already have a reader, stop it first
            stopScanner();
        }

        const hints = new Map();
        if (formats.length) {
            hints.set(2, formats); // DecodeHintType.POSSIBLE_FORMATS = 2
        }
        if (tryHarder) {
            hints.set(3, true); // DecodeHintType.TRY_HARDER = 3
        }

        codeReader = new BrowserMultiFormatReader(hints);
    };

    /**
     * Start the barcode scanner
     */
    const startScanner = async (deviceId?: string): Promise<boolean> => {
        if (!checkCameraSupport()) {
            error.value = 'Device does not support camera access.';
            status.value = 'error';
            console.warn('[BarcodeScanner] getUserMedia is not supported.');
            return false;
        }

        // Clear any previous errors
        error.value = null;

        // Check permissions
        if (permissionStatus.value !== 'allowed') {
            const granted = await requestCameraPermission();
            if (!granted) return false;
        }

        // Initialize reader if needed
        if (!codeReader) {
            await initializeReader();
        }

        try {
            status.value = 'changing';

            // Get devices if we don't have them yet
            if (!devices.value.length) {
                const availableDevices = await getVideoDevices();
                if (!availableDevices.length) {
                    throw new Error('No cameras found');
                }
            }

            // Find device to use
            let selectedDevice: MediaDeviceInfo | null = devices.value[0];

            if (deviceId) {
                // Use specified device
                selectedDevice = devices.value.find(d => d.deviceId === deviceId) || null;
                if (selectedDevice) {
                    currentDeviceIndex.value = devices.value.findIndex(d => d.deviceId === deviceId);
                }
            } else {
                // Find best device
                selectedDevice = findBestDevice(devices.value);
            }

            if (!selectedDevice) {
                throw new Error('No suitable camera found');
            }

            // Ensure video element exists
            if (!videoElement.value) {
                throw new Error('Video element not available');
            }

            // Start decoding
            controls = await codeReader!.decodeFromVideoDevice(
                selectedDevice.deviceId,
                videoElement.value,
                (result, err) => {
                    if (err) {
                        // Just a failure to read - this is normal during scanning
                        if (!/NotFoundException/.test(err.toString())) {
                            console.debug('[BarcodeScanner] Decode error:', err);
                        }
                        return;
                    }

                    if (result) {
                        barcode.value = result.getText();
                        status.value = 'scanned';

                        // Reset after scan if enabled
                        if (resetAfterScan) {
                            // Clear any existing timer
                            if (resetTimer !== null) {
                                window.clearTimeout(resetTimer);
                            }

                            resetTimer = window.setTimeout(() => {
                                barcode.value = null;
                                status.value = 'scanning';
                                resetTimer = null;
                            }, resetDelay);
                        }
                    }
                }
            );

            status.value = 'scanning';
            return true;
        } catch (err) {
            console.error('[BarcodeScanner] Initialization failed:', err);
            error.value = err instanceof Error ? err.message : 'Scanner initialization failed';
            status.value = 'error';
            return false;
        }
    };

    /**
     * Stop the barcode scanner
     */
    const stopScanner = () => {
        if (resetTimer !== null) {
            window.clearTimeout(resetTimer);
            resetTimer = null;
        }

        if (codeReader && controls) {
            try {
                controls.stop();
                controls = null;
            } catch (err) {
                console.warn('[BarcodeScanner] Error stopping scanner:', err);
            }
        }

        status.value = 'idle';
    };

    /**
     * Switch to the next available camera
     */
    const switchCamera = async (): Promise<boolean> => {
        try {
            if (devices.value.length <= 1) {
                console.warn('[BarcodeScanner] Only one camera available, cannot switch.');
                return false;
            }

            status.value = 'changing';
            stopScanner();

            // ⏳ Delay sedikit biar kamera bener-bener "released"
            await new Promise((res) => setTimeout(res, 500));

            currentDeviceIndex.value = (currentDeviceIndex.value + 1) % devices.value.length;
            const nextDevice = devices.value[currentDeviceIndex.value];

            return await startScanner(nextDevice.deviceId);
        } catch (err) {
            console.error('[BarcodeScanner] Failed to switch camera:', err);
            status.value = 'error';
            error.value = 'Failed to switch camera';
            return false;
        }
    };

    /**
     * Reset the scanner after a successful scan
     */
    const resetScanner = () => {
        barcode.value = null;
        if (status.value === 'scanned') {
            status.value = 'scanning';
        }
    };

    /**
     * Get the current device name
     */
    const getCurrentDeviceName = (): string => {
        if (devices.value.length && currentDeviceIndex.value < devices.value.length) {
            return devices.value[currentDeviceIndex.value].label || `Camera ${currentDeviceIndex.value + 1}`;
        }
        return 'Unknown';
    };

    // Watch for video element changes
    watch(videoElement, async (newEl) => {
        if (newEl && autostart) {
            // Tunggu DOM benar-benar render
            await nextTick();

            // Pastikan permission sudah granted
            if (permissionStatus.value !== 'allowed') {
                const granted = await requestCameraPermission();
                if (!granted) return;
            }

            // Ambil ulang device list dan pilih kamera terbaik
            const deviceList = await getVideoDevices();
            const bestDevice = findBestDevice(deviceList);
            if (bestDevice) {
                await startScanner(bestDevice.deviceId); // Gunakan deviceId eksplisit
            }
        }
    });


    // Setup on mount
    onMounted(async () => {
        isSupported.value = checkCameraSupport();
        if (!isSupported.value) {
            console.warn('[BarcodeScanner] Camera is not supported in this browser.');
            return;
        }

        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        const availableDevices = await getVideoDevices();
        if (availableDevices.length === 0) {
            error.value = 'No cameras available.';
            return;
        }

        // Delay start until devices are fully ready
        const bestDevice = findBestDevice(availableDevices);
        if (autostart && videoElement.value && bestDevice) {
            await startScanner(bestDevice.deviceId);
        }
    });

    // Cleanup on unmount
    onBeforeUnmount(() => {
        stopScanner();
    });

    return {
        // State
        barcode,
        error,
        isSupported,
        status,
        permissionStatus,
        devices,
        currentDeviceIndex,

        // Methods
        startScanner,
        stopScanner,
        switchCamera,
        resetScanner,
        getCurrentDeviceName,

        // Computed
        currentDevice: computed(() => devices.value[currentDeviceIndex.value] || null),
        hasMultipleCameras: computed(() => devices.value.length > 1)
    };
}