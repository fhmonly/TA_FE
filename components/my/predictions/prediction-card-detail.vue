<template>
    <NuxtUiModal v-model="modalShown" :ui="{ width: 'sm:max-w-2xl' }">
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
                            <template v-if="detail.model?.length">
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
                                <template v-if="detail.rmse">
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
                                <template v-if="detail.mape">
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
import type { TPredictionProductList } from '~/types/prediction/product-list';

const detail = defineModel<TPredictionProductList[number]>('detail-prediction')
const modalShown = computed<boolean>({
    set(newVal) {
        if (!newVal)
            detail.value = undefined
    },
    get: () => !!detail.value
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

const predictionRows = computed(() => {
    if (!detail.value) return []

    return [
        {
            metric: 'Prediksi',
            value: detail.value.actual_prediction
                ? (typeof detail.value.actual_prediction === 'number'
                    ? detail.value.actual_prediction.toFixed(2)
                    : detail.value.actual_prediction)
                : '-'
        },
        {
            metric: 'Batas Bawah',
            value: detail.value.lower_bound
                ? detail.value.lower_bound.toFixed(2)
                : '-'
        },
        {
            metric: 'Batas Atas',
            value: detail.value.upper_bound
                ? detail.value.upper_bound.toFixed(2)
                : '-'
        }
    ]
})

const summaryText = computed(() => {
    if (!detail.value) return ''

    const prediction = detail.value.actual_prediction
    const lower = detail.value.lower_bound
    const upper = detail.value.upper_bound

    if (prediction && lower && upper) {
        return `Prediksi berada dalam rentang ${lower.toFixed(2)} hingga ${upper.toFixed(2)} dengan nilai prediksi ${typeof prediction === 'number' ? prediction.toFixed(2) : prediction}.`
    }

    return 'Data prediksi tersedia dengan model ARIMA yang telah dioptimalkan.'
})
</script>