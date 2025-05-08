<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
definePageMeta({
    middleware: ['forgot-password-confirmation'],
});

const forgotPasswordState = useState<'valid' | 'invalid' | 'unset'>('forgot-password-state', () => 'unset')

const authSection = useState<'login' | 'register' | 'forgot-password'>('auth-section', () => 'login')

const {
    forgotPasswordForm, schema,
    submitNow, submitStatus,
    isTokenExpired
} = useAuthForgotPasswordChangePassword()
</script>

<template>
    <NuxtLayout name="default">
        <section class="min-h-screen flex items-center justify-center px-4">
            <div class="w-full max-w-sm">
                <div v-if="submitStatus === 'success'">
                    <NuxtUiCard class="text-center space-y-2">
                        <NuxtUiIcon name="lucide:check-circle" class="text-green-600 w-11 h-11 mx-auto" />
                        <div class="space-y-4">
                            <h2 class="text-lg font-semibold">Password Updated</h2>
                            <p class="text-sm text-gray-600">Your password has been successfully reset. You can now log
                                in with your new password.</p>
                        </div>
                        <template #footer>
                            <NuxtUiButton @click="() => {
                                authSection = 'login'
                                navigateTo('/auth')
                            }">Back to Login</NuxtUiButton>
                        </template>
                    </NuxtUiCard>
                </div>

                <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50"
                    v-else-if="forgotPasswordState === 'valid' && !isTokenExpired">
                    <div
                        class="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">

                        <div class="p-6 border-b border-gray-100">
                            <h2 class="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                <NuxtUiIcon name="i-heroicons-key" />
                                Reset Password
                            </h2>
                            <p class="text-gray-500 mt-1 text-sm">Create a new secure password for your account</p>
                        </div>

                        <div class="px-6">
                            <NuxtUiForm :schema="schema" :state="forgotPasswordForm" class="space-y-5"
                                @submit="submitNow">
                                <NuxtUiFormGroup label="New Password" name="password">
                                    <NuxtUiInput v-model="forgotPasswordForm.password" type="password"
                                        placeholder="Enter your new password" class="focus:ring-primary" />
                                </NuxtUiFormGroup>

                                <NuxtUiFormGroup label="Confirm New Password" name="password_confirmation">
                                    <NuxtUiInput v-model="forgotPasswordForm.password_confirmation" type="password"
                                        placeholder="Confirm your new password" class="focus:ring-primary" />
                                </NuxtUiFormGroup>

                                <div class="pt-2">
                                    <NuxtUiButton type="submit" :loading="submitStatus === 'pending'" block
                                        class="bg-primary hover:bg-primary/90 transition-colors">
                                        <template #leading>
                                            <SaveIcon v-if="submitStatus !== 'pending'" class="h-4 w-4" />
                                        </template>
                                        {{ submitStatus === 'pending' ? 'Processing...' : 'Reset Password' }}
                                    </NuxtUiButton>
                                </div>
                            </NuxtUiForm>
                        </div>

                        <div class="px-6 py-4 bg-gray-50 text-center">
                            <NuxtUiButton @click="() => {
                                authSection = 'login'
                                navigateTo('/auth')
                            }" variant="link" class="text-sm text-primary hover:underline">
                                Return to login
                            </NuxtUiButton>
                        </div>
                    </div>
                </div>

                <div v-else-if="forgotPasswordState === 'invalid' || isTokenExpired">
                    <NuxtUiCard class="text-center space-y-2">
                        <template #header>
                            <h2 class="text-xl font-semibold text-red-600">Invalid or Expired Token</h2>
                        </template>

                        <p class="text-gray-700">
                            The password reset link you used is either invalid, expired, or has already been used.
                        </p>
                        <p class="mt-2 text-gray-600">
                            Please request a new reset link to continue.
                        </p>

                        <template #footer>
                            <NuxtUiButton color="primary" @click="() => {
                                authSection = 'forgot-password'
                                navigateTo('/auth')
                            }">
                                Request New Link
                            </NuxtUiButton>
                        </template>
                    </NuxtUiCard>
                </div>
            </div>
        </section>
    </NuxtLayout>

</template>