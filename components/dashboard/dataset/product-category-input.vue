<template>
    {{ selectedId }}
    <NuxtUiSelectMenu v-model="selected" value-attribute="id" :options option-attribute="category_name" searchable
        creatable show-create-option-when="always" placeholder="Select category" :loading="status === 'pending'"
        v-model:query="query">
    </NuxtUiSelectMenu>
</template>
<script lang="ts" setup>
const selectedId = defineModel()
const query = ref()
const {
    options,
    selected,
    status,
} = useProductCategoryListOptions()
watch(selected, newVal => {
    selectedId.value = newVal
    query.value = ''
})
onMounted(() => {
    if (!!selectedId.value)
        selected.value = selectedId.value as any
})
</script>
