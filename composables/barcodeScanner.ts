import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'

export function useBarcodeScanner(videoElement: Ref<HTMLVideoElement | null>) {
    const barcode = ref<string | null>(null)
    const isSupported = ref<boolean>(false)
    const error = ref<string | null>(null)

    const status = ref<'idle' | 'changing' | 'error' | 'scanning' | 'scanned'>('idle')
    const permissionStatus = ref<'loading' | 'allowed' | 'denied'>('loading')

    let codeReader: BrowserMultiFormatReader
    let controls: IScannerControls
    let devices: MediaDeviceInfo[] = []
    const currentDeviceIndex = ref(0)

    const checkCameraSupport = (): boolean => {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    }

    const requestCameraPermission = async (): Promise<boolean> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            stream.getTracks().forEach(track => track.stop())
            permissionStatus.value = 'allowed'
            return true
        } catch (err) {
            error.value = 'Izin kamera ditolak atau gagal.'
            permissionStatus.value = 'denied'
            console.error('[BarcodeScanner] Permission error:', err)
            return false
        }
    }

    const startScanner = async (deviceId?: string) => {
        if (!checkCameraSupport()) {
            error.value = 'Perangkat tidak mendukung akses kamera.'
            status.value = 'error'
            console.warn('[BarcodeScanner] getUserMedia tidak didukung.')
            return
        }

        if (permissionStatus.value !== 'allowed') {
            const granted = await requestCameraPermission()
            if (!granted) return
        }

        codeReader = new BrowserMultiFormatReader()

        try {
            devices = await BrowserMultiFormatReader.listVideoInputDevices()
            if (!devices.length) throw new Error('Kamera tidak ditemukan')

            // Otomatis pakai kamera belakang kalau ada
            if (!deviceId) {
                const backCam = devices.find(device =>
                    /back|rear/i.test(device.label)
                )
                if (backCam) {
                    currentDeviceIndex.value = devices.findIndex(d => d.deviceId === backCam.deviceId)
                    deviceId = backCam.deviceId
                } else {
                    // Fallback ke kamera pertama
                    currentDeviceIndex.value = 0
                    deviceId = devices[0].deviceId
                }
            }

            controls = await codeReader.decodeFromVideoDevice(
                deviceId,
                videoElement.value!,
                (result, err) => {
                    status.value = 'scanning'
                    if (result) {
                        barcode.value = result.getText()
                        status.value = 'scanned'
                    }
                }
            )
        } catch (err) {
            console.error('[BarcodeScanner] Gagal inisialisasi:', err)
            error.value = (err as Error).message
            status.value = 'error'
            throw new Error('[BarcodeScanner] Gagal inisialisasi')
        }
    }


    const stopScanner = () => {
        if (codeReader && controls) {
            controls.stop()
        }
    }

    const switchCamera = async () => {
        try {
            status.value = 'changing'
            if (devices.length <= 1) {
                console.warn('[BarcodeScanner] Hanya ada satu kamera, tidak bisa switch.')
                status.value = 'idle'
                return
            }

            stopScanner()
            currentDeviceIndex.value = (currentDeviceIndex.value + 1) % devices.length
            await startScanner(devices[currentDeviceIndex.value].deviceId)

            status.value = 'idle'
        } catch (error) {
            console.error('[BarcodeScanner] Gagal switch kamera:', error)
            status.value = 'error'
        }
    }

    onMounted(async () => {
        isSupported.value = checkCameraSupport()
        if (!isSupported.value) {
            console.warn('[BarcodeScanner] Kamera tidak didukung di browser ini.')
            return
        }

        await requestCameraPermission()
        if (permissionStatus.value !== 'allowed') return

        devices = await BrowserMultiFormatReader.listVideoInputDevices()
        if (devices.length === 0) {
            error.value = 'Tidak ada kamera yang tersedia.'
            return
        }

        await startScanner()
    })

    onBeforeUnmount(() => {
        stopScanner()
    })

    return {
        barcode,
        error,
        isSupported,
        startScanner,
        stopScanner,
        switchCamera,
        devices,
        status,
        permissionStatus
    }
}
