<template>
    <NuxtUiModal v-model="modelModalShown">
        <NuxtUiCard>
            <template v-if="!!modelTableData">
                <MyFormInputWithType v-for="(item, index) in Object.entries(modelTableData)" :key="index"
                    v-model="getComputedField(item[0]).value" :name="item[0]">
                </MyFormInputWithType>
            </template>
        </NuxtUiCard>
    </NuxtUiModal>
</template>

<script lang="ts" setup>
const modelModalShown = defineModel<boolean>('shown')
const modelTableData = defineModel<Record<string, any>>('table-data')

const getComputedField = (key: string) => computed({
    get: () => modelTableData.value?.[key],
    set: (val) => {
        if (modelTableData.value)
            modelTableData.value[key] = val
    }
})
</script>