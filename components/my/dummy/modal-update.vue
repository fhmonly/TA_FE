<template>
    <NuxtUiModal v-model="modalShown" :prevent-close="true">
        <template v-if="!!productData">
            <NuxtUiForm :schema="formSchema" @submit="handleSubmit" :state="formData">
                <NuxtUiCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                                Edit Product Data
                            </h3>
                            <NuxtUiButton icon="i-heroicons-x-mark-20-solid" color="gray" variant="ghost"
                                @click="modalShown = false" aria-label="Close" />
                        </div>
                    </template>

                    <div class="space-y-6 p-4">
                        <NuxtUiFormGroup label="Product Name" name="product_name">
                            <NuxtUiInput v-model="productData.product_name" disabled />
                        </NuxtUiFormGroup>

                        <NuxtUiFormGroup label="Dummy Data" name="fakeDataArray"
                            :error="formSchema.safeParse(formData).error?.errors[0].message">
                            <div class="grid gap-3 grid-cols-2">
                                <div v-for="(item, index) in formData.fakeDataArray" :key="`fake-input-${index}`"
                                    class="flex items-center gap-3">
                                    <p class="w-8 flex-shrink-0 text-right text-sm text-gray-500 dark:text-gray-400">
                                        {{ index + 1 }}.
                                    </p>
                                    <NuxtUiInput v-model="formData.fakeDataArray[index]"
                                        :placeholder="`Value ${index + 1}`" type="number" class="flex-grow"
                                        name="fakeDataArray" />
                                </div>
                            </div>
                        </NuxtUiFormGroup>
                    </div>

                    <template #footer>
                        <div class="flex justify-end gap-3 p-4">
                            <NuxtUiButton variant="ghost" @click="modalShown = false">Cancel</NuxtUiButton>
                            <NuxtUiButton type="submit" color="primary">Submit</NuxtUiButton>
                        </div>
                    </template>
                </NuxtUiCard>
            </NuxtUiForm>
        </template>
        <NuxtUiModal v-model="successModalShown">
            <NuxtUiCard class="p-6">
                <div class="text-center">
                    <div class="mb-4">
                        <UIcon name="i-heroicons-check-circle-solid" class="text-green-500 w-16 h-16 mx-auto" />
                    </div>
                    <h2 class="text-2xl font-bold text-green-700 mb-2">Data Successfully Added!</h2>
                    <p class="text-gray-700">Your data has been successfully updated in our system.</p>
                </div>
                <div class="flex justify-center mt-6">
                    <NuxtUiButton color="green" variant="solid" @click="successModalShown = false">
                        OK
                    </NuxtUiButton>
                </div>
            </NuxtUiCard>
        </NuxtUiModal>
    </NuxtUiModal>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import type { TAPIResponse } from '~/types/api-response/basicResponse'
import type { TDummyResponse } from '~/types/api-response/dummy'

const emit = defineEmits(['updated'])
const trx_type = defineModel<'purchases' | 'sales'>('trx-type', { required: true })
const period_type = defineModel<'weekly' | 'monthly'>('period-type', { required: true })
const productData = defineModel<NonNullable<TDummyResponse['data']>[number]>('product-data')

// Init dummy data array with zeros
const formData = reactive({
    fakeDataArray: Array(10).fill(0)
})

// Modal logic based on productData
const modalShown = computed({
    get: () => !!productData.value?.product_id,
    set(newVal) {
        if (!newVal) {
            productData.value = undefined
        }
    }
})

// Form validation schema
const formSchema = z.object({
    fakeDataArray: z.array(
        z.preprocess(
            (val) => Number(val),
            z.number().min(0, 'No negative')
        )
    ).length(10, 'Fill all input column'),
})

const successModalShown = ref(false)
watch(successModalShown, newVal => {
    if (!newVal)
        modalShown.value = false
})

function handleSubmit() {
    if (!productData.value) return

    if (!productData.value.dummy_id) {
        const { execute } = use$fetchWithAutoReNew('/dummy', {
            method: 'post',
            body: {
                fake_json: JSON.stringify(formData.fakeDataArray),
                product_id: productData.value.product_id,
                trx_type: trx_type.value,
                period_type: period_type.value,
            },
            onResponse(ctx) {
                const a: TAPIResponse<{ dummy_id: number }> = ctx.response._data
                if (productData.value && a.data) {
                    productData.value.dummy_id = a.data.dummy_id
                    productData.value.fake_json = formData.fakeDataArray
                    successModalShown.value = true
                }
            }
        })
        execute()
    } else {
        const { execute } = use$fetchWithAutoReNew(`/dummy/${productData.value.dummy_id}`, {
            method: 'patch',
            body: {
                fake_json: JSON.stringify(formData.fakeDataArray)
            },
            onResponse() {
                if (productData.value) {
                    productData.value.fake_json = formData.fakeDataArray
                    console.log(productData.value.fake_json)
                    successModalShown.value = true
                }
            }
        })
        execute()
    }
}

// When mounted, parse existing data
onMounted(() => {
    if (productData.value?.fake_json) {
        try {
            formData.fakeDataArray = productData.value.fake_json.slice(0, 10)
        } catch (err) {
            console.warn('Invalid JSON in fake_json', err)
        }
    }
})
</script>

<style scoped>
/* Tambahan opsional untuk tampilan */
</style>
