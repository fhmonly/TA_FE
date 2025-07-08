<template>
    <div
        class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 overflow-hidden">
        <div class="p-4 space-y-4">
            <div class="flex items-center gap-3 justify-between">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {{ config.prediction_period === 'weekly' ? 'Weekly' : 'Monthly' }} Stock Suggestion by
                </h3>
                <NuxtUiSelectMenu v-model="config.source_type" :options="[
                    { label: 'Sales', value: 'sales' },
                    { label: 'Purchases', value: 'purchases' }
                ]" :loading="status === 'pending'" size="xs" class="w-24" value-attribute="value"
                    option-attribute="label" />
            </div>

            <!-- Compact Recommendation Cards -->
            <div class="flex items-stretch gap-3">
                <!-- Loading State -->
                <template v-if="status === 'pending' || getPredictionIsLoading">
                    <div v-for="n in 3" :key="n"
                        class="flex-1 h-16 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg animate-pulse" />
                </template>

                <!-- Prediction Available -->
                <template v-else-if="data?.success && data.data.prediction?.length">
                    <!-- Min Card -->
                    <div class="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 cursor-pointer 
                        transition-all duration-200 hover:shadow-md hover:border-red-300 dark:hover:border-red-600 hover:-translate-y-0.5"
                        @click="emit('suggested-value', suggestedValue.min)">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-red-600 dark:text-red-400">Min</span>
                            <div class="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        </div>
                        <p class="text-lg font-bold text-red-600 dark:text-red-400">{{ suggestedValue.min }}</p>
                    </div>

                    <!-- Mid Card -->
                    <div class="flex-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 cursor-pointer 
                        transition-all duration-200 hover:shadow-md hover:border-yellow-300 dark:hover:border-yellow-600 hover:-translate-y-0.5"
                        @click="emit('suggested-value', suggestedValue.actual)">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-yellow-600 dark:text-yellow-400">Mid</span>
                            <div class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                        </div>
                        <p class="text-lg font-bold text-yellow-600 dark:text-yellow-400">{{ suggestedValue.actual }}
                        </p>
                    </div>

                    <!-- Max Card -->
                    <div class="flex-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 cursor-pointer 
                        transition-all duration-200 hover:shadow-md hover:border-green-300 dark:hover:border-green-600 hover:-translate-y-0.5"
                        @click="emit('suggested-value', suggestedValue.max)">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-green-600 dark:text-green-400">Max</span>
                            <div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        </div>
                        <p class="text-lg font-bold text-green-600 dark:text-green-400">{{ suggestedValue.max }}</p>
                    </div>
                </template>

                <!-- No Prediction Yet -->
                <template v-else-if="data?.success">
                    <div
                        class="flex-1 flex items-center justify-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <span class="text-sm text-gray-500 dark:text-gray-400">No predictions yet</span>
                        <NuxtUiButton size="xs" label="Generate" icon="i-heroicons-sparkles"
                            :loading="getPredictionIsLoading" @click="getPrediction" />
                    </div>
                </template>

                <!-- Error State -->
                <template v-else>
                    <div
                        class="flex-1 flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <svg class="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span class="text-sm text-red-600 dark:text-red-400">Failed to load</span>
                        <NuxtUiButton size="xs" label="Retry" @click="refresh" />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { NuxtUiButton } from '#components';
import type { TStockPredictionResponse } from '~/types/api-response/prediction';
import { getStockDeficitFromPrediction } from '~/utils/math/getStockDeficitFromPrediction';

const config = defineModel<{
    product_id: number
    source_type: 'sales' | 'purchases'
    prediction_period: 'weekly' | 'monthly',
    auto_source_type: boolean
}>('config', { required: true })

const emit = defineEmits(['suggested-value'])

const getPredictionLatestSource = ref<'sales' | 'purchases' | undefined>(config.value.source_type === 'purchases' ? 'sales' : undefined)

const { data, refresh, status, toastConfig } = useFetchWithAutoReNew<TStockPredictionResponse>(
    '/detail-prediction',
    {
        method: 'post',
        body: config,
        key: `${config.value.product_id}-${config.value.source_type}-${config.value.prediction_period}`,
        async onResponse(ctx) {
            const prediction = ctx.response._data?.data?.prediction

            if (!Array.isArray(prediction) || prediction.length === 0) {

                if (!getPredictionLatestSource.value) {
                    await getPrediction()
                    getPredictionLatestSource.value = 'sales'
                    refresh()
                } else if (getPredictionLatestSource.value === 'sales' && config.value.source_type === 'sales') {
                    if (config.value.auto_source_type) {
                        config.value.auto_source_type = false
                        config.value.source_type = 'purchases'
                        refresh()
                    }
                } else if (getPredictionLatestSource.value === 'sales' && config.value.source_type === 'purchases') {
                    await getPrediction()
                    getPredictionLatestSource.value = 'purchases'
                    refresh()
                } else if (getPredictionLatestSource.value === 'purchases' && config.value.source_type === 'purchases') {
                    config.value.auto_source_type = false
                }
            } else {
                config.value.auto_source_type = false
            }
        }
    }
)

toastConfig.timer = 0
const getPredictionIsLoading = ref(false)
async function getPrediction() {
    getPredictionIsLoading.value = true
    const { execute, toastConfig } = use$fetchWithAutoReNew(`/smart-prediction/${config.value.product_id}`, {
        method: 'post',
        body: {
            prediction_period: config.value.prediction_period,
            prediction_source: config.value.source_type
        }
    })
    toastConfig.timer = 0
    await execute()
    getPredictionIsLoading.value = false
}
const suggestedValue = computed(() => {
    const sv = {
        min: 0,
        actual: 0,
        max: 0
    }
    if (data.value?.success) {
        sv.min = getStockDeficitFromPrediction(data.value.data.lower_bound || [0], data.value.data.stock)
        sv.actual = getStockDeficitFromPrediction(data.value.data.prediction || [0], data.value.data.stock)
        sv.max = getStockDeficitFromPrediction(data.value.data.upper_bound || [0], data.value.data.stock)
    }
    return sv
})
</script>
