import dayjs from '#build/dayjs.imports.mjs'
import type { TableColumn } from '#ui/types'
import type { TPredictionProductList } from '~/types/prediction/product-list'
import type { TRecordJSONResult } from '~/types/table/prediction-input'

const mainColumns = [
    { label: 'Date', key: 'date', sortable: true, required: true },
    { label: 'Product Code', key: 'product_code', sortable: true, required: false },
    { label: 'Product Name', key: 'product_name', sortable: true, required: true },
    { label: 'Amount', key: 'amount', sortable: true, required: true }
]

export function usePredictionInputTable(inputFile: Ref<File | null>) {
    const {
        result, status: sheetReaderStatus
    } = useSpreadSheetReader(inputFile)
    const status = ref<'idle' | 'loading' | 'loaded'>('idle')
    const loadingDetail = ref<string | undefined>();
    const columns = ref<TableColumn[]>(mainColumns)
    const missingColumns = ref<string[]>([])
    const mismatchDetail = ref<string[]>([])
    const records = ref<TRecordJSONResult>([])
    const products = ref<TPredictionProductList>([])

    watch(sheetReaderStatus, newVal => {
        if (newVal === 'idle' || newVal === 'error')
            status.value = 'idle'
        if (newVal === 'loading')
            status.value = 'loading'
        if (newVal === 'success') {
            status.value = 'loading'

            if (!result.json.value)
                return

            const requiredColumnKeys = mainColumns.map(v => v.key)
            columns.value = [
                ...mainColumns,
                ...result.jsonHeaders.value!.map(v => {
                    if (!requiredColumnKeys.includes(v.key))
                        return { ...v, sortable: true }
                    return null
                }).filter(v => !!v),
            ]
            records.value = result.json.value

            const jsonHeadersKeys = result.jsonHeaders.value!.map(v => v.key)
            missingColumns.value = mainColumns.filter(v => !jsonHeadersKeys.includes(v.key) && v.required).map(v => v.label)

            let dateInvalidCounter = 0
            mismatchDetail.value = []
            const productsTemp: {
                [key: string]: TPredictionProductList[number]
            } = {}
            result.json.value?.forEach((v, i) => {
                if (!dayjs(v.date).isValid())
                    dateInvalidCounter += 1
                const productKey = v.product_code ||
                    stringToSlug(v.product_name)

                if (
                    result.json.value &&
                    result.json.value.length >= 1 &&
                    !result.json.value[i].product_code
                )
                    result.json.value[i].product_code = productKey
                if (!!productsTemp[productKey]) {
                    productsTemp[productKey].total += 1
                } else {
                    productsTemp[productKey] = {
                        product_code: productKey,
                        product_name: v.product_name,
                        total: 1,
                        status: 'unpredicted'
                    }
                }
            })
            if (dateInvalidCounter >= 1)
                mismatchDetail.value.push(`${dateInvalidCounter} invalid date ${dateInvalidCounter === 1 ? 'value was' : 'values were'} found in the 'Date' column.`);

            products.value = Object.entries(productsTemp).map(v => v[1])

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