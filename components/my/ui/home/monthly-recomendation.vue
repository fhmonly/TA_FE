<template>
    <div class="space-y-4">
        <NuxtUiCard>
            <template #header>
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    📦 Monthly Stock Recommendation
                </h2>
            </template>
            <div class="mb-2">
                <NuxtUiFormGroup label="Forecast from:">
                    <NuxtUiSelectMenu v-model="reqBody.source_type" :options="['sales', 'purchases']"
                        :loading="status === 'pending'" />
                </NuxtUiFormGroup>
            </div>
            <div class="flex flex-wrap justify-stretch items-center gap-4">
                <template v-if="status === 'pending' || getPredictionIsLoading">
                    <NuxtUiCard class="h-24 bg-gray-100 dark:bg-gray-800 grow animate-pulse" />
                    <NuxtUiCard class="h-24 bg-gray-100 dark:bg-gray-800 grow animate-pulse" />
                    <NuxtUiCard class="h-24 bg-gray-100 dark:bg-gray-800 grow animate-pulse" />
                </template>
                <template v-else-if="data?.success">
                    <template v-if="data.data.prediction?.length">
                        <NuxtUiCard
                            class="text-center hover:shadow-lg grow transition-all border border-red-100 dark:border-red-500/20"
                            @click="emit('suggested-value', suggestedValue.min)">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Minimum</p>
                            <p class="text-2xl font-bold text-red-600 dark:text-red-400">
                                {{ suggestedValue.min }}
                            </p>
                        </NuxtUiCard>

                        <NuxtUiCard
                            class="text-center hover:shadow-lg grow transition-all border border-yellow-100 dark:border-yellow-500/20"
                            @click="emit('suggested-value', suggestedValue.actual)">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Medium</p>
                            <p class="text-2xl font-bold text-yellow-500 dark:text-yellow-300">
                                {{ suggestedValue.actual }}
                            </p>
                        </NuxtUiCard>

                        <NuxtUiCard
                            class="text-center hover:shadow-lg grow transition-all border border-green-100 dark:border-green-500/20"
                            @click="emit('suggested-value', suggestedValue.max)">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Maximum</p>
                            <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                                {{ suggestedValue.max }}
                            </p>
                        </NuxtUiCard>
                    </template>
                    <template v-else>
                        <div
                            class="w-full flex flex-col items-center justify-center text-center gap-3 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                            <NuxtUiIcon name="i-heroicons-cpu-chip"
                                class="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">Belum ada hasil prediksi</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Klik tombol di bawah untuk memulai
                                proses prediksi.</p>

                            <NuxtUiButton icon="i-heroicons-rocket-launch" color="primary" variant="solid"
                                label="Buat Prediksi" @click="getPrediction" :loading="getPredictionIsLoading" />
                        </div>
                    </template>
                </template>
                <template v-else>
                    <div
                        class="flex flex-col items-center justify-center min-h-[200px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <!-- Error Icon with Animation -->
                        <div class="relative mb-6">
                            <div
                                class="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full animate-ping opacity-75">
                            </div>
                            <div class="relative bg-red-50 dark:bg-red-900/30 p-4 rounded-full">
                                <svg class="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Error Content -->
                        <div class="text-center space-y-3 mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Oops! Terjadi Kesalahan
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                                Tidak dapat mengambil data prediksi saat ini. Silakan coba lagi dalam beberapa saat.
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-col sm:flex-row gap-3">
                            <NuxtUiButton label="Coba Lagi" @click="refresh" icon="i-heroicons-arrow-path"
                                color="primary" variant="solid" class="transition-all duration-200 hover:scale-105" />
                            <NuxtUiButton label="Hubungi Support" icon="i-heroicons-chat-bubble-left-ellipsis"
                                color="gray" variant="outline" class="transition-all duration-200 hover:scale-105" />
                        </div>
                    </div>
                </template>
            </div>
        </NuxtUiCard>
    </div>
</template>
<script lang="ts" setup>
import { NuxtUiButton } from '#components';
import type { TStockPredictionResponse } from '~/types/api-response/prediction';
import { getStockDeficitFromPrediction } from '~/utils/math/getStockDeficitFromPrediction';

const productId = defineModel<number>('product-id', {
    required: true
})

const emit = defineEmits(['suggested-value'])

type StockPredictionReqBody = {
    product_id: number
    source_type: 'sales' | 'purchases'
    prediction_period: 'weekly' | 'monthly'
}
const reqBody = reactive<StockPredictionReqBody>({
    prediction_period: 'monthly',
    product_id: productId.value,
    source_type: 'sales'
})
const { data, refresh, status } = useFetchWithAutoReNew<TStockPredictionResponse>(`/detail-prediction`, {
    method: 'post',
    body: reqBody,
    key: 'monthly-recommendation',
    onResponse(ctx) {
        if (!ctx.response._data.data.prediction?.length) {
            if (reqBody.source_type === 'sales') {
                reqBody.source_type = 'purchases'
            } else {
                getPrediction()
            }
        }
    }
})
const getPredictionIsLoading = ref(false)
async function getPrediction() {
    getPredictionIsLoading.value = true
    await use$fetchWithAutoReNew(`/smart-prediction/${productId.value}`, {
        method: 'post',
        body: {
            prediction_period: 'monthly',
            prediction_source: 'sales'
        }
    }).execute()
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