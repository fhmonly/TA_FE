<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
    <div>
        <aside
            class="NuxtUi-hidden md:NuxtUi-flex NuxtUi-w-64 NuxtUi-bg-white NuxtUi-border-r NuxtUi-p-4 NuxtUi-flex-col">
            <strong class="NuxtUi-text-lg NuxtUi-mb-4">MyApp</strong>
            <nav class="NuxtUi-flex NuxtUi-flex-col NuxtUi-gap-2">
                <NuxtUiButton variant="ghost" to="/">Home</NuxtUiButton>
                <NuxtUiButton variant="ghost" to="/about">About</NuxtUiButton>
                <NuxtUiButton variant="ghost" to="/contact">Contact</NuxtUiButton>
            </nav>
        </aside>

        <!-- Mobile sidebar toggle -->
        <div class="NuxtUi-flex md:NuxtUi-hidden NuxtUi-p-4 NuxtUi-items-center NuxtUi-justify-between NuxtUi-w-full">
            <strong class="NuxtUi-text-lg">MyApp</strong>
            <NuxtUiButton icon="i-heroicons-bars-3" color="gray" variant="ghost" @click="isOpen = true" />
        </div>

        <!-- Main Content -->
        <main class="NuxtUi-flex-1 NuxtUi-p-4">
            <slot />
        </main>

        <!-- Mobile Sidebar (USlideover) -->
        <NuxtUiSlideover v-model="isOpen">
            <div class="NuxtUi-p-4">
                <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" class="NuxtUi-mb-4"
                    @click="isOpen = false" />
                <nav class="NuxtUi-flex NuxtUi-flex-col NuxtUi-gap-2">
                    <NuxtUiButton variant="ghost" to="/">Home</NuxtUiButton>
                    <NuxtUiButton variant="ghost" to="/about">About</NuxtUiButton>
                    <NuxtUiButton variant="ghost" to="/contact">Contact</NuxtUiButton>
                </nav>
            </div>
        </NuxtUiSlideover>
    </div>
</template>
