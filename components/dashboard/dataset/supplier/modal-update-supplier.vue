<template>
    <div>
        <NuxtUiModal v-model="modalShown" :prevent-close="true">
            <NuxtUiCard>
                <template #header>
                    <div class="text-xl font-semibold">
                        Form Update Supplier
                    </div>
                </template>

                <NuxtUiForm @submit="execute" :schema="supplierSchema" :state="formState">
                    <NuxtUiFormGroup label="Supplier Name" name="supplier_name" required>
                        <NuxtUiInput v-model="formState.supplier_name" placeholder="Enter supplier name" />
                    </NuxtUiFormGroup>

                    <NuxtUiFormGroup label="Address" name="address">
                        <NuxtUiTextarea v-model="formState.address" placeholder="Enter address" />
                    </NuxtUiFormGroup>

                    <NuxtUiFormGroup label="Contact" name="contact">
                        <NuxtUiInput v-model="formState.contact" placeholder="Enter contact number or email" />
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
import type { TSupplierResponse } from '~/types/api-response/supplier'

const modalShown = defineModel<boolean>('shown')
const modalData = defineModel<TSupplierResponse>('data')
const emit = defineEmits(['updated'])
const {
    data, error, execute, formState, status, supplierSchema,
} = useUpdateSupplier(modalData.value as TSupplierResponse)
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