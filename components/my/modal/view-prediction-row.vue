<template>
    <NuxtUiModal v-model="modelModalShown">
        <NuxtUiCard>
            <table v-if="!!modelTableData">
                <tr v-for="(item, index) in Object.entries(modelTableData)" :key="index">
                    <td>{{ item[0] }}</td>
                    <td>{{ item[1] }}</td>
                </tr>
            </table>
        </NuxtUiCard>
    </NuxtUiModal>
</template>
<script lang="ts" setup>
const modelModalShown = defineModel<boolean>('shown')
const modelTableData = defineModel<Record<string, any>>('table-data')
</script>