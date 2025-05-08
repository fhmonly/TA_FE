<template>
    <p class="text-sm text-gray-500 text-center mb-4">
        Create your account to get started with predictive financial insights
    </p>

    <NuxtUiForm :schema="schema" :state="registerForm" class="space-y-4" @submit="registerNow">
        <NuxtUiFormGroup label="Email" name="email" :error="!!isEmailAlreadyRegistered ? 'Email already used.' : ''">
            <NuxtUiInput v-model="registerForm.email" icon="i-heroicons-envelope" />
        </NuxtUiFormGroup>

        <NuxtUiFormGroup label="Password" name="password">
            <NuxtUiInput v-model="registerForm.password" type="password" icon="i-heroicons-lock-closed" />
        </NuxtUiFormGroup>

        <NuxtUiFormGroup label="Re-Enter Password" name="password_confirmation">
            <NuxtUiInput v-model="registerForm.password_confirmation" type="password" icon="i-heroicons-lock-closed" />
        </NuxtUiFormGroup>

        <NuxtUiButton type="submit" :loading="isSubmitting">
            Submit
        </NuxtUiButton>
    </NuxtUiForm>
    <AuthModalEmailActivationSent v-model="registeredModalShown">
        <template #header>
            Registration Successful
        </template>
        {{ registerData?.message || 'User registered. Please check your email to verify your account.'
        }}
        <template #footer>
            <NuxtUiButton color="green" class="mt-4" @click="onRegisteredModalBtnClick">
                OK
            </NuxtUiButton>
        </template>
    </AuthModalEmailActivationSent>
</template>

<script setup lang="ts">

const emit = defineEmits(['is-loading'])

const {
    registerForm, schema,
    isEmailAlreadyRegistered,
    registerNow, registerStatus,
    registerData, registerError
} = useAuthRegister()

const registeredModalShown = ref(false)
function onRegisteredModalBtnClick() {
    window.location.href = '/auth'
}

const isSubmitting = ref<boolean>(false)
watch(isSubmitting, newVal => emit('is-loading', newVal))
watch(registerStatus, newVal => {
    if (newVal === 'pending') {
        isSubmitting.value = true
    } else {
        isSubmitting.value = false
    }
    if (newVal === 'success') {
        registeredModalShown.value = true
    }
})
</script>
