<template>
    <div class="flex items-center justify-end gap-3">
        <label for="prediction-period">Prediction Period:</label>
        <NuxtUiSelectMenu v-model="selectedPeriod" :options="periodOptions" value-attribute="value"
            option-attribute="label" id="prediction-period" />
    </div>
    <template v-if="data?.success">
        <template v-if="data.data.length >= 1">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
                <MyPredictionsTrxCard :product="product" :key v-for="(product, key) in data.data"
                    @update:product="newProduct => updateProduct(key, newProduct)" :prediction-period="selectedPeriod"
                    @open-detail="e => {
                        purchaseDetailProperty = {
                            prediction_period: selectedPeriod,
                            product_id: e,
                            source_type: 'purchases'
                        }
                    }" />
            </div>
        </template>
        <template v-else>
            <div class="flex flex-col items-center justify-center py-10 px-4 text-center">
                <p class="text-lg text-gray-600 mb-4">Anda belum memiliki produk untuk diprediksi.</p>
                <NuxtUiButton to="/dashboard/dataset/products" label="Buat Produk Sekarang"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out" />
            </div>
        </template>
    </template>
    <MyPredictionsTrxDetail v-model:detail-property="purchaseDetailProperty" />
</template>
<script lang="ts" setup>
import type { ExtractSuccessResponse } from '~/types/api-response/basicResponse';
import type { TStockPredictionListResponse } from '~/types/api-response/prediction';

const periodOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
]
const selectedPeriod = ref<'weekly' | 'monthly'>('weekly')
const {
    data,
    refresh,
    status
} = useFetchWithAutoReNew<TStockPredictionListResponse>(() => `/saved-predictions/purchases/${selectedPeriod.value}`)
function updateProduct(index: number, newProduct: ExtractSuccessResponse<TStockPredictionListResponse>[number]) {
    if (data.value?.success)
        data.value.data[index] = newProduct
}

const purchaseDetailProperty = ref<{
    product_id: number;
    source_type: "sales" | "purchases";
    prediction_period: "weekly" | "monthly";
}>()
</script>