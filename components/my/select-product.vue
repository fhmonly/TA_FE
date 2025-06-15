<template>
    <div class="flex bg-gray-100 p-2 rounded-md shadow-md">
        <NuxtUiButton @click="refresh" icon="i-heroicons:arrow-path-solid" :loading="status === 'pending'"
            color="gray" />

        <NuxtUiSelectMenu v-model="selectedProductCode" searchable searchable-placeholder="Search a product..."
            class="w-full lg:w-48 grow" placeholder="Select a product" :options="productOptions"
            :loading="status === 'pending'" option-attribute="product_name" value-attribute="product_code" />

        <div class="grow">
            <NuxtUiButton label="Add" icon="i-heroicons:plus-20-solid" @click="pickProductHandler" block />
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { TLimitedAllProductResponse } from '~/types/api-response/product'

const keyword = ref<string>('')
const emit = defineEmits(['picked'])
const selectedProductCode = ref()
const pickProductHandler = () => emit('picked', selectedProductCode.value)
const {
    data,
    refresh,
    status
} = useFetchWithAutoReNew<TLimitedAllProductResponse>('/all-products/limited', {
    key: 'all-product-limited'
})
const productOptions = computed(() => {
    return data.value?.success ?
        data.value.data :
        []
})
</script>