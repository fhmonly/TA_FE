import type { UseFetchOptions } from 'nuxt/app';
import type { TAPIResponse } from '~/types/api-response/basicResponse';

export function useFetchWithAutoReNew<Data = TAPIResponse>(
    url: string | Request | Ref<string | Request> | (() => string | Request),
    options?: UseFetchOptions<Data>
) {
    const isWaiting = ref<boolean>(false)
    const config = useRuntimeConfig();
    const { apiAccessToken, apiAccessTokenStatus } = useMyAppState();

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
        credentials: 'include',
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
                isWaiting.value = true
                apiAccessTokenStatus.value = 'expired'
            }
            if (typeof options?.onResponseError === "function") {
                options.onResponseError(ctx);
            }
        },
        immediate: false,
    };

    const { data, status, error, refresh, clear } = useFetch(url, mergedOptions)

    watch(apiAccessTokenStatus, newVal => {
        if (newVal === 'valid' && isWaiting.value) {
            refresh()
            isWaiting.value = false
        }
    })

    refresh()
    return { data, status, error, refresh, clear }
}

