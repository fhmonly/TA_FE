<template>
    <div>
        <p class="text-sm text-gray-500 text-center mb-4">
            Enter your email to receive password reset instructions
        </p>
        <NuxtUiForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit" v-if="!isEmailSent">
            <div class="flex gap-y-1 mt-4 divide-x-2 justify-end">
                <NuxtUiButton label="Login" variant="link" @click="authSection = 'login'" />
                <NuxtUiButton label="Register" variant="link" @click="authSection = 'register'" />
            </div>
            <NuxtUiFormGroup label="Email" name="email" :error="invalidCredentials ? 'Email not registered' : ''">
                <NuxtUiInput v-model="state.email" icon="i-heroicons-envelope" />
            </NuxtUiFormGroup>
            <NuxtUiButton :loading="isSubmitting" type="submit">
                Submit
            </NuxtUiButton>
        </NuxtUiForm>
        <div v-else>
            <NuxtUiCard class="p-4 text-center space-y-2">
                <NuxtUiIcon name="lucide:check-circle" class="text-green-600 w-6 h-6 mx-auto" />
                <h3 class="text-lg font-semibold">Email Sent</h3>
                <p class="text-sm text-gray-500">
                    We've sent you an email with a link to reset your password.
                    Please check your inbox and follow the instructions provided.
                </p>
            </NuxtUiCard>

            <div class="flex gap-2 mt-2">
                <NuxtUiButton to="/auth/forgot-password/success">true</NuxtUiButton>
                <NuxtUiButton to="/auth/forgot-password/invalid">false</NuxtUiButton>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types'

const authSection = useState<'login' | 'register' | 'forgot-password'>('auth-section', () => 'login')

const isSubmitting = ref<boolean>(false)
const invalidCredentials = ref<boolean>(false)
const isEmailSent = ref<boolean>(false)

const schema = z.object({
    email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isSubmitting.value = true
    isEmailSent.value = false
    setTimeout(() => {
        const { email } = event.data
        if (email === 'fahim@gmail.com') {
            isSubmitting.value = false
            invalidCredentials.value = false
            isEmailSent.value = true
            return
        }

        invalidCredentials.value = true
        isSubmitting.value = false
    }, 3000);
}
</script>