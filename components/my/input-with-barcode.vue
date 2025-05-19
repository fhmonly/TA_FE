<template>
    <div v-if="inputFrom === 'camera'">
        <MyBarcodeScanner @scanned="(e) => {
            console.log(e)
            model = e
            inputFrom = 'manual'
        }" />
        <NuxtUiButton icon="i-heroicons-pencil-solid" @click="inputFrom = 'manual'" label="Manual" />
    </div>
    <div v-else>
        <NuxtUiInput v-model="model" />
        <NuxtUiButton icon="i-heroicons-qr-code-20-solid" @click="inputFrom = 'camera'" />
    </div>
</template>
<script lang="ts" setup>
const model = defineModel<string>()
const inputFrom = ref<'camera' | 'manual'>('camera')
</script>