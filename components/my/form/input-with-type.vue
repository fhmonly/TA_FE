<template>
    <div class="flex">
        <NuxtUiFormGroup label="Type">
            <NuxtUiSelectMenu v-model="valueFormat" :options="valueFormatOptions" placeholder="Select input type"
                option-attribute="label" value-attribute="value" />
        </NuxtUiFormGroup>
        <NuxtUiFormGroup class="grow" label="Value" v-if="valueFormat === 'text'">
            <NuxtUiInput v-model="localValue" />
        </NuxtUiFormGroup>
        <NuxtUiFormGroup class="grow" label="Value" v-else-if="valueFormat === 'number'">
            <MyInputNumber v-model="localValue" />
        </NuxtUiFormGroup>
        <div v-else-if="valueFormat === 'date'">
            <NuxtUiFormGroup class="grow" label="Value">
                <MyInputNumber v-model="localValue" />
            </NuxtUiFormGroup>
            <NuxtUiFormGroup class="grow" label="Format">
                <MyInputNumber />
            </NuxtUiFormGroup>
        </div>
    </div>
</template>
<script lang="ts" setup>
type TValueFormat = 'date' | 'text' | 'number' | undefined
type TValueFormatOptions = {
    value: TValueFormat,
    label: string,
}

const model = defineModel()

const props = defineProps<{
    name: string
}>()

const valueFormat = ref<TValueFormat>('text')
const valueFormatOptions: TValueFormatOptions[] = [
    { value: 'date', label: 'Date' },
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
]

const localValue = ref()

onMounted(() => {
    if (props.name.includes('date')) {
        valueFormat.value = 'date'
    } else if (Number(props.name || NaN) >= 0) {
        valueFormat.value = 'number'
    } else {
        valueFormat.value = 'text'
    }
});

onMounted(() => {
    localValue.value = model.value
})

onUnmounted(() => {
    model.value = localValue.value
})
</script>