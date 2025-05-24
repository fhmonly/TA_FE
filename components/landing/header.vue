<template>
    <!-- Navigation -->
    <header
        class="fixed left-0 right-0 top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <NuxtUiContainer>
            <div class="flex h-16 items-center">
                <NuxtLink href="/" class="flex items-center gap-2">
                    <NuxtImg src="/assets/icons/logo-text.png" width="auto" height="44" format="webp" />
                </NuxtLink>

                <nav class="ml-auto flex items-center gap-4 sm:gap-6">
                    <div v-if="window.width.value <= 640">
                        <NuxtUiButton icon="i-heroicons-bars-3-bottom-left-16-solid" @click="isOpen = true"
                            color="white" variant="link" />

                        <NuxtUiSlideover v-model="isOpen" side="left">
                            <div class="p-4 flex flex-col h-full bg-white dark:bg-gray-900 text-black dark:text-white">
                                <!-- Tombol close -->
                                <NuxtUiButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
                                    class="absolute end-5 top-5 z-10 " square padded @click="isOpen = false" />

                                <!-- Navigasi -->
                                <div class="mt-10 space-y-3">
                                    <NuxtLink to="/#how-it-works" class="text-lg block hover:text-green-500"
                                        @click="isOpen = false">
                                        How It Works?
                                    </NuxtLink>
                                    <NuxtLink to="/#features" class="text-lg block hover:text-green-500"
                                        @click="isOpen = false">
                                        Features
                                    </NuxtLink>
                                    <NuxtLink to="/dashboard/home" class="text-lg block hover:text-green-500"
                                        @click="isOpen = false" v-if="authState === 'logged-in'">
                                        Dashboard
                                    </NuxtLink>
                                    <NuxtLink to="/demo" class="text-lg block text-green-500 font-semibold"
                                        @click="isOpen = false" v-if="authState !== 'logged-in'">
                                        Demo
                                    </NuxtLink>
                                </div>

                                <!-- Tombol "Get Started" -->
                                <div class="mt-auto flex justify-start" v-if="authState !== 'logged-in'">
                                    <NuxtUiButton color="green" @click="() => {
                                        if (route.path.startsWith('/auth/forgot-password')) {
                                            navigateTo('/auth')
                                        } else {
                                            authModalIsOpen = true
                                            isOpen = false
                                        }
                                    }">
                                        Log In
                                    </NuxtUiButton>
                                </div>
                            </div>
                        </NuxtUiSlideover>
                    </div>
                    <div v-else class="ml-auto flex items-center gap-4 sm:gap-6">
                        <NuxtLink href="/#how-it-works"
                            class="text-sm font-medium transition-colors hover:text-primary">How
                            It
                            Works</NuxtLink>
                        <NuxtLink href="/#features" class="text-sm font-medium transition-colors hover:text-primary">
                            Features
                        </NuxtLink>
                        <NuxtLink href="/demo"
                            class="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                            v-if="authState !== 'logged-in'">
                            Demo</NuxtLink>
                        <NuxtUiButton label="Dashboard" v-if="authState === 'logged-in'" />
                        <NuxtUiButton color="green" @click="() => {
                            if (route.path.startsWith('/auth/forgot-password')) {
                                navigateTo('/auth')
                            } else {
                                authModalIsOpen = true
                            }
                        }" v-else>
                            Log In
                        </NuxtUiButton>
                    </div>
                </nav>
            </div>
            <NuxtUiModal v-model="authModalIsOpen" prevent-close :ui="{
                width: 'w-full max-w-screen-mobile sm:max-w-screen-mobile',
            }">
                <Auth @vue:mounted="authSection = 'login'">
                    <div class="flex justify-end">
                        <NuxtUiButton icon="i-heroicons-x-mark-16-solid" color="red" @click="authModalIsOpen = false" />
                    </div>
                </Auth>
            </NuxtUiModal>
        </NuxtUiContainer>
    </header>
</template>
<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core';
const window = useWindowSize()
const isOpen = ref(false)
const authModalIsOpen = ref<boolean>(false)
const route = useRoute();
const authSection = useState<'login' | 'register' | 'forgot-password'>('auth-section', () => 'login')
const {
    authState
} = useMyAppState()
</script>