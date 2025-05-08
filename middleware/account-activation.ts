export default defineNuxtRouteMiddleware(async (to, from) => {
    const route = useRoute();
    const activationToken = route.params.token
    const emailVerification = useState<'activated' | 'invalid-token' | 'unset'>('email-verification-state', () => 'unset')

    if (!!activationToken) {
        const { execute } = use$fetchWithAutoReNew(`/auth/verify/${activationToken}`, {
            onResponse(ctx) {
                emailVerification.value = 'activated'
            },
            onResponseError(ctx) {
                emailVerification.value = 'invalid-token'
            }
        })
        await execute()
    }
});
