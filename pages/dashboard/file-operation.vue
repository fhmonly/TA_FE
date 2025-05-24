<template>
    <NuxtLayout name="main">
        <div @dragenter.prevent @dragover.prevent @drop="onDragHandler">
            <NuxtUiCard>
                <NuxtUiTabs v-model="selectedTab" :items="tabItems" />
                <NuxtUiCard>
                    <template #header>
                        <div class="mb-3 flex gap-2">
                            <div class="flex gap-2">
                                <label for="import-file-input" class="cursor-pointer">
                                    <input type="file" hidden @input="onInputHandler" id="import-file-input" />
                                    <span class="pointer-events-none">
                                        <NuxtUiButton icon="i-heroicons-arrow-down-on-square" label="Import"
                                            color="gray" />
                                    </span>
                                </label>
                                <div>
                                    <NuxtUiButton :label="`Save ${1} Products`" />
                                </div>
                            </div>
                            <LandingDemoModalMakePrediction v-model="modalMakePredictionModel"
                                v-model:csv="result.csv.value" :disabled="analyzeBtnDisabled"
                                v-model:result="predictionResult" />
                        </div>
                        <div class="warning space-y-2">
                            <NuxtUiAlert v-for="(item, index) in missingColumns" :key="index"
                                icon="i-heroicons-exclamation-circle" color="orange" variant="subtle"
                                :description="`Column '${item}' is missing.`">
                            </NuxtUiAlert>
                            <NuxtUiAlert v-for="(msg, index) in mismatchDetail" :key="index"
                                icon="i-heroicons-exclamation-circle" color="red" variant="subtle" :description="msg">
                            </NuxtUiAlert>
                        </div>
                    </template>
                    <template #default>
                        <NuxtUiTable :columns :loading="status === 'loading'" :rows="rows" v-if="selectedTab === 0">
                        </NuxtUiTable>
                        <NuxtUiTable :columns="predictionResultHeader" :loading="predictionResult.status === 'pending'"
                            :rows="predictionResult.result?.data" v-else>
                        </NuxtUiTable>
                    </template>
                    <template #footer>
                        <div class="flex justify-between">
                            <span v-if="rows.length < 1">
                                Nothing here. Please import your spreadsheet or drag your spreadsheet file here.
                            </span>
                            <span v-else>
                                Show {{ rows.length }} data from {{ records.length }} data
                            </span>
                            <div v-if="!!records && records.length > 0">
                                <NuxtUiPagination v-model="page" :page-count="pageCount" :total="records.length" />
                            </div>
                        </div>
                    </template>
                </NuxtUiCard>
            </NuxtUiCard>
        </div>
    </NuxtLayout>
</template>
<script lang="ts" setup>
import { useFileHandler } from '~/composables/fileHandler';
import type { TPyPrediction } from '~/types/api-response/py-prediction';
import type { TModalMakePredictionModel } from '~/types/landing-page/demo/modalMakePrediction';

definePageMeta({
    middleware: ['authentication']
})
const {
    file,
    onDragHandler,
    onInputHandler
} = useFileHandler()

const {
    status, loadingDetail, result,
    columns, missingColumns, mismatchDetail,
    records, products,
    page, pageCount, rows
} = usePredictionTable(file)

const analyzeBtnDisabled = computed(() => {
    const notHaveAnyProduct = products.value.length < 1
    const hasMissingColumn = missingColumns.value.length >= 1
    const tableHasError = mismatchDetail.value.length >= 1
    const tableIsLoading = status.value === 'loading'
    return (
        notHaveAnyProduct ||
        hasMissingColumn ||
        tableHasError ||
        tableIsLoading
    )
})

const modalMakePredictionModel = reactive<TModalMakePredictionModel>({
    predictionPeriod: undefined,
    recordPeriod: undefined,
    selectedProduct: undefined,
    arimaModel: undefined,
    predictionMode: 'optimal'
})
const predictionResult = ref<{
    status: 'idle' | 'pending' | 'success' | 'error'
    result?: TPyPrediction
}>({
    status: 'idle',
    result: undefined,
})
const predictionResultHeader = computed(() => {
    const period = predictionResult.value.result?.data[0].predictionPeriod === 'monthly' ? 'Month' : 'Week'
    return ([
        { key: "product", label: "#", sortable: true },
        { key: "phase1", label: `${period} 1`, sortable: true },
        { key: "phase2", label: `${period} 2`, sortable: true },
        { key: "phase3", label: `${period} 3`, sortable: true },
    ])
})

const selectedTab = ref(0)
watch(() => predictionResult.value.status, newVal => {
    if (newVal === 'success') {
        selectedTab.value = 1
    }
})

const tabItems = [
    {
        label: 'Table',
        icon: 'i-heroicons-table-cells',
    },
    {
        label: 'Result',
        icon: 'i-heroicons-chart-bar',
    },
];
</script>