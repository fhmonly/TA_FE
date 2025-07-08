<template>
    <NuxtUiCard class="flex flex-col">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ product.product_name }}</h3>
        </template>

        <template v-if="isFetchingPrediction">
            <div class="product-loading-state flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg">
                <NuxtUiIcon name="i-heroicons-arrow-path" class="animate-spin text-blue-500 text-5xl mb-4" />
                <NuxtUiAlert color="blue" title="Loading Prediction..."
                    description="Please wait while we process the prediction for this product. This may take a moment."
                    class="mb-4" />
                <NuxtUiProgress animation="carousel" class="w-full max-w-sm" />
            </div>
        </template>
        <template v-else>
            <template v-if="!!product.prediction && !!product.upper_bound && !!product.lower_bound">
                <div class="text-center mb-4">
                    <p class="text-5xl font-extrabold text-primary-600 dark:text-primary-400">
                        {{ actualPrediction }}
                        <!-- <span class="text-xl font-normal text-gray-500 dark:text-gray-400">{{ product.unit }}</span> -->
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Prediksi</p>
                </div>

                <div class="mb-4 space-y-2">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Rentang Prediksi:</p>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative">
                        <div class="absolute -top-1 w-4 h-4 rounded-full bg-primary-500 dark:bg-primary-300 border-2 border-white dark:border-gray-900 shadow-md transform -translate-x-1/2"
                            :style="{ left: `${getPercentage(actualPrediction, actualLowerBound, actualUpperBound)}%` }">
                        </div>
                    </div>

                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Min: {{ actualLowerBound }}</span>
                        <span>Max: {{ actualUpperBound }}</span>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="product-unpredicted-state">
                    <NuxtUiAlert color="yellow" title="Prediction Pending"
                        description="This product has not yet been predicted. A prediction is required to proceed."
                        class="mb-4" />
                </div>
            </template>
        </template>

        <template #footer>
            <div class="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400">
                <NuxtUiButton color="primary" variant="soft" size="sm" icon="i-heroicons-arrow-right" trailing
                    v-if="!!product.prediction" @click="emit('open-detail', product.id)">
                    Lihat Detail
                </NuxtUiButton>
                <NuxtUiButton icon="i-heroicons-rocket-launch" color="primary" variant="solid" @click="getPrediction"
                    v-else :loading="isFetchingPrediction">
                    Generate Prediction
                </NuxtUiButton>
            </div>
        </template>
    </NuxtUiCard>
</template>
<script lang="ts" setup>
import type { ExtractSuccessResponse } from '~/types/api-response/basicResponse';
import type { TStockPredictionResponse } from '~/types/api-response/prediction';
import { getPercentage } from '~/utils/math/percentage';

const emit = defineEmits(['open-detail'])
const predictionPeriod = defineModel<"weekly" | "monthly">('prediction-period', { required: true })
const product = defineModel<ExtractSuccessResponse<TStockPredictionResponse>>('product', {
    required: true
})

const isFetchingPrediction = ref(false)
function getPrediction() {
    if (!product.value?.id) return
    isFetchingPrediction.value = true
    const {
        execute
    } = use$fetchWithAutoReNew(`/smart-prediction/${product.value.id}`, {
        method: 'post',
        body: {
            prediction_period: predictionPeriod.value,
            prediction_source: 'sales'
        },
        onResponse(ctx) {
            isFetchingPrediction.value = false
            const data: TStockPredictionResponse = ctx.response._data
            if (data.success)
                product.value = data.data
        },
        onResponseError() {
            isFetchingPrediction.value = false
        },
    })
    execute()
}

const actualPrediction = computed(() => {
    const p = (product.value?.prediction || [0]).reduce((prev, curr) => {
        return Math.max(0, Number(prev) + Number(curr))
    }, 0)
    const s = +(product.value?.stock ?? 0)
    return Math.max(0, p - s)
})

const actualLowerBound = computed(() => {
    const lb = (product.value?.lower_bound || [0]).reduce((prev, curr) => {
        return Math.max(0, Number(prev) + Number(curr))
    }, 0)
    const s = +(product.value?.stock ?? 0)
    return Math.max(0, lb - s)
})

const actualUpperBound = computed(() => {
    const ub = ((product.value?.upper_bound || [0]).reduce((prev, curr) => {
        return Math.max(0, Number(prev) + Number(curr))
    }, 0))
    const s = +(product.value?.stock ?? 0)
    return Math.max(0, ub - s)
})
</script>