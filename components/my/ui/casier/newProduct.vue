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

                <NuxtUiFormGroup label="Selling Price" name="selling_price">
                    <NuxtUiInput v-model="formState.selling_price" type="number" placeholder="Enter selling price" />
                </NuxtUiFormGroup>

                <div class="flex justify-end mt-4 space-x-2">
                    <NuxtUiButton type="button" color="red" :disabled="status === 'pending'"
                        @click="modalShown = false">Cancel
                    </NuxtUiButton>
                    <NuxtUiButton type="submit" color="primary" :loading="status === 'pending'">Save</NuxtUiButton>
                </div>
            </NuxtUiForm>
        </NuxtUiCard>
    </NuxtUiModal>
</template>
<script lang="ts" setup>
const modalProductId = defineModel<string>('product_code')
const modalShown = computed<boolean>({
    get() { return !!modalProductId.value },
    set(newVal) {
        if (!newVal) {
            modalProductId.value = undefined
        }
    }
})
const scanMode = ref(false)
const emit = defineEmits(['created'])
const {
    data, error, execute, formState, status, productSchema
} = useAddProduct()
watch(status, newVal => {
    if (newVal === 'success') {
        emit('created', data!.value!.data)
        modalShown.value = false
    }
})

watch(modalProductId, newVal => {
    if (newVal) {
        formState.product_code = newVal
    }
})
</script>