<template>
    <div class="flex h-screen">
        <!-- <div class="flex-1 p-4 overflow-auto">
            <h2 class="text-2xl font-bold mb-4">Peramalan Stok Produk</h2>
            <NuxtUiTable :rows="products" :columns="columns" @select="selectProduct" class="min-w-full">
                <template #name-data="{ row }">
                    <NuxtUiButton variant="link" @click="selectProduct(row)" class="px-0 py-0 text-left">
                        {{ row.name }}
                    </NuxtUiButton>
                </template>
<template #predictedValue-data="{ row }">
                    <span class="font-bold text-primary-500 dark:text-primary-400">{{ row.predictedValue }}</span>
                </template>
<template #status-data="{ row }">
                    <NuxtUiBadge :color="getStatusColor(row)" variant="subtle" class="capitalize">
                        {{ getStatus(row) }}
                    </NuxtUiBadge>
                </template>
</NuxtUiTable>
</div>

<NuxtUiModal v-model="isSidebarOpen" :overlay="false" :transition="false"
    class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-lg sm:translate-x-0"
    :class="{ 'translate-x-full': !isSidebarOpen }">
    <NuxtUiCard v-if="selectedProduct" class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' } }">
        <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold">{{ selectedProduct.name }}</h3>
                        <NuxtUiButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="closeSidebar" />
                    </div>
                </template>

        <div class="space-y-4">
            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Nilai Prediksi</p>
                <p class="text-4xl font-extrabold text-primary-600 dark:text-primary-400">
                    {{ selectedProduct.predictedValue }}
                    <span class="text-lg font-normal text-gray-500 dark:text-gray-400">{{ selectedProduct.unit
                        }}</span>
                </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Lower Bound</p>
                    <p class="text-lg font-semibold text-red-500">{{ selectedProduct.lowerBound }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Upper Bound</p>
                    <p class="text-lg font-semibold text-green-500">{{ selectedProduct.upperBound }}</p>
                </div>
            </div>

            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Rentang Keyakinan</p>
                <p class="text-lg font-semibold">{{ (selectedProduct.upperBound -
                    selectedProduct.lowerBound).toFixed(2) }}</p>
            </div>

            <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-48 flex items-center justify-center">
                <p class="text-gray-400 dark:text-gray-500">Grafik Peramalan Historis (integrasi Chart.js dll.)
                </p>
            </div>

            <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Catatan:</p>
                <p class="text-gray-700 dark:text-gray-300">{{ selectedProduct.notes }}</p>
            </div>
        </div>

        <template #footer>
                    <div class="flex justify-end space-x-2">
                        <NuxtUiButton color="gray" variant="ghost">Export Data</NuxtUiButton>
                        <NuxtUiButton color="primary">Sesuaikan Prediksi</NuxtUiButton>
                    </div>
                </template>
    </NuxtUiCard>
</NuxtUiModal> -->
    </div>
</template>
<script lang="ts" setup>
import type { TPredictionProductList } from '~/types/prediction/product-list';

const getAllPrediction = defineModel<boolean>('get-all-prediction')
const productList = defineModel<TPredictionProductList>('product-list')
</script>