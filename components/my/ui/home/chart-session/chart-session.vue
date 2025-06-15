<template>
    <!-- Charts Section -->
    <div class="grid grid-cols-1 gap-6 mb-6">
        <NuxtUiCard class="bg-white dark:bg-gray-800">
            <div class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium">Sales & Purchases Trend</h3>
                    <NuxtUiSelect v-model="trendTimeframe" :options="timeframeOptions" size="sm" class="w-32" />
                </div>
                <div class="h-80 flex items-center justify-center">
                    <template v-if="status === 'pending'">
                        <span class="text-gray-500">Loading chart...</span>
                    </template>

                    <template v-else-if="status === 'error'">
                        <div class="space-y-3 flex flex-col items-center justify-center">
                            <span class="text-red-500">Failed to load data.</span>
                            <NuxtUiButton label="Refresh" icon="i-heroicons:arrow-path" @click="refresh" />
                        </div>
                    </template>

                    <template v-else>
                        <MyUiHomeChartSessionPos :labels="labels" :sale-values="sales" :purchase-values="purchase"
                            :key="trendTimeframe" />
                    </template>
                </div>
            </div>
        </NuxtUiCard>
    </div>
</template>

<script lang="ts" setup>
import type { TDynamicResponse } from '~/types/api-response/basicResponse';

const trendTimeframe = ref('Weekly');
const timeframeOptions = ['Weekly', 'Monthly'];
type TrendResponse = TDynamicResponse<{
    sales: {
        year: number,
        week: number,
        month: number,
        amount: number
    }[],
    purchase: {
        year: number,
        week: number,
        month: number,
        amount: number
    }[]
}>
const {
    data,
    status,
    refresh
} = useFetchWithAutoReNew<TrendResponse>(() => `/dashboard/trend/${trendTimeframe.value.toLowerCase()}`)

function mapDataToLabels<T>(
    labels: string[],
    raw: T[],
    labelKey: keyof T,
    valueKey: keyof T
): number[] {
    const dataMap = Object.fromEntries(
        raw.map(item => [String(item[labelKey]), Number(item[valueKey])])
    )
    return labels.map(label => dataMap[label] || 0)
}

const labels = computed(() => {
    if (trendTimeframe.value === 'Weekly')
        return Array.from({ length: 52 }, (_, i) => `W${i + 1}`)
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
})

const sales = computed(() => {
    if (data.value?.success && data.value.data.sales.length >= 1) {
        const formattedSales = data.value.data.sales.map(v => ({
            amount: Number(v.amount),
            period: trendTimeframe.value === 'Weekly' ?
                `W${v.week}` : labels.value[v.month - 1]
        }))
        return mapDataToLabels(labels.value, formattedSales, 'period', 'amount')
    }
    return []
})
const purchase = computed(() => {
    if (data.value?.success && data.value.data.purchase.length >= 1) {
        const formattedPurchase = data.value.data.purchase.map(v => ({
            amount: Number(v.amount),
            period: trendTimeframe.value === 'Weekly' ?
                `W${v.week}` : labels.value[v.month - 1]
        }))
        return mapDataToLabels(labels.value, formattedPurchase, 'period', 'amount')
    }
    return []
})
</script>