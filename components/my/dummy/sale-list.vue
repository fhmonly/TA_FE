<template>
    <div class="flex items-center justify-end gap-3">
        <label for="prediction-period">Prediction Period:</label>
        <NuxtUiSelectMenu v-model="selectedPeriod" :options="periodOptions" value-attribute="value"
            option-attribute="label" id="prediction-period" />
    </div>

    <div class="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
        <MyDummyCard :product-data="product" :key v-for="(product, key) in data?.data"
            @update-dummy="v => modalProductData = v" />
    </div>

    <MyDummyModalUpdate v-model:product-data="modalProductData" :key="modalProductData?.product_id"
        :period-type="selectedPeriod" :trx-type="'sales'" />
</template>
<script lang="ts" setup>
import type { TDummyResponse } from '~/types/api-response/dummy';

const periodOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
]
const selectedPeriod = ref<'weekly' | 'monthly'>('weekly')

const {
    data,
} = useFetchWithAutoReNew<TDummyResponse>(() => `/dummies/sales/${selectedPeriod.value}`)

const modalProductData = ref<NonNullable<TDummyResponse['data']>[number]>()
</script>