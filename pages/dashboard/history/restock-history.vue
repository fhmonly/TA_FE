<template>
    <NuxtLayout name="main">
        <NuxtUiCard>
            <div>
                <NuxtUiButton icon="i-heroicons-arrow-path-20-solid" label="Refresh" color="blue"
                    @click="() => refresh()" />
            </div>
            <NuxtUiTable :loading="status === 'pending'" :rows="data?.data?.data" :columns="[
                { key: 'buying_date', label: 'Transaction Date' },
                { key: 'product_name', label: 'Product Name' },
                { key: 'price', label: 'Price' },
                { key: 'amount', label: 'Amount' },
                { key: 'total_price', label: 'Total Price' },
            ]">
            </NuxtUiTable>
            <template #footer>
                <div class="flex justify-between">
                    <template v-if="Number(data?.data?.data.length) < 1">
                        <span>
                            Nothing here.
                        </span>
                    </template>
                    <template v-else>
                        <span>
                            Show {{ data?.data?.data.length }} data from {{ data?.data?.meta.total }} data
                        </span>
                        <div>
                            <NuxtUiPagination v-model="page" :page-count="limit"
                                :total="Number(data?.data?.meta.total)" />
                        </div>
                    </template>
                </div>
            </template>
        </NuxtUiCard>
    </NuxtLayout>
</template>
<script lang="ts" setup>
import type { TPaginatedResponse } from '~/types/api-response/basicResponse'
import type { TRestocksHistoryResponse } from '~/types/api-response/trx'

definePageMeta({
    middleware: ['authentication']
})
const page = ref(1)
const limit = ref(10)
const { data, refresh, status } = useFetchWithAutoReNew<
    TPaginatedResponse<TRestocksHistoryResponse>
>(computed(() => `/restocks-history?page=${page.value}&limit=${limit.value}`))
</script>