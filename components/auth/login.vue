<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const route = useRoute();
const emit = defineEmits(['is-loading', 'section:forgot-password'])

const invalidCredentials = ref<boolean>(false)

const isSubmitting = ref<boolean>(false)
watch(isSubmitting, newVal => emit('is-loading', newVal))

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
    password: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isSubmitting.value = true
    setTimeout(() => {
        const { email, password } = event.data
        if (email === 'fahim@gmail.com' && password === '99999999') {
            isSubmitting.value = false
            invalidCredentials.value = false
            console.log('✅ Data User:', event.data)
            return
        }

        invalidCredentials.value = true
        isSubmitting.value = false
    }, 3000);
}
</script>

<template>
    <p class="text-sm text-gray-500 text-center mb-4">
        Login to access your stock predictions dashboard
    </p>

    <NuxtUiForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <NuxtUiFormGroup label="Email" name="email" :error="invalidCredentials ? 'Invalid Email or Password' : ''">
            <NuxtUiInput v-model="state.email" icon="i-heroicons-envelope" />
        </NuxtUiFormGroup>

        <NuxtUiFormGroup label="Password" name="password"
            :error="invalidCredentials ? 'Invalid Email or Password' : ''">
            <template #hint>
                <NuxtUiButton type="button" @click="emit('section:forgot-password')" color="blue" variant="link"
                    class="pe-0">
                    Forgot Password?
                </NuxtUiButton>
            </template>
            <NuxtUiInput v-model="state.password" type="password" icon="i-heroicons-lock-closed" id="auth-pw" />
        </NuxtUiFormGroup>


        <NuxtUiButton type="submit" :loading="isSubmitting">
            Submit
        </NuxtUiButton>
    </NuxtUiForm>
</template>