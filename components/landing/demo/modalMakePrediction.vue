<template>
    <div>
        <NuxtUiButton @click="modalShown = true" color="blue" label="Analyze" />
        <NuxtUiModal v-model="modalShown">
            <NuxtUiCard>
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
                </div>
                <div class="flex justify-end gap-2">
                    <NuxtUiButton label="Cancel" color="red" @click="modalShown = false" />
                    <NuxtUiButton @click="() => {
                        emit('prepared')
                        modalShown = false
                    }">Analyze Now!</NuxtUiButton>
                </div>
            </NuxtUiCard>
        </NuxtUiModal>
    </div>
</template>
<script lang="ts" setup>
import type { TDurationType, TModalMakePredictionModel, TModalMakePredictionProps } from '~/types/landing-page/demo/modalMakePrediction';

const modalShown = ref<boolean>(false)
const model = defineModel<TModalMakePredictionModel>({
    default: {
        recordPeriod: undefined,
        selectedProduct: undefined,
        predictionPeriod: undefined,
    },
    required: true
})

watch(() => model.value.recordPeriod, () => {
    model.value.predictionPeriod = undefined
})

const props = withDefaults(defineProps<TModalMakePredictionProps>(), {
    products: undefined
})

const emit = defineEmits(['prepared'])

const recordOptions: TDurationType[] = ['daily', 'weekly', 'monthly']
const predictionOptions = computed(() => {
    return filterPeriods(recordOptions, model.value.recordPeriod).filter(v => v !== 'daily')
})
function filterPeriods(periods: TDurationType[], current?: TDurationType) {
    return periods.filter(p => periods.indexOf(p) >= periods.indexOf(current || 'daily'));
}
</script>