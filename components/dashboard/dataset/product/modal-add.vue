<template>
    <div>
        <NuxtUiButton icon="i-heroicons-plus-20-solid" color="blue" label="Add Product"
            @click="() => modalShown = true" />
        <NuxtUiModal v-model="modalShown" :prevent-close="true">
            <NuxtUiCard>
                <template #header>
                    <div class="text-xl font-semibold">
                        Form Add Product
                    </div>
                </template>

                <NuxtUiForm @submit="execute" :schema="productSchema" :state="formState">
                    <NuxtUiFormGroup label="Product Code" name="product_code" required>
                        <div v-if="scanMode || !formState.product_code" class="mb-2">
                            <MyBarcodeScanner @scanned="e => {
                                formState.product_code = e
                                scanMode = false
                            }" />
                        </div>
                        <NuxtUiInput v-model="formState.product_code" placeholder="Enter product code"
                            :ui="{ icon: { trailing: { pointer: '', padding: { md: 'px-0.5' } } } }" size="md">
                            <template #trailing>
                                <NuxtUiButton icon="i-heroicons-qr-code-20-solid" @click="() => {
                                    scanMode = true
                                    console.log('clicked')
                                }" label="QR" />
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
const modalShown = ref<boolean>(false)
const scanMode = ref(false)
const emit = defineEmits(['created'])
const {
    data, error, execute, formState, status, productSchema
} = useAddProduct()
watch(status, newVal => {
    if (newVal === 'success') {
        emit('created')
        modalShown.value = false
    }
})
</script>