    <template>
        <!-- Low Stock Products Table -->
        <NuxtUiCard class="bg-white dark:bg-gray-800 mb-6">
            <div class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium">Low Stock Products</h3>
                    <NuxtUiButton size="sm" variant="outline" to="/dashboard/restock">Restock</NuxtUiButton>
                </div>
                <div class="overflow-x-auto">
                    <NuxtUiTable :loading="status === 'pending'" :rows="data?.data" :columns="[
                        { key: 'action', label: '#' },
                        { key: 'product_name', label: 'Product Name' },
                        { key: 'category_name', label: 'Category' },
                        { key: 'stock', label: 'Stock' },
                        { key: 'buying_price', label: 'Buying Price' },
                    ]">
                        <template #product_name-data="{ row }">
                            <div class="flex gap-2 items-center">
                                <Icon name="lucide:package" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <span>{{ row.product_name }}</span>
                            </div>
                        </template>
                        <template #category_name-data="{ row }">
                            <span class="capitalize text-center">{{ row.category_name ?? '-' }}</span>
                        </template>
                        <template #buying_price-data="{ row }">
                            {{ numeral(row.buying_price).format('0,0') }}
                        </template>
                        <template #action-data="{ row }">
                            <NuxtUiButton label="Restock" icon="i-heroicons:arrow-path-20-solid"
                                @click="restockProductId = row.id" />
                        </template>
                        <template #empty-state>
                            <div v-if="status === 'error'" class="text-center space-y-6 py-3">
                                <div
                                    class="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <Icon name="i-heroicons-exclamation-triangle"
                                        class="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>

                                <div class="space-y-2">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                        Oops! Something went wrong
                                    </h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                        We couldn't load your inventory data. Please check your connection and try
                                        again.
                                    </p>
                                </div>

                                <div class="flex flex-col sm:flex-row gap-3 items-center justify-center">
                                    <NuxtUiButton label="Refresh Data" icon="i-heroicons-arrow-path" color="red"
                                        @click="refresh" />
                                </div>

                                <!-- Error Details (Optional) -->
                                <details class="text-left w-full max-w-md">
                                    <summary
                                        class="text-xs text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
                                        Show error details
                                    </summary>
                                    <div
                                        class="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 font-mono">
                                        Error: {{ error?.message || 'Failed to fetch inventory data' }}
                                    </div>
                                </details>
                            </div>
                            <MyUiHomeLowStockFineStock v-else />
                        </template>
                    </NuxtUiTable>
                </div>
            </div>
        </NuxtUiCard>
        <MyUiHomeModalAddStock v-model:product_id="restockProductId" v-if="!!restockProductId" @updated="refresh()" />
    </template>
<script lang="ts" setup>
import numeral from 'numeral';
import type { TAPIResponse } from '~/types/api-response/basicResponse';
import type { TLowStockProductResponse } from '~/types/api-response/product';

const {
    data, status, refresh, error
} = useFetchWithAutoReNew<TAPIResponse<TLowStockProductResponse[]>>('/product-low-stock')

const restockProductId = ref<number>()
</script>