import { z } from "zod"
import type { TAPIResponse } from "~/types/api-response/basicResponse"

export function useAuthLogin() {
    const { authState, apiAccessToken } = useMyAppState()

    type Schema = z.output<typeof schema>

    const loginForm = reactive<Schema>({
        email: '',
        password: ''
    })

    const schema = z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(8, 'Must be at least 8 characters')
    })

    const { execute: loginNow, status: loginStatus } = use$fetchWithAutoReNew<TAPIResponse<{
        accessToken: string
    }>>('/auth/login', {
        body: loginForm,
        method: 'post',
        credentials: 'include',
        onResponse(ctx) {
            authState.value = 'logged-in'
            apiAccessToken.value = ctx.response._data.data.accessToken
            navigateTo('/dashboard/home')
        }
    })

    return {
        loginForm, schema,
        loginNow, loginStatus
    }
}

export function useAuthLogout() {
    const { authState, apiAccessToken } = useMyAppState()

    const { execute: logoutNow, status: logoutStatus } = use$fetchWithAutoReNew('/auth/logout', {
        method: 'get',
        credentials: 'include',
        onResponse(ctx) {
            authState.value = 'logged-out'
            apiAccessToken.value = null
            navigateTo('/auth')
        }
    })

    return {
        logoutNow, logoutStatus
    }
}

export function useAuthRegister() {
    const config = useRuntimeConfig()
    const baseSchema = z.object({
        email: z.string().email('Invalid email'),
        password: z.string()
            .min(8, 'Must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
        password_confirmation: z.string().min(8, 'Must be at least 8 characters'),
        emailActivationPage: z.optional(z.string()),
    })

    const schema = baseSchema
        .refine((data) => data.password === data.password_confirmation, {
            message: "Passwords don't match",
            path: ['password_confirmation'],
        })

    type Schema = z.output<typeof schema>

    const registerForm = reactive<Schema>({
        email: '',
        password: '',
        password_confirmation: '',
        emailActivationPage: `${config.public.HOST}/auth/verify`
    })

    const isEmailAlreadyRegistered = ref<boolean>(false)

    const {
        execute: registerNow,
        status: registerStatus,
        error: registerError,
        data: registerData
    } = use$fetchWithAutoReNew<TAPIResponse<any>>('/auth/register', {
        method: 'post',
        body: registerForm,
        onResponseError(ctx) {
            if (ctx.response._data.message === 'Email already exists') {
                isEmailAlreadyRegistered.value = true
            }
        }
    })

    return { registerForm, schema, registerNow, registerStatus, registerData, registerError, isEmailAlreadyRegistered }
}

export function useAuthForgotPasswordGetToken() {
    const config = useRuntimeConfig()
    const schema = z.object({
        email: z.string().email('Invalid email'),
        emailActivationPage: z.optional(z.string()),
    })

    type Schema = z.output<typeof schema>

    const forgotPasswordForm = reactive<Schema>({
        email: '',
        emailActivationPage: `${config.public.HOST}/auth/forgot-password`
    })

    const isEmailNotActivated = ref(false)

    const {
        execute: submitNow,
        status: submitStatus,
        error: submitError,
        data: data
    } = use$fetchWithAutoReNew<TAPIResponse<any>>('/auth/forgot-password', {
        method: 'post',
        body: forgotPasswordForm,
        onResponseError(ctx) {
            if (ctx.response.status === 403) {
                isEmailNotActivated.value = true
            }
        }
    })

    return { forgotPasswordForm, schema, submitNow, submitStatus, data, submitError, isEmailNotActivated }
}

export function useAuthForgotPasswordChangePassword() {
    const route = useRoute();
    const baseSchema = z.object({
        password: z.string()
            .min(8, 'Must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
        password_confirmation: z.string().min(8, 'Must be at least 8 characters'),
    })

    const schema = baseSchema
        .refine((data) => data.password === data.password_confirmation, {
            message: "Passwords don't match",
            path: ['password_confirmation'],
        })

    type Schema = z.output<typeof schema>

    const forgotPasswordForm = reactive<Schema>({
        password: '',
        password_confirmation: ''
    })

    const isTokenExpired = ref<boolean>(false)

    const {
        execute: submitNow,
        status: submitStatus,
        error: submitError,
        data: data
    } = use$fetchWithAutoReNew<TAPIResponse<any>>(`/auth/forgot-password/${route.params.token}`, {
        method: 'patch',
        body: forgotPasswordForm,
        onResponseError(ctx) {
            isTokenExpired.value = true
        }
    })

    return { forgotPasswordForm, schema, submitNow, submitStatus, data, submitError, isTokenExpired }
}