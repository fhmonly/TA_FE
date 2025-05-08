import { useLocalStorage } from "@vueuse/core";

export function useMyAppState() {
    return {
        isOffline: useState<boolean>('myAppState-isOffline', () => false),
        authState: useCookie<'logged-in' | 'logged-out' | 'uncheck'>('myAppState-authState', {
            default: () => 'uncheck',
        }),
        apiAccessToken: useCookie<string | null>("myAppState-accessToken", {
            default: () => null,
        }),
    }
}