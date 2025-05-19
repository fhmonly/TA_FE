<template>
    <div class="relative rounded-lg overflow-hidden p-4 ">
        <slot></slot>
        <div class="p-4">
            <div class="flex flex-col items-center space-y-3 mb-4">
                <NuxtImg src="/assets/icons/logo.png" height="44" width="44" type="webp" />
                <h2 class="text-2xl font-bold mt-[0_!important]">
                    <span class="text-blue-700">Stok</span>
                    <span class="text-yellow-300">In</span>
                </h2>
            </div>
            <div v-if="authSectionIsLoading"
                class="absolute top-0 left-0 right-0 bottom-0 z-30 flex backdrop-brightness-75">
                <div class="flex flex-col w-1/2 m-auto items-center justify-center">
                    <MyLoaderPadlock class="scale-50" />
                    <p>Please Wait...</p>
                </div>
            </div>
            <div v-if="authSection === 'login'">
                <AuthLogin @is-loading="e => authSectionIsLoading = e"
                    @section:forgot-password="authSection = 'forgot-password'" />
                <div class="mt-4 flex justify-center items-center">
                    <span>
                        Tidak punya akun?
                    </span>
                    <NuxtUiButton label="Daftar" variant="link" @click="authSection = 'register'" />
                </div>
            </div>
            <div v-else-if="authSection === 'register'">
                <AuthRegister @is-loading="e => authSectionIsLoading = e" />
                <div class="mt-4 flex justify-center items-center">
                    <span>
                        Sudah punya akun?
                    </span>
                    <NuxtUiButton label="Masuk" variant="link" @click="authSection = 'login'" />
                </div>
            </div>
            <div v-else-if="authSection === 'forgot-password'">
                <AuthForgotPassword @is-loading="e => authSectionIsLoading = e" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { AuthForgotPassword } from '#components';

const authSection = useState<'login' | 'register' | 'forgot-password'>('auth-section', () => 'login')
const authSectionIsLoading = ref<boolean>(false)
</script>