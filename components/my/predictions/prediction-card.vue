<template>
    <NuxtUiCard class="flex flex-col">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ product.product_name }}</h3>
        </template>

        <template v-if="product.total >= 10">
            <template v-if="product.status === 'predicted'">
                <div class="text-center mb-4">
                    <p class="text-5xl font-extrabold text-primary-600 dark:text-primary-400">
                        {{ product?.actual_prediction || 0 }}
                        <!-- <span class="text-xl font-normal text-gray-500 dark:text-gray-400">{{ product.unit }}</span> -->
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Prediksi</p>
                </div>

                <div class="mb-4 space-y-2">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Rentang Prediksi:</p>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative">
                        <!-- <div class="h-2.5 rounded-full bg-blue-200 dark:bg-blue-800 absolute"
                            :style="{ left: `${getPercentage(product.actual_prediction, product.lower_bound, product.upper_bound)}%`, width: `${getPercentage(product.actual_prediction, product.lower_bound, product.upper_bound)}%` }">
                        </div> -->
                        <div class="absolute -top-1 w-4 h-4 rounded-full bg-primary-500 dark:bg-primary-300 border-2 border-white dark:border-gray-900 shadow-md"
                            :style="{ left: `${getPercentage(product?.actual_prediction || 0, product?.lower_bound || 0, product.upper_bound || 100)}%` }">
                        </div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Min: {{ product.lower_bound || 0 }}</span>
                        <span>Max: {{ product.upper_bound || 0 }}</span>
                    </div>
                </div>

                <MyPredictionsPredictionCardDetail v-model:detail-prediction="detailPredictionData" />
            </template>
            <template v-else-if="product.status === 'unpredicted'">
                <div class="product-unpredicted-state">
                    <NuxtUiAlert color="yellow" title="Prediction Pending"
                        description="This product has not yet been predicted. A prediction is required to proceed."
                        class="mb-4" />
                </div>
            </template>
            <template v-else-if="product.status === 'invalid'">
                <div class="product-invalid-state">
                    <NuxtUiAlert color="red" title="Invalid Prediction" :description="invalidResponseMessage"
                        class="mb-4" />
                </div>
            </template>

            <template v-else-if="product.status === 'loading'">
                <div class="product-loading-state flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg">
                    <NuxtUiIcon name="i-heroicons-arrow-path" class="animate-spin text-blue-500 text-5xl mb-4" />
                    <NuxtUiAlert color="blue" title="Loading Prediction..."
                        description="Please wait while we process the prediction for this product. This may take a moment."
                        class="mb-4" />
                    <NuxtUiProgress animation="carousel" class="w-full max-w-sm" />
                </div>
            </template>
        </template>
        <template v-else>
            <NuxtUiAlert icon="i-heroicons-exclamation-triangle" color="yellow" title="Not Enough Products"
                description="You need to provide at least 10 records to proceed." />
        </template>

        <template #footer v-if="product.total >= 10 && product.status !== 'invalid'">
            <div class="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400">
                <NuxtUiButton color="primary" variant="soft" size="sm" icon="i-heroicons-arrow-right" trailing
                    v-if="product.status === 'predicted'" @click="detailPredictionData = product">
                    Lihat Detail
                </NuxtUiButton>
                <NuxtUiButton icon="i-heroicons-rocket-launch" color="primary" variant="solid"
                    @click="product.status = 'fetch-prediction'" v-else
                    :loading="product.status === 'loading' || product.status === 'fetch-prediction'">
                    Generate Prediction
                </NuxtUiButton>
            </div>
        </template>
    </NuxtUiCard>
</template>
<script lang="ts" setup>
import { useStoreFileRecord } from '~/stores/file/record';
import type { TPredictionProductList } from '~/types/prediction/product-list';
import { getPercentage } from '~/utils/math/percentage';
import papaparse from 'papaparse'
import type { TFilePredictionRequestBody, TFilePredictionResponse } from '~/types/api-response/prediction';

const product = defineModel<TPredictionProductList[number]>('product', {
    required: true
})
const storeFileRecord = useStoreFileRecord()
const invalidResponseMessage = ref()
watch(() => product.value.status, newVal => {
    if (newVal === 'fetch-prediction') {
        product.value.status = 'loading'
        const thisProductRecord = storeFileRecord.record.filter(v => v.product_code === product.value.product_code)
        const csvString = papaparse.unparse(thisProductRecord)
        const { execute } = use$fetchWithAutoReNew('/prediction-from-file', {
            method: 'post',
            body: {
                csv_string: csvString,
                record_period: 'daily',
                prediction_period: 'monthly',
                value_column: 'amount',
                date_column: 'date'
            } as TFilePredictionRequestBody,
            onResponse(ctx) {
                const response = (ctx.response._data as TFilePredictionResponse).data!
                product.value.actual_prediction = Math.round(response.prediction[0])
                product.value.lower_bound = Math.round(response.lower[0])
                product.value.upper_bound = Math.round(response.upper[0])
                product.value.mape = response.mape
                product.value.rmse = response.rmse
                product.value.model = response.arima_order
                product.value.status = 'predicted'
            },
            onResponseError(ctx) {
                if (ctx.response.status === 422) {
                    product.value.status = 'invalid'
                    invalidResponseMessage.value = ctx.response._data.message
                } else {
                    product.value.status = 'unpredicted'
                }
            }
        })
        execute()
    }

}, { immediate: true })
const detailPredictionData = ref<TPredictionProductList[number]>()
</script>
