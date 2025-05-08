export default defineNuxtRouteMiddleware(async (to, from) => {
    const route = useRoute();
    const forgotPasswordToken = route.params.token
    const forgotPasswordState = useState<'valid' | 'invalid' | 'unset'>('forgot-password-state', () => 'unset')

    if (!!forgotPasswordToken) {
        const { execute } = use$fetchWithAutoReNew(`/auth/forgot-password/${forgotPasswordToken}`, {
            onResponse(ctx) {
                forgotPasswordState.value = 'valid'
            },
            onResponseError(ctx) {
                forgotPasswordState.value = 'invalid'
            }
        })
        await execute()
    }
});
