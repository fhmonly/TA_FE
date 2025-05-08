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
                            <NuxtUiSelectMenu v-model="model.recordPeriod" :options="recordOptions"
                                placeholder="Select period" />
                        </NuxtUiFormGroup>
                        <NuxtUiFormGroup label="Product">
                            <NuxtUiSelectMenu v-model="model.selectedProduct" :options="props.products"
                                placeholder="Select product to predict" />
                        </NuxtUiFormGroup>
                        <NuxtUiFormGroup label="Prediction type">
                            <NuxtUiSelectMenu v-model="model.predictionPeriod" :options="predictionOptions"
                                placeholder="Select prediction period" />
                        </NuxtUiFormGroup>
                        <div class="space-y-2">
                            <NuxtUiFormGroup label="Prediction Mode">
                                <NuxtUiSelectMenu v-model="model.predictionMode" :options="predictionModeOptions"
                                    value-attribute="value" option-attribute="label" />
                            </NuxtUiFormGroup>

                            <div class="flex gap-2" v-if="model.predictionMode === 'custom'">
                                <NuxtUiFormGroup label="Model AR">
                                    <NuxtUiInput type='number' v-model="state.modelAR" />
                                </NuxtUiFormGroup>

                                <NuxtUiFormGroup label="Differencing">
                                    <NuxtUiInput type='number' v-model="state.differencing" />
                                </NuxtUiFormGroup>

                                <NuxtUiFormGroup label="Model MA">
                                    <NuxtUiInput type='number' v-model="state.modelMA" />
                                </NuxtUiFormGroup>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                        <NuxtUiButton label="Cancel" color="red" @click="modalShown = false" />
                        <NuxtUiButton @click="() => {
                            emit('prepared')
                            modalShown = false
                        }">Analyze Now!</NuxtUiButton>
                    </div>
                </NuxtUiForm>
            </NuxtUiCard>
        </NuxtUiModal>
    </div>
</template>
<script lang="ts" setup>
import { z } from 'zod';
import type { TDurationType, TModalMakePredictionModel, TModalMakePredictionProps, TPredictionMode } from '~/types/landing-page/demo/modalMakePrediction';

const modalShown = ref<boolean>(false)
const model = defineModel<TModalMakePredictionModel>({
    default: {
        recordPeriod: undefined,
        selectedProduct: undefined,
        predictionPeriod: undefined,
        predictionMode: 'optimal',
        arimaModel: undefined
    },
    required: true
})

watch(() => model.value.recordPeriod, () => {
    model.value.predictionPeriod = undefined
})

const props = withDefaults(defineProps<TModalMakePredictionProps>(), {
    products: undefined,
    disabled: false,
})

const emit = defineEmits(['prepared'])

const recordOptions: TDurationType[] = ['daily', 'weekly', 'monthly']
const predictionOptions = computed(() => {
    return filterPeriods(recordOptions, model.value.recordPeriod).filter(v => v !== 'daily')
})
function filterPeriods(periods: TDurationType[], current?: TDurationType) {
    return periods.filter(p => periods.indexOf(p) >= periods.indexOf(current || 'daily'));
}

const schema = z.object({
    modelAR: z.string().min(1, { message: 'Model AR wajib diisi' }).regex(/^\d+$/, { message: 'Model AR harus angka' }),
    differencing: z.string().min(1, { message: 'Differencing wajib diisi' }).regex(/^\d+$/, { message: 'Differencing harus angka' }).max(2),
    modelMA: z.string().min(1, { message: 'Model MA wajib diisi' }).regex(/^\d+$/, { message: 'Model MA harus angka' }),
})

const state = reactive<Record<string, number>>({
    modelAR: 2,
    differencing: 1,
    modelMA: 2,
})

watch(state, newVal => {
    const { modelAR, differencing, modelMA } = newVal
    model.value.arimaModel = [modelAR, differencing, modelMA]
})

type TPredictionModeOpt = {
    value: TPredictionMode,
    label: string
}

const predictionModeOptions: TPredictionModeOpt[] = [
    { value: 'optimal', label: 'Optimal (2,1,2)' },
    { value: 'auto', label: 'Auto (Flexible)' },
    { value: 'custom', label: 'Custom' },
]
</script>