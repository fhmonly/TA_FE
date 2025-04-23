<template>
    <p class="text-sm text-gray-500 text-center mb-4">
        Create your account to get started with predictive financial insights
    </p>

    <NuxtUiForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <NuxtUiFormGroup label="Email" name="email" :error="!!usedEmail ? 'Email telah digunakan.' : ''">
            <NuxtUiInput v-model="state.email" icon="i-heroicons-envelope" />
        </NuxtUiFormGroup>

        <NuxtUiFormGroup label="Password" name="password">
            <NuxtUiInput v-model="state.password" type="password" icon="i-heroicons-lock-closed" />
        </NuxtUiFormGroup>

        <NuxtUiFormGroup label="Re-Enter Password" name="password_confirmation">
            <NuxtUiInput v-model="state.password_confirmation" type="password" icon="i-heroicons-lock-closed" />
        </NuxtUiFormGroup>

        <NuxtUiButton type="submit" :loading="isSubmitting">
            Submit
        </NuxtUiButton>
    </NuxtUiForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const emit = defineEmits(['is-loading'])

const usedEmail = ref<string | null>(null)

const isSubmitting = ref<boolean>(false)
watch(isSubmitting, newVal => emit('is-loading', newVal))

const baseSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters'),
    password_confirmation: z.string().min(8, 'Must be at least 8 characters'),
})

const schema = baseSchema
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    })

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
    email: '',
    password: '',
    password_confirmation: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    isSubmitting.value = true
    setTimeout(() => {
        if (event.data.email === 'fahim@gmail.com') {
            usedEmail.value = 'fahim@gmail.com'
            isSubmitting.value = false
            return
        }

        usedEmail.value = null
        console.log('✅ Data User:', event.data)
        isSubmitting.value = false
    }, 3000);
}
</script>
