<template>
    <NuxtUiCard>
        <div class="space-y-4">
            <div>
                <DashboardDatasetSupplierModalAddSupplier @created="() => refresh()" />
            </div>
            <NuxtUiTable :loading="status === 'pending'" :rows="data?.data?.data" :columns="[
                { key: 'actions', label: 'Actions' },
                { key: 'supplier_name', label: 'Supplier Name' },
                { key: 'contact', label: 'Contact' },
                { key: 'address', label: 'Address' },
            ]">
                <template #actions-data="{ row }">
                    <NuxtUiDropdown :items="[[
                        {
                            icon: 'i-heroicons-pencil-square-20-solid', label: 'Edit', slot: 'edit', iconClass: 'text-blue-500', click: () => {
                                modal.update.data = row
                                modal.update.shown = true
                            }
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
    <DashboardDatasetSupplierModalUpdateSupplier @updated="() => refresh()" v-model:shown="modal.update.shown"
        v-model:data="modal.update.data" v-if="modal.update.data?.id" :key="modal.update.data?.id" />
    <DashboardDatasetSupplierModalDeleteSupplier @deleted="() => refresh()" v-model:shown="modal.delete.shown"
        v-model:data="modal.delete.data" v-if="modal.delete.data?.id" :key="modal.delete.data?.id" />
</template>
<script lang="ts" setup>
import type { TSupplierResponse } from '~/types/api-response/supplier';

const {
    data, limit, status, page, refresh
} = useSupplierList()

const modal = reactive<Record<string, {
    shown: boolean,
    data?: TSupplierResponse
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