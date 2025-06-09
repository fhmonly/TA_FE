import type { TRecordJSONResult } from "~/types/table/prediction-input"
import { headerNRow2Sheet, sheet2HeaderNRow, sheet2JSON, spreadsheetReader } from "~/utils/spreadsheet/fileReader"

export function useSpreadSheetReader(inputFile: Ref<File | null>) {
    const toast = useToast()
    const status = ref<'idle' | 'loading' | 'error' | 'success'>('idle')
    const error = ref<Error>()
    const result = {
        jsonHeaders: ref<{
            key: string,
            label: string
        }[]>(),
        json: ref<TRecordJSONResult>(),
    }

    watch(inputFile, async (newVal) => {
        try {
            if (status.value === 'loading')
                throw new Error('Please wait until the current file is fully loaded before uploading a new one.');
            if (!newVal)
                return

            status.value = 'loading'
            error.value = undefined

            const ws = await spreadsheetReader(newVal)
            const { headers, rows } = sheet2HeaderNRow(ws)
            result.jsonHeaders.value = []
            const validHeaders = headers.map((v: string) => {
                const label = v.replaceAll(/\s+/g, ' ')
                const key = v.toLowerCase().replaceAll(/\s+/g, '_').trim()
                result.jsonHeaders.value?.push({ label, key })
                return key
            })
            const newWs = headerNRow2Sheet(validHeaders, rows)
            result.json.value = sheet2JSON<TRecordJSONResult[number]>(newWs)
        } catch (e: unknown) {
            setError(error.value?.message || 'Unknown Error', e as Error)
        } finally {
            if (status.value !== 'error') {
                setSuccess()
            }
        }
    })

    function setError(msg: string, err?: Error) {
        status.value = 'error'
        error.value = err || new Error(msg)
        toast.add({
            title: 'Error',
            icon: 'i-heroicons-x-circle',
            color: 'red',
            description: msg
        })
    }
    function setSuccess() {
        status.value = 'success'
        toast.add({
            title: 'Success',
            icon: 'i-heroicons-document-check',
            color: 'green',
            description: 'File Imported Successfully.'
        })
    }

    return {
        inputFile, status, result, error,
    }
}