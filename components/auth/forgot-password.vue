<template>
    <div>
        <p class="text-sm text-gray-500 text-center mb-4">
            Enter your email to receive password reset instructions
        </p>
        <NuxtUiForm :schema="schema" :state="forgotPasswordForm" class="space-y-4" @submit="submitNow"
            v-if="submitStatus !== 'success'">
            <div class="flex gap-y-1 mt-4 divide-x-2 justify-end">
                <NuxtUiButton label="Login" variant="link" @click="authSection = 'login'" />
                <NuxtUiButton label="Register" variant="link" @click="authSection = 'register'" />
            </div>
            <NuxtUiFormGroup label="Email" name="email">
                <NuxtUiInput v-model="forgotPasswordForm.email" icon="i-heroicons-envelope" />
            </NuxtUiFormGroup>
            <NuxtUiButton :loading="submitStatus === 'pending'" type="submit">
                Submit
            </NuxtUiButton>
        </NuxtUiForm>
        <div v-else-if="submitStatus === 'success'">
            <NuxtUiCard class="p-4 text-center space-y-2">
                <NuxtUiIcon name="lucide:check-circle" class="text-green-600 w-6 h-6 mx-auto" />
                <h3 class="text-lg font-semibold">Email Sent</h3>
                <p class="text-sm text-gray-500">
                    {{ data?.message || `We've sent you an email with a link to reset your password.
                    Please check your inbox and follow the instructions provided.`}}
                </p>
            </NuxtUiCard>
        </div>
        <NuxtUiModal v-model="showEmailNotActivatedModal" title="Email Not Activated" v-if="submitStatus !== 'success'"
            :prevent-close="true">
            <NuxtUiCard class="p-4 text-center space-y-2">
                <div class="space-y-4">
                    <NuxtUiIcon name="i-heroicons-exclamation-triangle" class="text-orange-500 leading-none mx-auto"
                        style="font-size: 64px;" />
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold">{{ data?.message || 'Email not activated' }}</h3>
                        <p class="text-sm text-gray-500">
                            Your email has not been activated. Please check your inbox or spam folder for
                            the activation
                            email.
                        </p>
                    </div>
                </div>
                <template #footer>
                    <div class="flex justify-center">
                        <NuxtUiButton @click="showEmailNotActivatedModal = false">Confirm</NuxtUiButton>
                    </div>
                </template>
            </NuxtUiCard>
        </NuxtUiModal>
    </div>
</template>
<script lang="ts" setup>
const authSection = useState<'login' | 'register' | 'forgot-password'>('auth-section', () => 'login')

const {
    forgotPasswordForm, schema,
    submitNow, data, submitError, submitStatus,
    isEmailNotActivated
} = useAuthForgotPasswordGetToken()

const showEmailNotActivatedModal = ref(false)

watch(submitStatus, (val) => {
    if (val === 'error' && isEmailNotActivated.value) {
        showEmailNotActivatedModal.value = true
    }
})
</script>