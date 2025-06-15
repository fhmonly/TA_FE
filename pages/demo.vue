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
                            <NuxtUiButton label="Forecast All" @click="forecastBtnOnClick"
                                :disabled="analyzeBtnDisabled" :color="analyzeBtnDisabled ? 'gray' : 'green'" />
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
                            <template #product_code-data="{ row }">
                                <span class="">
                                    {{ row.product_code || row.product_name.replaceAll() }}
                                </span>
                            </template>
                        </NuxtUiTable>
                        <MyPredictions v-else-if="selectedTab === 1" />
                    </template>
                    <template #footer v-if="selectedTab === 0">
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
import { useStoreFileRecord } from '~/stores/file/record';

definePageMeta({
    middleware: 'guest'
})

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
        target.value = ''
    }
}

const {
    status, loadingDetail, result,
    columns, missingColumns, mismatchDetail,
    records, products,
    page, pageCount, rows
} = usePredictionInputTable(inputFile)

const storeFileRecord = useStoreFileRecord()
let forecastBtnClicked = ref<boolean>(false)

watch([records, products], ([newRecord, newProducts]) => {
    storeFileRecord.saveAll(newRecord, newProducts)
    forecastBtnClicked.value = false
})

const analyzeBtnDisabled = computed(() => {
    const notHaveAnyValidProduct = products.value.filter(v => v.total >= 10).length < 1
    const hasMissingColumn = missingColumns.value.length >= 1
    const tableHasError = mismatchDetail.value.length >= 1
    const tableIsLoading = status.value === 'loading'
    return (
        notHaveAnyValidProduct ||
        hasMissingColumn ||
        tableHasError ||
        tableIsLoading ||
        forecastBtnClicked.value
    )
})
const selectedTab = ref(0)

const forecastBtnOnClick = () => {
    selectedTab.value = 1
    setTimeout(() => {
        storeFileRecord.forecastAllProduct()
        forecastBtnClicked.value = true
    }, 100);
}

const tabItems = [
    {
        label: 'Table',
        icon: 'i-heroicons-table-cells',
        slot: 'table'
    },
    {
        label: 'Prediction',
        icon: 'i-heroicons-chart-bar',
        slot: 'prediction'
    },
];
</script>
