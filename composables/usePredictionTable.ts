import type { TableColumn } from '#ui/types'
export function usePredictionTableColumn() {
    const requiredColumn = ['date', 'product code', 'product name', 'sold(qty)']
    const columnKeys = ref<string[]>([])
    const columns: ComputedRef<TableColumn[]> = computed(() => {
        if (columnKeys.value.length >= 1) {
            return [{
                key: 'actions',
                sortable: true,
                label: 'Actions'
            }, ...columnKeys.value.map(v => ({
                key: v,
                sortable: true,
                label: v
            }) as TableColumn)]
        } else {
            return [{
                key: 'actions',
                sortable: true,
                label: 'Actions'
            }, ...requiredColumn.map(v => ({
                key: v,
                sortable: true,
                label: v,
            }))]
        }
    })
    const missingColumn = computed(() => {
        const currentColumn = columns.value.map(v => v.key)
        return requiredColumn.filter(v => !currentColumn.includes(v))
    })

    return {
        columnKeys,
        columns,
        missingColumn
    }
}