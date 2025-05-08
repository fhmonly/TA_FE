import dayjs from '#build/dayjs.imports.mjs'
import type { TableColumn } from '#ui/types'
import type { TProduct } from '~/types/landing-page/demo/modalMakePrediction'

const requiredColumn = [
    { label: 'Date', key: 'date', sortable: true, },
    { label: 'Product Code', key: 'product code', sortable: true, },
    { label: 'Product Name', key: 'product name', sortable: true, },
    { label: 'Sold(qty)', key: 'sold(qty)', sortable: true, }
]

export function usePredictionTable() {
    const records = ref<Record<string, any>[]>([])
    const processedRecords = ref<Record<string, any>[]>([])
    const status = ref<'idle' | 'loading' | 'loaded'>('idle')
    const loadingDetail = ref<string | undefined>();
    const mismatchDetail = ref<string[]>([])

    const columns = ref<TableColumn[]>([])
    const missingColumns = ref<string[]>([])

    const page = ref(1)
    const pageCount = ref(10)

    const products = ref<Record<string, any>[]>([])

    const rows = computed(() => {
        return processedRecords.value.slice((page.value - 1) * pageCount.value, (page.value) * pageCount.value)
    })

    watch(records, newVal => {
        status.value = 'loading'
        mismatchDetail.value = []

        loadingDetail.value = 'Collecting and validating record'
        processedRecords.value = normalizeRecord(newVal, requiredColumn.map(v => v.key))
    })

    watch(processedRecords, newVal => {
        console.log('processed')
        loadingDetail.value = 'Load all column keys from record'
        columns.value = getColumnsFromRecord(newVal[0], requiredColumn)

        loadingDetail.value = 'Checking missing column'
        missingColumns.value = getMissingColumns(
            Object.keys(newVal[0]),
            requiredColumn.map(v => v.key)
        )

        loadingDetail.value = 'Collecting product list'
        const hasProductCode = Object.keys(newVal[0]).includes('product code')
        const listedProduct = new Set()
        let dateInvalidCounter: number = 0
        newVal.forEach((v, i) => {
            if (hasProductCode) {
                const cv = v['product code']
                const cl = v['product name']
                if (!listedProduct.has(cv)) {
                    listedProduct.add(cv)
                    products.value?.push({
                        label: cv,
                        value: cl
                    })
                }
            } else {
                const cl = v['product name']
                if (!listedProduct.has(cl)) {
                    listedProduct.add(cl)
                    products.value?.push({
                        label: cl,
                        value: cl
                    })
                }
            }

            if (!dayjs(v.date).isValid()) {
                dateInvalidCounter += 1
            }
        })

        if (dateInvalidCounter >= 1) {
            mismatchDetail.value.push(`There is ${dateInvalidCounter} invalid date inside column 'date'.`)
        }

        loadingDetail.value = undefined
        status.value = 'loaded'
    })

    return {
        records, processedRecords, status, loadingDetail, mismatchDetail,
        columns, missingColumns,
        page, pageCount,
        products, rows
    }
}

function getProductList(records: Record<string, any>[]) {
    return
}

function normalizeRecord(records: Record<string, any>[], requiredColumnKey: string[]) {
    return records.map(record => {
        const normalized: Record<string, any> = {}

        Object.entries(record).forEach(([key, value]) => {
            const lowerKey = key.toLowerCase()
            if (requiredColumnKey.includes(lowerKey)) {
                normalized[lowerKey] = value
            } else {
                normalized[key] = value
            }
        })

        return normalized
    })
}

function getColumnsFromRecord(
    records: Record<string, any> = {},
    requiredColumn: TableColumn[]
) {
    const columnKeys: string[] | Record<string, any>[] = Object.keys(records || {})
    const requiredColumnKey = requiredColumn.map(v => v.key)
    const finalColumn = [
        //     {
        //     key: 'actions',
        //     sortable: true,
        //     label: 'Actions'
        // },
        ...requiredColumn,
    ]
    if (columnKeys.length >= 1) {
        const candidateCol = columnKeys.map(v => ({
            key: v,
            label: v,
            sortable: true,
        }))
        finalColumn.push(
            ...candidateCol.filter(v => !requiredColumnKey.includes(v.key))
        )
    }
    return finalColumn
}

function getMissingColumns(
    columnsKey: string[],
    requiredColumnKey: string[]
) {
    return requiredColumnKey.filter(v => !columnsKey.includes(v))
}