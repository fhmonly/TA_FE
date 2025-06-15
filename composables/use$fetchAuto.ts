import { useLocalStorage } from '@vueuse/core';
import type { AsyncDataRequestStatus } from 'nuxt/app';
import type { TAPIResponse } from '~/types/api-response/basicResponse';
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';

export function use$fetchWithAutoReNew<Data = TAPIResponse, ErrorData = Error>(
    url: string | MaybeRefOrGetter<string>,
    options?: NitroFetchOptions<NitroFetchRequest>
) {
    const toast = useToast()
    const isWaiting = ref<boolean>(false)
    const config = useRuntimeConfig();
    const { apiAccessToken, apiAccessTokenStatus } = useMyAppState();

    const headers = computed(() => {
        let h = {}
        if (!!options?.headers) {
            if (Array.isArray(options.headers)) {
                Object.assign(h, Object.fromEntries(options.headers))
            } else if (typeof options.headers === 'object') {
                Object.assign(h, options.headers)
            }
        }
        Object.assign(h, {
            Authorization: apiAccessToken.value ? `Bearer ${apiAccessToken.value}` : '',
            Accept: 'application/json',
        })
        return h
    })

    const data = ref<Data | null>(null);
    const status = ref<AsyncDataRequestStatus>('idle');
    const error = ref<ErrorData | null>(null);

    async function execute() {
        status.value = 'pending';
        error.value = null;
        const resolvedUrl = toValue(url)

        try {
            await $fetch<Data>(resolvedUrl, {
                ...options,
                headers: headers.value,
                baseURL: config.public.API_HOST,
                credentials: 'include',
                onResponse: async (ctx) => {
                    data.value = ctx.response._data;
                    if (ctx.response.ok) {
                        if (typeof options?.onResponse === 'function') {
                            await options.onResponse(ctx);
                        }
                        status.value = 'success';
                    }
                },
                onResponseError: async (ctx) => {
                    error.value = ctx?.error ?? ctx.response._data ?? null;
                    const statusCode = ctx.response?.status;

                    if ([401, 403].includes(statusCode)) {
                        isWaiting.value = true
                        apiAccessTokenStatus.value = 'expired'
                    }

                    if (typeof options?.onResponseError === 'function') {
                        await options?.onResponseError?.(ctx);
                    }
                    status.value = 'error';
                    if (!!ctx.response._data.message)
                        toast.add({
                            title: 'Error',
                            icon: 'i-heroicons-x-circle',
                            color: 'red',
                            description: ctx.response._data.message
                        })
                },
            });
        } catch (err) {
            error.value = err as ErrorData;
            status.value = 'error';
            console.error('❌ Fetch failed:', err);
        }
    }

    watch(apiAccessTokenStatus, newVal => {
        if (newVal === 'valid' && isWaiting.value) {
            execute()
            isWaiting.value = false
        }
    })

    return { data, status, error, execute };
}