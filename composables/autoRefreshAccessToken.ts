import type { TAPIResponse } from "~/types/api-response/basicResponse";

export function useAutoRefreshAccessToken() {
    const config = useRuntimeConfig()
    const { apiAccessToken, apiAccessTokenStatus, authState } = useMyAppState()

    async function refreshAccessToken() {
        try {
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
                        apiAccessToken.value = ctx.response._data.data.accessToken;
                        apiAccessTokenStatus.value = 'valid'
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
        } catch (e) {
            console.error("🔄 Failed to refresh token:", e);
        }
    }

    watch(apiAccessTokenStatus, newVal => {
        if (newVal === 'expired') {
            refreshAccessToken()
        }
    }, { immediate: true })
}