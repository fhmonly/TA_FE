<template>
    <div>
        <NuxtUiButton icon="i-heroicons-plus-20-solid" color="blue" label="Add Supplier"
            @click="() => modalShown = true" />
        <NuxtUiModal v-model="modalShown" :prevent-close="true">
            <NuxtUiCard>
                <template #header>
                    <div class="text-xl font-semibold">
                        Form Add Supplier
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
const modalShown = ref<boolean>(false)
const emit = defineEmits(['created'])
const {
    data, error, execute, formState, status, supplierSchema
} = useAddSupplier()
watch(status, newVal => {
    if (newVal === 'success') {
        emit('created')
        modalShown.value = false
    }
})
</script>