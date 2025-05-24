<template>
  <div class="barcode-scanner">
    <!-- Scanner container -->
    <div class="relative w-full">
      <!-- Video element -->
      <video ref="videoRef" class="w-full h-full rounded"></video>

      <!-- Camera switcher button - only show if multiple cameras -->
      <NuxtUiButton v-if="hasMultipleCameras" class="absolute top-2 right-2 z-20" :disabled="status === 'changing'"
        @click="switchCamera" icon="i-f7-camera-rotate-fill" variant="link" color="white">
      </NuxtUiButton>

      <!-- Scanner overlay -->
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- Scanning animation -->
        <div v-if="status === 'scanning'" class="w-64 h-64 border-2 border-red-500 rounded-lg pointer-events-none">
          <div class="w-full h-0.5 bg-red-500 animate-scan"></div>
        </div>

        <!-- Scanned indicator -->
        <div v-else-if="status === 'scanned'"
          class="w-64 h-64 border-2 border-green-500 rounded-lg flex items-center justify-center pointer-events-none">
          <div class="bg-white/80 dark:bg-gray-800/80 p-3 rounded-md shadow-md text-center">
            <div class="i-heroicons-check-circle-20-solid text-green-500 text-4xl mx-auto mb-2"></div>
            <div class="text-sm truncate max-w-[200px]">{{ barcode }}</div>
          </div>
        </div>

        <!-- Error indicator -->
        <div v-else-if="status === 'error'"
          class="w-64 h-64 border-2 border-red-500 rounded-lg flex items-center justify-center">
          <div class="bg-white/80 dark:bg-gray-800/80 p-3 rounded-md shadow-md text-center">
            <div class="text-sm">{{ error || 'Scanner error' }}</div>
            <div class="mt-2">
              <NuxtUiButton label="Restart" icon="i-heroicons-arrow-path-16-solid" @click="switchCamera" />
            </div>
          </div>
        </div>
      </div>

      <!-- Permission denied -->
      <div v-if="permissionStatus === 'denied'"
        class="absolute inset-0 bg-gray-900/80 flex items-center justify-center text-white text-center p-4">
        <div>
          <div class="i-heroicons-camera-slash-20-solid text-4xl mx-auto mb-3"></div>
          <h3 class="text-lg font-semibold mb-2">Camera Access Denied</h3>
          <p class="text-sm">Please allow camera access to scan barcodes.</p>
        </div>
      </div>
    </div>

    <!-- Status text -->
    <div class="text-xs text-center mt-2 text-gray-500">
      <template v-if="status === 'scanning'">
        Scanning... {{ getCurrentDeviceName() }}
      </template>
      <template v-else-if="status === 'scanned'">
        Code detected!
      </template>
      <template v-else-if="status === 'error'">
        Scanner error
      </template>
      <template v-else-if="status === 'changing'">
        Changing camera...
      </template>
      <template v-else-if="permissionStatus === 'denied'">
        Camera access denied
      </template>
      <template v-else>
        Ready to scan
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { BarcodeFormat } from '@zxing/browser';

// Define props and emits
const props = withDefaults(defineProps<{
  // Add any props you need
  autostart?: boolean;
  resetDelay?: number;
}>(), {
  autostart: true,
  resetDelay: 1500,
});

const emit = defineEmits<{
  scanned: [code: string];
}>();

// Setup video reference
const videoRef = ref<HTMLVideoElement | null>(null);

// Use the barcode scanner composable
const {
  barcode,
  error,
  status,
  permissionStatus,
  startScanner,
  stopScanner,
  switchCamera,
  getCurrentDeviceName,
  hasMultipleCameras
} = useBarcodeScanner(videoRef, {
  formats: [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128],
  tryHarder: true,
  autostart: props.autostart,
  preferBackCamera: true,
  resetAfterScan: true,
  resetDelay: props.resetDelay
});

// Watch for barcode changes to emit events
watch(barcode, (newCode) => {
  if (newCode) {
    emit('scanned', newCode);
  }
});

onUnmounted(() => {
  stopScanner()
})
</script>

<style scoped>
.barcode-scanner {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

video {
  display: block;
  object-fit: cover;
  aspect-ratio: 4/3;
}

@keyframes scanLine {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(256px);
  }

  100% {
    transform: translateY(0);
  }
}

.animate-scan {
  animation: scanLine 2s ease-in-out infinite;
}
</style>