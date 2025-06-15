<template>
    <NuxtUiCard class="w-full">
        <template #header>
            <h3 class="text-xl font-semibold text-gray-800">Detail Produk</h3>
        </template>

        <div class="space-y-3">
            <p class="text-gray-700">
                <span class="font-medium">Product Name:</span> {{ productData.product_name }}
            </p>
            <p class="text-gray-700">
                <span class="font-medium">Dummy Progress:</span>
                {{(productData.fake_json || []).filter(v => v >= 1).length}}/10
            </p>
        </div>

        <template #footer>
            <div class="flex justify-end">
                <NuxtUiButton label="Update Dummy" icon="i-lucide:test-tube-diagonal"
                    @click="emit('update-dummy', productData)" />
            </div>
        </template>
    </NuxtUiCard>
</template>

<script setup lang="ts">
import type { TDummyResponse } from '~/types/api-response/dummy';

const emit = defineEmits(['update-dummy'])
const productData = defineModel<NonNullable<TDummyResponse['data']>[number]>('product-data', { required: true })
</script>