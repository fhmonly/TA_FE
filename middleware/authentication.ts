export default defineNuxtRouteMiddleware(async (to, from) => {
    const { apiAccessToken } = useMyAppState();

    if (!apiAccessToken.value) {
        let gotoAuth = false
        const { execute } = use$fetchWithAutoReNew('/auth/refresh-token', {
            onResponseError() {
                gotoAuth = true
            }
        })
        await execute()
        if (gotoAuth)
            return navigateTo('/auth')
    }
});
