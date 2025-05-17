<template>
    <NuxtUiModal v-model="modalShown" :prevent-close="status === 'pending'">
        <NuxtUiCard>
            <div class="p-4">
                <h2 class="text-lg font-semibold ">
                    Confirm Deletion
                </h2>
                <p class="mt-2 text-sm ">
                    Are you sure you want to delete this product? This action cannot be undone.
                </p>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <NuxtUiButton @click="modalShown = false" :loading="status === 'pending'">
                        Cancel
                    </NuxtUiButton>
                    <NuxtUiButton color="red" @click="() => execute()" :loading="status === 'pending'">
                        Delete
                    </NuxtUiButton>
                </div>
            </template>
        </NuxtUiCard>
    </NuxtUiModal>
</template>


<script lang="ts" setup>
import { useDeleteProduct } from '~/composables/productFetch'
import type { TProductResponse } from '~/types/api-response/product'

const modalShown = defineModel<boolean>('shown')
const productData = defineModel<TProductResponse>('data')
const emit = defineEmits(['deleted'])
watch(modalShown, newVal => {
    if (newVal && !productData.value?.id) {
        modalShown.value = false
    }
})
const { execute, status } = useDeleteProduct(productData.value!.id)

watch(status, newVal => {
    if (newVal === 'success') {
        emit('deleted')
        modalShown.value = false
    }
})
</script>