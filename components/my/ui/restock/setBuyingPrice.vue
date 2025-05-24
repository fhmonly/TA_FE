<template>
    <NuxtUiModal v-model="modalShown">
        <NuxtUiCard>
            <NuxtUiFormGroup required label="Selling price">
                <NuxtUiInput v-model="formState.buying_price" />
            </NuxtUiFormGroup>
            <div class="flex justify-end gap-2">
                <NuxtUiButton label="Cancel" color="gray" variant="ghost" />
                <NuxtUiButton :loading="status === 'pending'" label="Save" @click="execute" />
            </div>
        </NuxtUiCard>
    </NuxtUiModal>
</template>
<script lang="ts" setup>
const emit = defineEmits(['updated'])
const id = defineModel('id-product')
const modalShown = computed({
    set(newVal) {
        if (!newVal)
            id.value = undefined
    },
    get() { return !!id.value }
})
const formState = reactive({
    buying_price: undefined
})
const { execute, status } = use$fetchWithAutoReNew(computed(() => `/product/${id.value}`), {
    method: 'patch',
    body: formState,
    onResponse(ctx) {
        const data = ctx.response._data.data
        emit('updated', data)
        modalShown.value = false
        formState.buying_price = undefined
    }
})
</script>