<script setup lang="ts">
import { z } from 'zod'
import { useAuthLogin } from '~/composables/useAuth'
const emit = defineEmits(['is-loading', 'section:forgot-password'])

const invalidCredentials = ref<boolean>(false)

const isSubmitting = ref<boolean>(false)
watch(isSubmitting, newVal => emit('is-loading', newVal))

const {
    loginForm, schema,
    loginNow, loginStatus,
} = useAuthLogin()

watch(loginStatus, newVal => {
    if (newVal === 'success' || newVal === 'pending') {
        isSubmitting.value = true
    } else {
        isSubmitting.value = false
    }
})

</script>

<template>
    <p class="text-sm text-gray-500 text-center mb-4">
        Login to access your stock predictions dashboard
    </p>

    <NuxtUiForm :schema="schema" :state="loginForm" class="space-y-4" @submit="loginNow">
        <NuxtUiFormGroup label="Email" name="email" :error="invalidCredentials ? 'Invalid Email or Password' : ''">
            <NuxtUiInput v-model="loginForm.email" icon="i-heroicons-envelope" />
        </NuxtUiFormGroup>

        <NuxtUiFormGroup label="Password" name="password"
            :error="invalidCredentials ? 'Invalid Email or Password' : ''">
            <template #hint>
                <NuxtUiButton type="button" @click="emit('section:forgot-password')" color="blue" variant="link"
                    class="pe-0">
                    Forgot Password?
                </NuxtUiButton>
            </template>
            <NuxtUiInput v-model="loginForm.password" type="password" icon="i-heroicons-lock-closed" id="auth-pw" />
        </NuxtUiFormGroup>

        <NuxtUiButton type="submit" :loading="isSubmitting">
            Submit
        </NuxtUiButton>
    </NuxtUiForm>
</template>