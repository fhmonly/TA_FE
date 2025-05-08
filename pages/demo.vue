<template>
    <NuxtLayout name="landing-page">
        <div @dragenter.prevent @dragover.prevent @drop="e => {
            if (convertStatus !== 'loading') {
                handleDragFile(e)
            }
        }">
            <div class="my-3">
                <NuxtUiCard>
                    <div class="space-y-3">
                        <h2 class="text-base font-medium">Prediction Dashboard</h2>
                    </div>
                </NuxtUiCard>
            </div>
            <div>
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
                            <LandingDemoModalMakePrediction v-model="modalMakePredictionModel" :products
                                :disabled="analyzeBtnDisabled" />
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
                        <NuxtUiTable :columns :loading="convertStatus === 'loading'" :rows="rows">
                            <template #actions-data="{ row, column, getRowData }">
                                <!-- <NuxtUiDropdown :items="items" :popper="{ placement: 'bottom-start' }">
                                    <NuxtUiButton icon="i-heroicons-ellipsis-vertical-solid" color="blue" />
                                    <template #item="{ item }: (Record<'item', TPredictionTableDropdown>)">
                                        <div @click="(event) => {
                                            item.data!.value = row;
                                            item.modalShown!.value = true;
                                        }" class="flex items-center justify-between w-full">
                                            <span class="truncate">{{ item.label }}</span>

                                            <NuxtUiIcon :name="(item.icon as string)"
                                                class="flex-shrink-0 h-4 w-4 ms-auto" :class="[
                                                    !!item.iconClass ?
                                                        item.iconClass :
                                                        'text-gray-400 dark:text-gray-500'
                                                ]" />
                                        </div>
                                    </template>
</NuxtUiDropdown> -->
                            </template>
                        </NuxtUiTable>
                    </template>
                    <template #footer>
                        <div class="flex justify-between">
                            <span v-if="rows.length < 1">
                                Nothing here. Please import your spreadsheet or drag your spreadsheet file here.
                            </span>
                            <span v-else>
                                Show {{ rows.length }} data from {{ processedRecords.length }} data
                            </span>
                            <div v-if="!!processedRecords && processedRecords.length > 0">
                                <NuxtUiPagination v-model="page" :page-count="pageCount"
                                    :total="processedRecords.length" />
                            </div>
                        </div>
                    </template>
                </NuxtUiCard>
            </div>
            <MyModalViewPredictionRow v-model:shown="items[0][0].modalShown!.value"
                v-model:table-data="items[0][0].data!.value" />
            <MyModalUpdatePredictionRow v-model:shown="items[0][1].modalShown!.value"
                v-model:table-data="items[0][1].data!.value" />
        </div>
    </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: 'guest'
})
import type { DropdownItem } from '#ui/types'
import type { TModalMakePredictionModel } from '~/types/landing-page/demo/modalMakePrediction'

const { file, result: convertResult, status: convertStatus } = useFileToJSON()
const {
    records, processedRecords, status, loadingDetail, mismatchDetail,
    columns, missingColumns,
    page, pageCount,
    products, rows
} = usePredictionTable()
watch(convertResult, newVal => records.value = newVal)
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

const modal = reactive({
    view: {
        shown: false,
        data: {}
    },
    update: {
        shown: false,
        data: {}
    },
    delete: {
        shown: false
    }
})

function handleDragFile(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
        file.value = files[0]
    }
}

function handleFileInput(e: Event) {
    const target = e.target as HTMLInputElement
    if (target?.files && target.files.length > 0) {
        const uploaded = target.files[0];
        file.value = uploaded;
    }
}

type TPredictionTableDropdown = DropdownItem & {
    data?: Ref<Record<string, any>>,
    modalShown?: Ref<boolean>
}
const items:
    TPredictionTableDropdown[][] = [
        [{
            label: 'View',
            icon: 'i-heroicons-eye-20-solid',
            shortcuts: ['V'],
            iconClass: '',
            data: ref({}),
            modalShown: ref(false)
        }, {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            shortcuts: ['E'],
            iconClass: '',
            data: ref({}),
            modalShown: ref(false)
        }], [{
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid',
            shortcuts: ['D'],
            iconClass: '',
            data: ref({}),
            modalShown: ref(false)
        }]
    ]
</script>
