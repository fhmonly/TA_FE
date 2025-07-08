<template>
    <NuxtUiCard class="bg-white dark:bg-gray-800">
        <div class="p-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium mb-4">Sales Prediction</h3>
                <NuxtUiSelect v-model="trendTimeframe" :options="timeframeOptions" size="sm" class="w-32" />
            </div>
            <div class="space-y-4">
                <template v-if="status === 'pending'">
                    <div v-for="n in 4" :key="n" class="flex items-center justify-between animate-pulse py-2">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 mr-3" />
                            <div>
                                <div class="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                <div class="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                            <div class="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <template v-if="data?.success">
                        <template v-if="data.data.length >= 1">
                            <NuxtUiCard v-for="(prediction, index) in data.data" :key="index">
                                <div class="flex">
                                    <div
                                        class="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 shrink-0">
                                        <Icon name="lucide:package" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div class="w-full">
                                        <div class="flex items-center justify-between">
                                            <p class="font-medium">{{ prediction.product_name }}</p>
                                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                                {{ prediction.category_name }}
                                            </p>
                                        </div>
                                        <div class="flex-wrap border-t border-gray-400 mt-1 pt-1">
                                            <div class="flex justify-between">
                                                <span
                                                    class="text-sm text-gray-500 dark:text-gray-400">Prediction:</span>
                                                <p class="ms-2 text-sm">
                                                    {{ getStockDeficitFromPrediction(
                                                        prediction.prediction || [0],
                                                        prediction.stock || 0
                                                    ) }} units
                                                </p>
                                            </div>
                                            <div class="flex justify-between">
                                                <span
                                                    class="text-sm text-gray-500 dark:text-gray-400">Accuration:</span>
                                                <p class="ms-2 text-sm" :class="classifyMAPE(prediction.mape).class">
                                                    {{ classifyMAPE(prediction.mape).label }} ({{ 100 - +prediction.mape
                                                    }}%)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </NuxtUiCard>
                            <NuxtUiButton variant="outline" class="w-full mt-4" to="/dashboard/prediction">View Detailed
                                Forecast
                            </NuxtUiButton>
                        </template>

                        <!-- ✅ Fallback: Data kosong -->
                        <template v-else>
                            <div class="flex flex-col gap-3 items-center justify-center">
                                <div class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                    Tidak ada data prediksi untuk ditampilkan.
                                </div>
                                <NuxtUiButton variant="outline" to="/dashboard/prediction">
                                    Make Prediction
                                </NuxtUiButton>
                            </div>
                        </template>
                    </template>

                    <!-- ❌ Fallback: Gagal fetch -->
                    <template v-else>
                        <div class="flex flex-col gap-3 items-center justify-center">
                            <div class="text-center py-4 text-red-500 dark:text-red-400 text-sm">
                                Gagal mengambil data prediksi. Silakan coba lagi nanti.
                            </div>
                            <NuxtUiButton label="Refresh" icon="i-heroicons:arrow-path" @click="refresh" />
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </NuxtUiCard>
</template>
<script lang="ts" setup>
import type { TLatestPredictionListResponse } from '~/types/api-response/prediction';
import { getStockDeficitFromPrediction } from '~/utils/math/getStockDeficitFromPrediction';

const trendTimeframe = ref('Weekly');
const timeframeOptions = ['Weekly', 'Monthly'];
const {
    data,
    refresh,
    status
} = useFetchWithAutoReNew<TLatestPredictionListResponse>(() => `/dashboard/latest/sales/${trendTimeframe.value.toLowerCase()}`)
</script>