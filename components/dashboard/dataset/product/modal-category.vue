<template>
    <NuxtUiButton color="blue" label="Category List" @click="mainModalShown = true" />
    <NuxtUiModal v-model="mainModalShown" prevent-close>
        <div class="relative">
            <NuxtUiCard>
                <div class="absolute top-0 left-0 right-0 p-2  z-10">
                    <div class="flex justify-end">
                        <NuxtUiButton color="red" icon="i-heroicons-x-mark-16-solid" @click="mainModalShown = false" />
                    </div>
                </div>
                <NuxtUiForm :state="formState">
                    <div class="mb-4 space-y-3 mt-4">
                        <NuxtUiFormGroup label="New Category">
                            <NuxtUiInput v-model="formState.category_name" placeholder="Insert category name here..." />
                        </NuxtUiFormGroup>
                        <div class="flex justify-end">
                            <NuxtUiButton @click="() => createNow()" :loading="createStatus === 'loading'"
                                label="Simpan" type="submit" />
                        </div>
                    </div>
                </NuxtUiForm>
                <div class="max-h-[300px] overflow-y-auto">
                    <NuxtUiTable :columns="[
                        { key: 'category_name', label: 'Name' },
                        { key: 'action', label: 'Action' }
                    ]" :rows="productCategoryList?.data" :loading="productCategoryListStatus === 'pending'">
                        <template #action-data="{ row }">
                            <div class="flex justify-center">
                                <NuxtUiButton icon="i-heroicons-trash" color="red"
                                    @click="tobeDeleteCategoryId = row.id" />
                            </div>
                        </template>
                    </NuxtUiTable>
                </div>
            </NuxtUiCard>
        </div>
    </NuxtUiModal>
    <NuxtUiModal v-model="confirmationModalShown">
        <NuxtUiCard>
            <p>Are you sure delete this category?</p>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <NuxtUiButton color="green" label="Cancel" @click="tobeDeleteCategoryId = undefined"
                        :loading="status === 'pending'" />
                    <NuxtUiButton color="red" label="Delete" @click="execute" :loading="status === 'pending'" />
                </div>
            </template>
        </NuxtUiCard>
    </NuxtUiModal>
</template>
<script lang="ts" setup>
const mainModalShown = ref(false)
const { productCategoryId: tobeDeleteCategoryId, execute, status } = useDeleteProductCategory()
const confirmationModalShown = computed<boolean>({
    set(newVal) { if (!newVal) tobeDeleteCategoryId.value = undefined },
    get: () => !!tobeDeleteCategoryId.value
})

const {
    refresh: refreshProductCategory, data: productCategoryList, status: productCategoryListStatus
} = useShowProductCategory()

watch(status, newVal => {
    if (newVal === 'success') {
        tobeDeleteCategoryId.value = undefined
        refreshProductCategory()
    }
})
const {
    createNow, formState, status: createStatus
} = useAddProductCategory()

watch(createStatus, newVal => {
    if (newVal === 'success') {
        refreshProductCategory()
    }
})
</script>