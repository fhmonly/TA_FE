<template>
    <NuxtUiModal v-model="modalShown">
        <NuxtUiCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Hasil Prediksi ARIMA
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Analisis dan prediksi time series
                        </p>
                    </div>
                    <NuxtUiButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                        @click="modalShown = false" />
                </div>
            </template>

            <div class="space-y-6" v-if="detail">
                <!-- Prediction Results Section -->
                <NuxtUiCard>
                    <template #header>
                        <h3 class="text-base font-medium">Hasil Prediksi</h3>
                    </template>

                    <NuxtUiTable :rows="predictionRows" :columns="predictionColumns" :ui="{
                        thead: 'bg-gray-50 dark:bg-gray-800',
                        tbody: 'divide-y divide-gray-200 dark:divide-gray-700'
                    }" />
                </NuxtUiCard>

                <!-- ARIMA Order Section -->
                <NuxtUiCard>
                    <template #header>
                        <h3 class="text-base font-medium">ARIMA Order</h3>
                    </template>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-primary">
                            <template v-if="detail && detail.model?.length">
                                ({{ detail.model.join(', ') }})
                            </template>
                            <template v-else>
                                <span class="text-gray-400">-</span>
                            </template>
                        </div>
                    </div>
                </NuxtUiCard>

                <!-- Metrics Section -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NuxtUiCard>
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h3 class="text-base font-medium">RMSE</h3>
                                <NuxtUiBadge color="green" variant="subtle">Akurasi</NuxtUiBadge>
                            </div>
                        </template>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">
                                <template v-if="detail && detail.rmse">
                                    {{ detail.rmse.toFixed(2) }}
                                </template>
                                <template v-else>
                                    <span class="text-gray-400">-</span>
                                </template>
                            </div>
                        </div>
                    </NuxtUiCard>

                    <NuxtUiCard>
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h3 class="text-base font-medium">MAPE</h3>
                                <NuxtUiBadge color="purple" variant="subtle">Persentase</NuxtUiBadge>
                            </div>
                        </template>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">
                                <template v-if="detail && detail.mape">
                                    {{ detail.mape.toFixed(2) }}%
                                </template>
                                <template v-else>
                                    <span class="text-gray-400">-</span>
                                </template>
                            </div>
                        </div>
                    </NuxtUiCard>
                </div>

                <!-- Summary Card -->
                <NuxtUiAlert icon="i-heroicons-information-circle" color="blue" variant="subtle"
                    title="Ringkasan Prediksi" :description="summaryText" />
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
                <NuxtUiAlert icon="i-heroicons-exclamation-triangle" color="yellow" variant="subtle"
                    title="Tidak Ada Data" description="Data prediksi ARIMA tidak tersedia saat ini." />
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <NuxtUiButton color="gray" variant="outline" @click="modalShown = false">
                        Tutup
                    </NuxtUiButton>
                </div>
            </template>
        </NuxtUiCard>
    </NuxtUiModal>
</template>
<script lang="ts" setup>
import type { ExtractSuccessResponse } from '~/types/api-response/basicResponse';
import type { TStockPredictionResponse } from '~/types/api-response/prediction';

const detailProperty = defineModel<{
    product_id: number
    source_type: 'sales' | 'purchases'
    prediction_period: 'weekly' | 'monthly'
}>('detail-property')
const modalShown = computed<boolean>({
    set(newVal) {
        if (!newVal) {
            detailProperty.value = undefined
        }
    },
    get: () => !!detailProperty.value
})

const bodyPayload = computed(() => detailProperty.value)
const detail = ref<ExtractSuccessResponse<TStockPredictionResponse>>();

watch(detailProperty, newVal => {
    if (newVal && newVal.product_id && newVal.prediction_period && newVal.source_type) {
        const { execute } = use$fetchWithAutoReNew<TStockPredictionResponse>(`/detail-prediction`, {
            method: 'post',
            body: bodyPayload.value,
            onResponse(ctx) {
                detail.value = ctx.response._data.data
            },
            onResponseError() {
                modalShown.value = false
            }
        })
        execute()
    }
})

const predictionColumns = [
    {
        key: 'metric',
        label: 'Metrik'
    },
    {
        key: 'value',
        label: 'Nilai'
    }
]

const actualPrediction = computed(() => {
    const p = (detail.value?.prediction || [0]).reduce((prev, curr) => {
        return Math.max(0, Number(prev) + Number(curr))
    }, 0)
    const s = +(detail.value?.stock ?? 0)
    return Math.max(0, p - s)
})

const actualLowerBound = computed(() => {
    const lb = (detail.value?.lower_bound || [0]).reduce((prev, curr) => {
        return Math.max(0, Number(prev) + Number(curr))
    }, 0)
    const s = +(detail.value?.stock ?? 0)
    return Math.max(0, lb - s)
})

const actualUpperBound = computed(() => {
    const ub = ((detail.value?.upper_bound || [0]).reduce((prev, curr) => {
        return Math.max(0, Number(prev) + Number(curr))
    }, 0))
    const s = +(detail.value?.stock ?? 0)
    return Math.max(0, ub - s)
})

const predictionRows = computed(() => {
    return [
        {
            metric: 'Prediksi',
            value: actualPrediction.value
        },
        {
            metric: 'Batas Bawah',
            value: actualLowerBound.value
        },
        {
            metric: 'Batas Atas',
            value: actualUpperBound.value
        }
    ]
})

const summaryText = computed(() => {
    const prediction = actualPrediction.value
    const lower = actualLowerBound.value
    const upper = actualUpperBound.value

    if (prediction && lower && upper) {
        return `Prediksi berada dalam rentang ${lower.toFixed(2)} hingga ${upper.toFixed(2)} dengan nilai prediksi ${typeof prediction === 'number' ? prediction.toFixed(2) : prediction}.`
    }

    return 'Data prediksi tersedia dengan model ARIMA yang telah dioptimalkan.'
})
</script>