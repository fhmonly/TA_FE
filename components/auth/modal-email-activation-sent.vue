<template>
    <NuxtUiModal v-model="registeredModalShown" :prevent-close="true">
        <NuxtUiCard>
            <div class="space-y-4">
                <div class="text-green-500 flex justify-center items-center text-[100px]">
                    <NuxtUiIcon name="i-heroicons-check-badge" />
                </div>
                <h2 class="text-base text-center font-semibold text-green-600 leading-none">
                    <slot name="header" />
                </h2>
                <div class="flex justify-center ">
                    <p class="max-w-[250px] text-gray-700 text-center">
                        <slot />
                    </p>
                </div>
                <div class="flex justify-center" v-if="slots.footer">
                    <slot name="footer" />
                </div>
            </div>
        </NuxtUiCard>
    </NuxtUiModal>
</template>
<script lang="ts" setup>
const registeredModalShown = ref(false)
const slots = useSlots()
</script>