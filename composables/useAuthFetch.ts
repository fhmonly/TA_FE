import { useLocalStorage, useNetwork } from '@vueuse/core';
import type { UseFetchOptions } from 'nuxt/app';
import type { TAPIResponse } from '~/types/api-response/basicResponse';

export function useFetchWithAutoReNew<Data = TAPIResponse>(
    url: string | Request | Ref<string | Request> | (() => string | Request),
    options?: UseFetchOptions<Data>
) {
    const config = useRuntimeConfig();
    const { authState, apiAccessToken } = useMyAppState();

    const originalHeadersAsObject = () => {
        if (options?.headers) {
            if (Array.isArray(options.headers)) {
                return Object.fromEntries(options.headers as any[][]);
            } else {
                return options.headers;
            }
        }
    }

    const headers = computed<HeadersInit>(() => {
        return {
            ...originalHeadersAsObject,
            Authorization: `Bearer ${apiAccessToken.value}`,
            Accept: 'application/json',
        };
    });

    const mergedOptions: UseFetchOptions<Data> = {
        ...options,
        headers,
        baseURL: config.public.API_HOST,
        async onResponse(ctx) {
            if (ctx.response.ok) {
                if (typeof options?.onResponse === "function") {
                    options.onResponse(ctx);
                }
            }
        },
        async onResponseError(ctx) {
            const status = ctx.response.status;
            if ([401, 403].includes(status)) {
                await refreshAccessToken()
            }
            if (typeof options?.onResponseError === "function") {
                options.onResponseError(ctx);
            }
        },
    };

    const { data, status, error, refresh, clear } = useFetch(url, mergedOptions)

    async function refreshAccessToken(): Promise<boolean> {
        try {
            let newAccessToken = null
            await $fetch<TAPIResponse<{
                accessToken: string
            }>>(`/auth/refresh-token`, {
                baseURL: config.public.API_HOST,
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json'
                },
                onResponse: async (ctx) => {
                    if (ctx.response.ok) {
                        newAccessToken = ctx.response._data.data.accessToken;
                    }
                },
                onResponseError: async (ctx) => {
                    error.value = ctx?.error ?? ctx.response._data ?? null;
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
            console.error("🔄 Failed to refresh token:", e);
            return false;
        } finally {

        }
    }

    return { data, status, error, refresh, clear }
}