<template>
    <NuxtLayout name="landing-page">
        <div @dragenter.prevent @dragover.prevent @drop="e => {
            if (convertStatus !== 'loading') {
                handleDragFile(e)
            }
        }">
            <NuxtUiCard>
                <template #header>
                    <div class="mb-3 flex gap-2">
                        <div>
                            <label for="convert-file-input" class="nuxtui-btn">
                                Import
                            </label>
                            <input id="convert-file-input" type="file" hidden @input="handleFileInput" />
                        </div>
                        <LandingDemoModalMakePrediction v-model="modalMakePredictionModel" :products />
                    </div>
                    <div class="warning space-y-2">
                        <NuxtUiAlert v-for="(item, index) in missingColumn" :key="index"
                            icon="i-heroicons-exclamation-circle" color="orange" variant="subtle"
                            :description="`Column '${item}' is missing.`">
                        </NuxtUiAlert>
                    </div>
                </template>
                <template #default>
                    <NuxtUiTable :columns :loading="convertStatus === 'loading'" :rows="rowsData">
                        <template #actions-data="{ row }">
                            <NuxtUiButton icon="i-heroicons-ellipsis-vertical-solid" color="blue"
                                @click="console.log(row)" />
                        </template>
                    </NuxtUiTable>
                </template>
                <template #footer>

                </template>
            </NuxtUiCard>
            {{ rowsData }}
            <MyInputNumber v-model="a" />
        </div>
    </NuxtLayout>
</template>
<script lang="ts" setup>
import type { TModalMakePredictionModel, TProduct } from '~/types/landing-page/demo/modalMakePrediction'

const a = ref()

const { file, result: convertResult, status: convertStatus } = useFileToJSON()
const { columnKeys, columns, missingColumn } = usePredictionTableColumn()
const rowsData = ref(convertResult.value)
const products = ref<TProduct[]>([])
watch(convertResult, newVal => {
    try {
        columnKeys.value = Object.keys(newVal[0])
        rowsData.value = newVal
        products.value = []
        const { product_code, product_name } = newVal[0]
        const hasRequiredKeys = !!product_code && !!product_name
        newVal.forEach(v => {
            if (hasRequiredKeys)
                products.value.push({
                    product_code: v.product_code,
                    product_name: v.product_name
                })
        })
    } catch (error) {
        columnKeys.value = []
    }
})
const modalMakePredictionModel = reactive<TModalMakePredictionModel>({
    predictionPeriod: undefined,
    recordPeriod: undefined,
    selectedProduct: undefined
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
</script>
