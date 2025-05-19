<template>
    <NuxtUiModal v-model="modalShown" :prevent-close="true">
        <NuxtUiCard>
            <template #header>
                <div class="text-xl font-semibold">
                    Form Add Product
                </div>
            </template>

            <NuxtUiForm @submit="execute" :schema="productSchema" :state="formState">
                <div v-if="scanMode || !formState.product_code">
                    <MyBarcodeScanner @scanned="e => {
                        formState.product_code = e
                        scanMode = false
                    }" />
                </div>
                <NuxtUiFormGroup label="Product Code" name="product_code" required v-else>
                    <NuxtUiInput v-model="formState.product_code" placeholder="Enter product code">
                        <template #trailing>
                            <NuxtUiButton icon="i-heroicons-qr-code-20-solid" @click="scanMode = true" />
                        </template>
                    </NuxtUiInput>
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
                    <NuxtUiInput v-model="formState.selling_price" type="number" placeholder="Enter selling price" />
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
</template>
<script lang="ts" setup>
const modalProductId = defineModel<string>('id')
const modalShown = ref<boolean>(false)
const scanMode = ref(false)
const emit = defineEmits(['created'])
const {
    data, error, execute, formState, status, productSchema
} = useAddProduct()
watch(status, newVal => {
    if (newVal === 'success') {
        emit('created', {
            id: data!.value!.data!.productId,
            ...formState
        })
        modalShown.value = false
    }
})
</script>