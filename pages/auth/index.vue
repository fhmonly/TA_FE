<template>
    <NuxtLayout name="default">
        <div class="w-screen h-screen grid">
            <NuxtUiCard class="w-full max-w-sm m-auto shadow-xl rounded-2xl">
                <Auth />
            </NuxtUiCard>
        </div>
    </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: 'guest'
})
</script>
