import type { UseFetchOptions } from 'nuxt/app'
import type { TAPIResponse } from '~/types/api-response/basicResponse'

export function useFetchWithAutoReNew<Data = TAPIResponse>(
    url: string | Request | Ref<string | Request> | (() => string | Request),
    options?: UseFetchOptions<Data>
) {
    const toast = useToast()
    const toastConfig = reactive({
        timer: 5000
    })
    const isWaiting = ref<boolean>(false)
    const config = useRuntimeConfig()
    const { apiAccessToken, apiAccessTokenStatus } = useMyAppState()

    // Convert headers to object (support array format from options.headers)
    const originalHeadersAsObject = () => {
        if (options?.headers) {
            if (Array.isArray(options.headers)) {
                return Object.fromEntries(options.headers as any[][])
            } else {
                return options.headers
            }
        }
        return {}
    }

    // ⚠️ FIX: Jangan reactive. Ambil snapshot headers saat pertama kali setup.
    const staticHeaders: HeadersInit = {
        ...originalHeadersAsObject(),
        Authorization: `Bearer ${apiAccessToken.value}`,
        Accept: 'application/json',
    }

    const mergedOptions: UseFetchOptions<Data> = {
        baseURL: config.public.API_HOST,
        credentials: 'include',
        ...options,
        headers: staticHeaders,
        async onResponse(ctx) {
            if (ctx.response.ok && typeof options?.onResponse === 'function') {
                options.onResponse(ctx)
            }
        },
        async onResponseError(ctx) {
            const status = ctx.response.status
            if ([401, 403].includes(status)) {
                isWaiting.value = true
                apiAccessTokenStatus.value = 'expired'
            }
            if (typeof options?.onResponseError === 'function') {
                options.onResponseError(ctx)
            }
            if (!!ctx.response._data.message && toastConfig.timer) {
                toast.add({
                    title: 'Error',
                    icon: 'i-heroicons-x-circle',
                    color: 'red',
                    description: ctx.response._data.message,
                    timeout: toastConfig.timer
                })
            }
        },
    }

    const useFetchResult = useFetch(url, mergedOptions)

    // Handle token refresh
    watch(apiAccessTokenStatus, (newVal) => {
        if (newVal === 'valid' && isWaiting.value) {
            useFetchResult.refresh()
            isWaiting.value = false
        }
    })

    return { ...useFetchResult, toastConfig }
}
