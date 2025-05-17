<template>
    <div>
        <NuxtUiModal v-model="modalShown" :prevent-close="true">
            <NuxtUiCard>
                <template #header>
                    <div class="text-xl font-semibold">
                        Form Update Supplier
                    </div>
                </template>

                <NuxtUiForm @submit="execute" :schema="productSchema" :state="formState">
                    <NuxtUiFormGroup label="Product Code" name="product_code" required>
                        <NuxtUiInput v-model="formState.product_code" placeholder="Enter product code" />
                    </NuxtUiFormGroup>

                    <NuxtUiFormGroup label="Product Name" name="product_name" required>
                        <NuxtUiInput v-model="formState.product_name" placeholder="Enter product name" />
                    </NuxtUiFormGroup>

                    <NuxtUiFormGroup label="Product Category" name="product_category_id">
                        <DashboardDatasetProductCategoryInput v-model="formState.product_category_id" />
                    </NuxtUiFormGroup>

                    <NuxtUiFormGroup label="Stock" name="stock">
                        <NuxtUiInput v-model="formState.stock" type="number" placeholder="Enter stock amount" />
                    </NuxtUiFormGroup>

                    <NuxtUiFormGroup label="Buying Price" name="buying_price">
                        <NuxtUiInput v-model="formState.buying_price" type="number" placeholder="Enter buying price" />
                    </NuxtUiFormGroup>

                    <NuxtUiFormGroup label="Selling Price" name="selling_price">
                        <NuxtUiInput v-model="formState.selling_price" type="number"
                            placeholder="Enter selling price" />
                    </NuxtUiFormGroup>

                    <div class="flex justify-end mt-4 space-x-2">
                        <NuxtUiButton type="button" color="red" :loading="status === 'pending'"
                            @click="() => modalShown = false">Cancel
                        </NuxtUiButton>
                        <NuxtUiButton type="submit" color="primary" :loading="status === 'pending'">Save</NuxtUiButton>
                    </div>
                </NuxtUiForm>
            </NuxtUiCard>
        </NuxtUiModal>
    </div>
</template>
<script lang="ts" setup>
import type { TProductResponse } from '~/types/api-response/product'

const modalData = defineModel<TProductResponse>('data')
const modalShown = computed({
    get: () => !!modalData.value,
    set: (newVal) => {
        if (!newVal) {
            modalData.value = undefined
        }
    }
})
const emit = defineEmits(['updated'])
const {
    data, error, execute, formState, status, productSchema,
} = useUpdateProduct(modalData.value as TProductResponse)
watch(modalShown, newVal => {
    if (newVal && !modalData.value?.id) modalShown.value = false
}, { immediate: true })
watch(status, newVal => {
    if (newVal === 'success') {
        emit('updated')
        modalShown.value = false
    }
})
</script>