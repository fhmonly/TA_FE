<template>
    <div>
        <NuxtUiButton @click="modalShown = true" color="blue" label="Analyze" icon="i-heroicons-arrow-trending-up-solid"
            :disabled="props.disabled" />
        <NuxtUiModal v-model="modalShown">
            <NuxtUiCard>
                <NuxtUiForm :schema="schema" :state="state">
                    <div class="space-y-2 mb-4">
                        <h2 class="text-lg font-bold text-center">
                            Prediction Setup
                        </h2>
                        <NuxtUiAlert variant="soft" color="orange"
                            description="Please fill form honestly for better prediction." />
                        <NuxtUiDivider label="Form" />
                        <NuxtUiFormGroup label="Record type">
                            <NuxtUiSelectMenu v-model="formData.recordPeriod" :options="recordPeriodOptions"
                                placeholder="Select period" />
                        </NuxtUiFormGroup>
                        <NuxtUiFormGroup label="Prediction type">
                            <NuxtUiSelectMenu v-model="formData.predictionPeriod" :options="predictionPeriodOptions"
                                placeholder="Select prediction period" />
                        </NuxtUiFormGroup>
                        <div class="space-y-2">
                            <NuxtUiFormGroup label="Prediction Mode">
                                <NuxtUiSelectMenu v-model="formData.predictionMode" :options="predictionModeOptions"
                                    value-attribute="value" option-attribute="label" />
                            </NuxtUiFormGroup>

                            <div class="space-y-2" v-if="formData.predictionMode === 'custom'">
                                <NuxtUiAlert color="yellow" variant="soft"
                                    description="Ensure you have expertise and a solid understanding of ARIMA before proceeding." />
                                <div class="flex gap-2">
                                    <NuxtUiFormGroup label="Model AR">
                                        <NuxtUiInput type='number' v-model="formData.modelAR" />
                                    </NuxtUiFormGroup>

                                    <NuxtUiFormGroup label="Differencing">
                                        <NuxtUiInput type='number' v-model="formData.differencing" />
                                    </NuxtUiFormGroup>

                                    <NuxtUiFormGroup label="Model MA">
                                        <NuxtUiInput type='number' v-model="formData.modelMA" />
                                    </NuxtUiFormGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                        <NuxtUiButton label="Cancel" color="red" @click="modalShown = false" />
                        <NuxtUiButton @click="execute" :loading="status === 'pending'">Analyze Now!</NuxtUiButton>
                    </div>
                </NuxtUiForm>
            </NuxtUiCard>
        </NuxtUiModal>
    </div>
</template>
<script lang="ts" setup>
import type { TPyPrediction } from '~/types/api-response/py-prediction';
import type { TModalMakePredictionProps } from '~/types/landing-page/demo/modalMakePrediction';

const modalShown = ref<boolean>(false)
const csv = defineModel<File>('csv')
const resultModel = defineModel<{
    result: TPyPrediction
    status: 'idle' | 'pending' | 'success' | 'error'
}>('result')
const props = withDefaults(defineProps<TModalMakePredictionProps>(), {
    products: undefined,
    disabled: false,
})

const {
    result, status, error, execute, formData, ARIMASchema,
    recordPeriodOptions, predictionPeriodOptions, predictionModeOptions
} = usePredictionFetch()

watch(status, newVal => {
    resultModel.value!.status = newVal
    if (newVal === 'success') {
        resultModel.value!.result = result.value as TPyPrediction
        modalShown.value = false
    }
})

watch(() => formData.recordPeriod, () => {
    formData.predictionPeriod = 'monthly'
})

watch(csv, newVal => {
    if (!!newVal)
        formData.sheet = newVal
})
</script>