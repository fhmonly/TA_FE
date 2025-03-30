<template>
    <!-- Navigation -->
    <header
        class="fixed left-0 right-0 top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <NuxtUiContainer>
            <div class="flex h-16 items-center">
                <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="text-primary-foreground">
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                            <path d="M21 3v5h-5"></path>
                        </svg>
                    </div>
                    <span class="text-xl font-bold">SmartLog</span>
                </div>

                <nav class="ml-auto flex items-center gap-4 sm:gap-6">
                    <div v-if="window.width.value <= 640">
                        <NuxtUiButton icon="i-heroicons-bars-3-bottom-left-16-solid" @click="isOpen = true"
                            color="white" variant="link" />

                        <NuxtUiSlideover v-model="isOpen" side="left">
                            <div class="p-4 flex flex-col h-full bg-gray-900 text-white">
                                <!-- Tombol close -->
                                <NuxtUiButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
                                    class="absolute end-5 top-5 z-10 " square padded @click="isOpen = false" />

                                <!-- Navigasi -->
                                <div class="mt-10 space-y-6">
                                    <NuxtLink to="/#features" class="text-lg block hover:text-green-500"
                                        @click="isOpen = false">
                                        Features
                                    </NuxtLink>
                                    <NuxtLink to="/#how-it-works" class="text-lg block hover:text-green-500"
                                        @click="isOpen = false">
                                        How It Works
                                    </NuxtLink>
                                    <NuxtLink to="/#pricing" class="text-lg block hover:text-green-500"
                                        @click="isOpen = false">
                                        Pricing
                                    </NuxtLink>
                                    <NuxtLink to="/demo" class="text-lg block text-green-500 font-semibold"
                                        @click="isOpen = false">
                                        Demo
                                    </NuxtLink>
                                </div>

                                <!-- Tombol "Get Started" -->
                                <div class="mt-auto flex justify-start">
                                    <NuxtUiButton label="Log In" color="green" />
                                </div>
                            </div>
                        </NuxtUiSlideover>
                    </div>
                    <div v-else class="ml-auto flex items-center gap-4 sm:gap-6">
                        <NuxtLink href="/#features" class="text-sm font-medium transition-colors hover:text-primary">
                            Features
                        </NuxtLink>
                        <NuxtLink href="/#how-it-works"
                            class="text-sm font-medium transition-colors hover:text-primary">How
                            It
                            Works</NuxtLink>
                        <NuxtLink href="/#pricing" class="text-sm font-medium transition-colors hover:text-primary">
                            Pricing
                        </NuxtLink>
                        <NuxtLink href="/demo"
                            class="text-sm font-medium text-primary transition-colors hover:text-primary/80">
                            Demo</NuxtLink>
                        <NuxtUiButton color="green">
                            Get Started
                        </NuxtUiButton>
                    </div>
                </nav>
            </div>
        </NuxtUiContainer>
    </header>
</template>
<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core';

const window = useWindowSize()
const isOpen = ref(false)
</script>