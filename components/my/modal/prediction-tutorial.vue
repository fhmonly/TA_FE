<template>
    <div>
        <NuxtUiButton label="Tutorial" icon="i-heroicons-information-circle" @click="modalShown = true" />
        <NuxtUiModal v-model="modalShown">
            <NuxtUiCard>

            </NuxtUiCard>
        </NuxtUiModal>
    </div>
</template>
<script lang="ts" setup>
const modalShown = ref(false)
</script>