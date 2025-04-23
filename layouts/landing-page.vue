<template>
    <NuxtUiContainer
        class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <LandingHeader />
        <div class="grow mt-[64px] flex flex-col">
            <slot />
        </div>
        <LandingFooter />
    </NuxtUiContainer>
</template>
<script lang="ts" setup>
const colorMode = useColorMode()
onMounted(() => {
    if (colorMode.preference !== 'light') {
        colorMode.preference = 'light'
    }
})
</script>