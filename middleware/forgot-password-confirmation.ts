export default defineNuxtRouteMiddleware(async (to, from) => {
    const token = to.params.token;
    const forgotPasswordTokenStatus = useState<'unset' | 'invalid' | 'valid'>('forgot-password-token-status', () => 'unset')

    if (!token) {
        return navigateTo('/login');
    }

    try {
        const isValid = await verifyToken(token as string);

        if (!isValid) {
            forgotPasswordTokenStatus.value = 'invalid'
        } else {
            forgotPasswordTokenStatus.value = 'valid'
        }
    } catch (error) {
        forgotPasswordTokenStatus.value = 'invalid'
    }

    async function verifyToken(token: string) {
        return new Promise((resolve) => setTimeout(() => {
            if (token === 'success') {
                return resolve(true)
            } else {
                return resolve(false)
            }
        }, 2000))
        // const response = await fetch('https://your-backend.com/api/verify-token', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ token }),
        // });

        // const data = await response.json();

        // return data.isValid;  
    }

});
