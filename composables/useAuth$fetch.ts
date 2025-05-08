import { useLocalStorage } from '@vueuse/core';
import type { AsyncDataRequestStatus } from 'nuxt/app';
import type { TAPIResponse } from '~/types/api-response/basicResponse';
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';

export function use$fetchWithAutoReNew<Data = TAPIResponse, ErrorData = Error>(
    url: string,
    options?: NitroFetchOptions<NitroFetchRequest>
) {
    const config = useRuntimeConfig();
    const { authState, apiAccessToken } = useMyAppState();

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

    async function refreshAccessToken(): Promise<boolean> {
        try {
            let newAccessToken = null
            const res = await $fetch<TAPIResponse<{ accessToken: string }>>('/auth/refresh-token', {
                baseURL: config.public.API_HOST,
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                },
                onResponse: async (ctx) => {
                    if (ctx.response.ok) {
                        newAccessToken = ctx.response._data.data.accessToken;
                    }
                },
                onResponseError: async (ctx) => {
                    const statusCode = ctx.response?.status;

                    if ([401, 403].includes(statusCode)) {
                        authState.value = 'logged-out'
                        apiAccessToken.value = null;
                    }
                },
            });

            if (!!newAccessToken) {
                apiAccessToken.value = newAccessToken;
                return true;
            }

            throw new Error('No accessToken received');
        } catch (e) {
            console.error('🔄 Failed to refresh token', e);
            return false;
        }
    }

    async function execute() {
        status.value = 'pending';
        error.value = null;

        try {
            await $fetch<Data>(url, {
                ...options,
                headers: headers.value,
                baseURL: config.public.API_HOST,
                // credentials: 'include',
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
                        const refreshed = await refreshAccessToken();
                        if (refreshed) {
                            await execute();
                            return;
                        }
                    }

                    if (typeof options?.onResponseError === 'function') {
                        await options?.onResponseError?.(ctx);
                    }
                    status.value = 'error';
                },
            });
        } catch (err) {
            error.value = err as ErrorData;
            status.value = 'error';
            console.error('❌ Fetch failed:', err);
        }
    }

    return { data, status, error, execute };
}
