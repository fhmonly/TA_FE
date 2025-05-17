<template>
    <NuxtLayout name="default">
        <div class="min-h-screen flex items-center justify-center p-4">
            <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <!-- Unset state - Loading -->
                <div v-if="emailVerification === 'unset'" class="text-center">
                    <div class="flex justify-center mb-6">
                        <NuxtUiIcon name="i-lucide-loader-2" class="text-primary w-16 h-16 animate-spin" />
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Verifying Your Account</h1>
                    <p class="text-gray-600">Please wait while we verify your email address...</p>
                </div>

                <!-- Activated state - Success -->
                <div v-else-if="emailVerification === 'activated'" class="text-center">
                    <div class="flex justify-center mb-6">
                        <NuxtUiIcon name="i-lucide-check-circle" class="text-green-500 w-16 h-16" />
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Account Activated!</h1>
                    <p class="text-gray-600 mb-6">Your email has been verified successfully. You can now log in to your
                        account.</p>
                    <NuxtUiButton to="/auth" block color="primary" size="lg">
                        Go to Login
                    </NuxtUiButton>
                </div>

                <!-- Invalid token state - Error -->
                <div v-else-if="emailVerification === 'invalid-token'" class="text-center">
                    <div class="flex justify-center mb-6">
                        <NuxtUiIcon name="i-lucide-alert-triangle" class="text-red-500 w-16 h-16" />
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                    <p class="text-gray-600 mb-6">The activation link is invalid or has expired. Please request a new
                        verification email.</p>
                    <NuxtUiButton @click="isReSendEmailModalOpen = true" block color="primary" size="lg"
                        :loading="resendEmailStatus === 'pending'">
                        Request New Verification
                    </NuxtUiButton>
                    <div class="mt-4">
                        <NuxtUiButton @click="isHelpModalOpen = true" variant="ghost" size="sm" class="text-gray-600">
                            Need Help?
                        </NuxtUiButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Help Modal -->
        <NuxtUiModal v-model="isHelpModalOpen" :ui="{ width: 'sm:max-w-lg' }">
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-900">How to Find Your Verification Email</h3>
                    <NuxtUiButton icon="i-lucide-x" color="gray" variant="ghost" size="sm"
                        @click="isHelpModalOpen = false" />
                </div>

                <div class="space-y-4 text-gray-700">
                    <p>If you can't find your verification email in your inbox, it might be in your spam or junk folder.
                        Here's how to check:</p>

                    <div class="space-y-2">
                        <h4 class="font-semibold">Gmail:</h4>
                        <ol class="list-decimal ml-5 space-y-1">
                            <li>Look for the "Spam" folder in the left sidebar</li>
                            <li>Click on "Spam" to open the folder</li>
                            <li>Search for emails from our domain</li>
                            <li>If found, mark it as "Not spam" to ensure future emails arrive in your inbox</li>
                        </ol>
                    </div>

                    <div class="space-y-2">
                        <h4 class="font-semibold">Outlook/Hotmail:</h4>
                        <ol class="list-decimal ml-5 space-y-1">
                            <li>Check the "Junk Email" folder in the left sidebar</li>
                            <li>If found, right-click the email and select "Mark as not junk"</li>
                        </ol>
                    </div>

                    <div class="space-y-2">
                        <h4 class="font-semibold">Yahoo Mail:</h4>
                        <ol class="list-decimal ml-5 space-y-1">
                            <li>Check the "Spam" folder in the left sidebar</li>
                            <li>If found, click "Not Spam" to move it to your inbox</li>
                        </ol>
                    </div>

                    <p class="mt-4">Still can't find it? Click the button below to request a new verification email.</p>
                </div>

                <div class="mt-6 flex justify-between">
                    <NuxtUiButton @click="isHelpModalOpen = false" variant="outline">Close</NuxtUiButton>
                    <NuxtUiButton @click="isReSendEmailModalOpen = true" color="primary">Request New Email
                    </NuxtUiButton>
                </div>
            </div>
        </NuxtUiModal>

        <MyModalBasicConfirmation v-model="isReSendEmailModalOpen">
            <template #header>
                <h3 class="text-lg font-semibold">Resend Activation Email?</h3>
            </template>
            <p class="text-gray-600">
                We will resend the activation email to your registered email address.
                Make sure to also check your spam or junk folder.
            </p>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <NuxtUiButton color="gray" variant="soft" @click="isReSendEmailModalOpen = false">
                        Cancel
                    </NuxtUiButton>

                    <NuxtUiButton :loading="resendEmailStatus === 'pending'" color="green" @click="resendNow">
                        Resend
                    </NuxtUiButton>
                </div>
            </template>
        </MyModalBasicConfirmation>

        <AuthModalEmailActivationSent v-model="isEmailActivationSentModalIsOpen">
            <template #header>
                Email Sent Successful
            </template>
            {{ data?.message || 'Email activation link sent successful. Please check your inbox or spam.'
            }}
        </AuthModalEmailActivationSent>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import type { TAPIResponse } from '~/types/api-response/basicResponse';

definePageMeta({
    middleware: ['guest', 'account-activation']
})

const route = useRoute();
const config = useRuntimeConfig()

const emailVerification = useState<'activated' | 'invalid-token' | 'unset'>('email-verification-state', () => 'unset')

const isHelpModalOpen = ref(false)
const isReSendEmailModalOpen = ref(false)

const isEmailActivationSentModalIsOpen = ref(false)

const { execute: resendNow, data, status: resendEmailStatus } = use$fetchWithAutoReNew<TAPIResponse>(`/auth/re-send-email-activation/${route.params.token}`, {
    method: "post",
    body: {
        emailActivationPage: `${config.public.HOST}/auth/verify`
    },
    onResponse() {
        isHelpModalOpen.value = false
        isReSendEmailModalOpen.value = false
        isEmailActivationSentModalIsOpen.value = true
    },
    onResponseError() {
        navigateTo('/auth')
    }
})
</script>