<template>
    <input type="text" v-model="model" ref="inputDOM" />
</template>

<script setup lang="ts">
const model = defineModel<string>()
const inputDOM = ref<HTMLInputElement | null>(null)

watch(model, (val, _, onCleanup) => {
    if (!inputDOM.value)
        return
    const start = inputDOM.value.selectionStart
    const end = (Number(inputDOM.value.selectionEnd) || 1) - 1

    const filtered = val?.replace(/[0-9a-b]/g, '')
    if (val !== filtered) {
        model.value = filtered

        nextTick(() => {
            inputDOM.value?.setSelectionRange(start, end)
        })
    }
})

</script>
