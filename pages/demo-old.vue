<template>
    <NuxtLayout name="landing-page">
        <div @dragenter.prevent @dragover.prevent @drop="handleDragFile">
            <div class="my-3">
                <NuxtUiCard>
                    <div class="space-y-3">
                        <h2 class="text-base font-medium">Prediction Dashboard</h2>
                    </div>
                </NuxtUiCard>
            </div>
            <div>
                <NuxtUiTabs v-model="selectedTab" :items="tabItems" />
                <NuxtUiCard>
                    <template #header>
                        <div class="mb-3 flex gap-2">
                            <div>
                                <label for="convert-file-input" class="nuxtui-btn ">
                                    <NuxtUiIcon name="i-heroicons-document-arrow-down" size="16px" />
                                    Import
                                </label>
                                <input id="convert-file-input" type="file" hidden @input="handleFileInput" />
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
            </div>
        </div>
    </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: 'guest'
})
import type { TFilePredictionRequestBody, TFilePredictionResponse } from '~/types/api-response/prediction';
import type { TModalMakePredictionModel } from '~/types/landing-page/demo/modalMakePrediction'

const inputFile = ref<File | null>(null)

function handleDragFile(e: DragEvent) {
    e.preventDefault();
    if (status.value === 'loading') return
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
        inputFile.value = files[0]
    }
}

function handleFileInput(e: Event) {
    if (status.value === 'loading') return
    const target = e.target as HTMLInputElement
    if (target?.files && target.files.length > 0) {
        const uploaded = target.files[0];
        inputFile.value = uploaded;
    }
}

const {
    status, loadingDetail, result,
    columns, missingColumns, mismatchDetail,
    records, products,
    page, pageCount, rows
} = usePredictionTable(inputFile)
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
