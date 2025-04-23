<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
definePageMeta({
    middleware: ['forgot-password-confirmation'],
});
const forgotPasswordTokenStatus = useState<'unset' | 'invalid' | 'valid'>('forgot-password-token-status', () => 'unset')
const authSection = useState<'login' | 'register' | 'forgot-password'>('auth-section', () => 'login')

const isSubmitting = ref<boolean>(false)

const baseSchema = z.object({
    newPassword: z.string().min(8, 'Must be at least 8 characters'),
    newPassword2: z.string().min(8, 'Must be at least 8 characters')
})

const schema = baseSchema
    .refine((data) => data.newPassword === data.newPassword2, {
        message: "Passwords don't match",
        path: ['newPassword2'],
    })

type Schema = z.output<typeof schema>

const state = reactive({
    newPassword: undefined,
    newPassword2: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isSubmitting.value = true
    setTimeout(() => {
        isSubmitting.value = false
    }, 3000);
}
</script>

<template>
    <NuxtLayout name="default">
        <div class="my-auto p-5">
            <div class="grid grid-cols-1 max-w-sm mx-auto">
                <div class="pb-3 flex gap-3">
                    <NuxtUiButton to="/auth/forgot-password/success">true</NuxtUiButton>
                    <NuxtUiButton to="/auth/forgot-password/invalid">false</NuxtUiButton>
                </div>
                <div class="w-full">
                    <div v-if="forgotPasswordTokenStatus === 'valid'">
                        <NuxtUiForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                            <NuxtUiFormGroup label="New Password" name="password">
                                <NuxtUiInput v-model="state.newPassword" />
                            </NuxtUiFormGroup>

                            <NuxtUiFormGroup label="New Password Confirmation" name="password_confirmation">
                                <NuxtUiInput v-model="state.newPassword2" type="password" />
                            </NuxtUiFormGroup>

                            <NuxtUiButton type="submit" :loading="isSubmitting">
                                Submit
                            </NuxtUiButton>
                        </NuxtUiForm>
                    </div>
                    <div v-else>
                        <NuxtUiCard class="max-w-md mx-auto text-center">
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
                                    authSection = 'forgot-password',
                                        navigateTo('/auth')
                                }">
                                    Request New Link
                                </NuxtUiButton>
                            </template>
                        </NuxtUiCard>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>