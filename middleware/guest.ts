export default defineNuxtRouteMiddleware(async (to, from) => {
    const { authState } = useMyAppState();

    if (authState.value === 'logged-in') {
        let gotoDashboard = false
        const { execute } = use$fetchWithAutoReNew('/is-authenticated', {
            onResponse() {
                gotoDashboard = true
            }
        })
        await execute()
        if (gotoDashboard)
            return navigateTo('/dashboard/home')
    }
});
