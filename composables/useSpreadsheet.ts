import { sheetToJSON } from "~/utils/spreadsheet/sheetsToJSON"

export function useFileToJSON() {
    const toast = useToast()
    const file = ref<File | null>(null)
    const status = ref<'idle' | 'loading' | 'error' | 'success'>('idle')
    const result = ref<Record<string, any>[]>([])
    const error = ref<Error | null>(null)
    watch(file, async (newVal) => {
        if (!newVal)
            return
        status.value = 'loading'
        error.value = null
        try {
            const json = await sheetToJSON(newVal);
            if (json) {
                const newJSON = json.map((jsonObj) => {
                    const entries = Object.entries(
                        jsonObj as Record<string, any>
                    ).map(([key, value]) => {
                        switch (key.toLowerCase().trim()) {
                            case 'date':
                                key = 'date'
                                break;
                            case 'product code':
                                key = 'product code'
                                break;
                            case 'product name':
                                key = 'product name'
                                break;
                            case 'sold(qty)':
                                key = 'sold(qty)'
                                break;
                            default:
                                break;
                        }
                        return [key, value];
                    });
                    return Object.fromEntries(entries);
                })
                result.value = json as Record<string, any>[]
            }
        } catch (e: unknown) {
            status.value = 'error'
            if (e instanceof Error) {
                error.value = e
            }
            toast.add({
                title: 'Error',
                icon: 'i-heroicons-x-circle',
                color: 'red',
                description: error.value?.message
            })
        } finally {
            if (status.value !== 'error') {
                status.value = 'success'
                toast.add({
                    title: 'Success',
                    icon: 'i-heroicons-document-check',
                    color: 'green',
                    description: 'File Imported Successfully.'
                })
            }
        }
    })
    return {
        file, status, result, error
    }
}