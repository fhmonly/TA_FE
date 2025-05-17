<template>
    <NuxtUiCard>
        <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
                <DashboardDatasetProductModalAdd @created="() => refresh()" />
                <DashboardDatasetProductModalCategory />
            </div>
            {{ modal.update.data }}
            <NuxtUiTable :loading="status === 'pending'" :rows="data?.data?.data" :columns="[
                { key: 'actions', label: 'Actions' },
                { key: 'category_name', label: 'Category' },
                { key: 'product_code', label: 'Product Code' },
                { key: 'product_name', label: 'Product Name' },
                { key: 'buying_price', label: 'Buying Price' },
                { key: 'selling_price', label: 'Selling Price' },
                { key: 'stock', label: 'Stock' },
            ]">
                <template #actions-data="{ row }">
                    <NuxtUiDropdown :items="[[
                        {
                            icon: 'i-heroicons-pencil-square-20-solid', label: 'Edit', slot: 'edit', iconClass: 'text-blue-500', click: () => modal.update.data = row
                        },
                        {
                            icon: 'i-heroicons-trash', label: 'Delete', slot: 'delete', iconClass: 'text-red-500', click: () => {
                                modal.delete.data = row
                                modal.delete.shown = true
                            }
                        },
                    ]]" :popper="{ placement: 'bottom-start' }">
                        <NuxtUiButton color="white" label="More" trailing-icon="i-heroicons-chevron-down-20-solid" />
                    </NuxtUiDropdown>
                </template>
            </NuxtUiTable>
        </div>
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
                        <NuxtUiPagination v-model="page" :page-count="limit" :total="Number(data?.data?.meta.total)" />
                    </div>
                </template>
            </div>
        </template>
    </NuxtUiCard>
    <DashboardDatasetProductModalUpdate @updated="() => refresh()" v-model:data="modal.update.data"
        v-if="modal.update.data?.id" :key="modal.update.data?.id" />
    <DashboardDatasetProductModalDelete @deleted="() => refresh()" v-model:shown="modal.delete.shown"
        v-model:data="modal.delete.data" v-if="modal.delete.data?.id" :key="modal.delete.data?.id" />
</template>
<script lang="ts" setup>
import { useProductList } from '~/composables/productFetch';
import type { TProductResponse } from '~/types/api-response/product';

const {
    data, limit, status, page, refresh
} = useProductList()

const modal = reactive<Record<string, {
    shown: boolean,
    data?: TProductResponse
}>>({
    delete: {
        shown: false,
        data: undefined
    },
    update: {
        shown: false,
        data: undefined,
    },
})
</script>