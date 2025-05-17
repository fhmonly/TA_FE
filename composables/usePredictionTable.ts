import dayjs from '#build/dayjs.imports.mjs'
import type { TableColumn } from '#ui/types'

const requiredColumn = [
    { label: 'Date', key: 'date', sortable: true, },
    { label: 'Product Code', key: 'product_code', sortable: true, },
    { label: 'Product Name', key: 'product_name', sortable: true, },
    { label: 'Sold(qty)', key: 'sold(qty)', sortable: true, }
]

export function usePredictionTable() {
    const {
        inputFile, result, status: sheetReaderStatus
    } = useSpreadSheet()
    const status = ref<'idle' | 'loading' | 'loaded'>('idle')
    const loadingDetail = ref<string | undefined>();
    const columns = ref<TableColumn[]>(requiredColumn)
    const missingColumns = ref<string[]>([])
    const mismatchDetail = ref<string[]>([])
    const records = ref<Record<string, any>[]>([])
    const products = ref<string[]>([])

    watch(sheetReaderStatus, newVal => {
        if (newVal === 'idle' || newVal === 'error')
            status.value = 'idle'
        if (newVal === 'loading')
            status.value = 'loading'
        if (newVal === 'success') {
            status.value = 'loading'

            columns.value = result.jsonHeaders.value!.map(v => ({ ...v, sortable: true }))
            records.value = result.json.value as any

            const jsonHeadersKeys = result.jsonHeaders.value!.map(v => v.key)
            missingColumns.value = requiredColumn.filter(v => !jsonHeadersKeys.includes(v.key)).map(v => v.label)

            let dateInvalidCounter = 0
            mismatchDetail.value = []
            const productsSet = new Set()
            result.json.value?.forEach((v, i) => {
                if (!dayjs(v.date).isValid())
                    dateInvalidCounter += 1

                if (jsonHeadersKeys.includes('product_code')) {
                    productsSet.add(v.product_code)
                } else {
                    productsSet.add(v.product_name)
                }
            })
            if (dateInvalidCounter >= 1)
                mismatchDetail.value.push(`${dateInvalidCounter} invalid date ${dateInvalidCounter === 1 ? 'value was' : 'values were'} found in the 'Date' column.`);

            products.value = productsSet.values().toArray() as string[]

            status.value = 'loaded'
        }
    })

    const page = ref(1)
    const pageCount = ref(10)
    const rows = computed(() => {
        return records.value.slice((page.value - 1) * pageCount.value, (page.value) * pageCount.value)
    })

    return {
        inputFile, status, loadingDetail, result,
        columns, missingColumns, mismatchDetail,
        records, products,
        page, pageCount, rows
    }
}