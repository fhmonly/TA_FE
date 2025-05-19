<template>
    <div v-if="permissionStatus === 'allowed'">
        <div class="relative">
            <div class="aspect-w-16 aspect-h-9">
                <video ref="video" autoplay playsinline class="w-full h-full object-cover" />
            </div>
            <div class="absolute bottom-0 right-0 me-2 mb-2">
                <NuxtUiButton @click="switchCamera" icon="i-heroicons-arrow-path-20-solid" />
            </div>
        </div>
        <!-- <p class="mt-2">Barcode: {{ barcode }}</p> -->
    </div>
    <div v-else-if="permissionStatus === 'denied'">
        You already denied camera permission.
    </div>
    <div v-else class="flex">
        <div class="m-auto max-w-[300px] w-full px-3">
            <p class="text-end">Loading...</p>
            <NuxtUiProgress animation="carousel" />
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['scanned'])
const video = ref<HTMLVideoElement | null>(null)
const { barcode, error, switchCamera, status, permissionStatus, devices } = useBarcodeScanner(video)
watch(status, newVal => {
    if (newVal === 'scanned') {
        emit('scanned', barcode.value)
    }
})
</script>
