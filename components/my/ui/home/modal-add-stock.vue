<template>
    <NuxtUiModal v-model="modalShown" :ui="{ width: 'sm:max-w-mobile' }">
        <NuxtUiCard :ui="{
            base: 'overflow-hidden',
            background: 'bg-white dark:bg-gray-900',
            divide: '',
            ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
            rounded: 'rounded-xl',
            shadow: 'shadow-xl'
        }">
            <!-- Header -->
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-11 h-11 flex justify-center items-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Icon name="i-heroicons-cube" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Stock</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Update inventory levels</p>
                        </div>
                    </div>
                    <NuxtUiButton icon="i-heroicons-x-mark" variant="ghost" color="gray" size="sm"
                        @click="modalShown = false" />
                </div>
            </template>

            <div class="space-y-6">
                <!-- Product Info -->
                <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-3">
                        <div
                            class="bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0 w-11 h-11 flex items-center justify-center">
                            <Icon name="i-heroicons-tag" class="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Product</p>
                            <p class="text-lg font-semibold text-gray-900 dark:text-white">
                                {{ data?.data?.product_name || 'Loading...' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Amount Input -->
                <NuxtUiFormGroup label="Quantity" class="space-y-2">
                    <div class="relative">
                        <NuxtUiInput v-model="formState.amount" type="number" min="1" size="lg" :ui="{
                            base: 'text-center text-lg font-semibold',
                            icon: {
                                leading: { pointer: '', padding: { lg: 'px-3' } },
                                trailing: { pointer: '', padding: { lg: 'px-3' } },
                            },
                            leading: { padding: { lg: 'ps-14' } },
                            trailing: { padding: { lg: 'pe-14' } },
                        }" placeholder="0">
                            <template #leading>
                                <NuxtUiButton icon="i-heroicons-minus" @click="() => {
                                    if (formState.amount! > 1) {
                                        formState.amount! -= 1
                                    }
                                }" variant="soft" color="red" size="sm" :disabled="formState.amount! <= 1"
                                    class="rounded-full" />
                            </template>
                            <template #trailing>
                                <NuxtUiButton icon="i-heroicons-plus" @click="formState.amount! += 1" variant="soft"
                                    color="green" size="sm" class="rounded-full" />
                            </template>
                        </NuxtUiInput>
                    </div>
                </NuxtUiFormGroup>

                <MyUiHomeWeeklyRecomendation :product-id="data.data.id" v-if="data?.data?.id"
                    @suggested-value="e => formState.amount = e" />
                <MyUiHomeMonthlyRecomendation :product-id="data.data.id" v-if="data?.data?.id"
                    @suggested-value="e => formState.amount = e" />

                <!-- Price Info -->
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Icon name="i-heroicons-currency-dollar" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span class="text-sm font-medium text-blue-900 dark:text-blue-100">Unit Price</span>
                        </div>
                        <span class="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {{ numeral(+formState.price!).format('0,0') }}
                        </span>
                    </div>
                </div>

                <!-- Total Calculation -->
                <div
                    class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Icon name="i-heroicons-calculator" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span class="text-sm font-medium text-purple-900 dark:text-purple-100">Total Amount</span>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                {{ numeral(Number(formState.price) * Number(formState.amount)).format('0,0') }}
                            </div>
                            <div class="text-xs text-purple-600 dark:text-purple-400">
                                {{ formState.amount }} × {{ numeral(+formState!.price!).format('0,0') }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 pt-2">
                    <NuxtUiButton variant="outline" color="gray" size="lg" class="flex-1" @click="modalShown = false"
                        block>
                        Cancel
                    </NuxtUiButton>
                    <NuxtUiButton @click="() => execute()" size="lg" class="flex-1"
                        :disabled="statusProduct === 'pending'" :loading="statusPost === 'pending'"
                        icon="i-heroicons-plus-circle" block>
                        Add to Stock
                    </NuxtUiButton>
                </div>
            </div>
        </NuxtUiCard>
        <NuxtUiModal :prevent-close="true" v-model="successMsgShown" :ui="{ width: 'sm:max-w-mobile' }">
            <NuxtUiCard :ui="{
                base: 'overflow-hidden',
                background: 'bg-white dark:bg-gray-900',
                divide: '',
                ring: 'ring-1 ring-green-200 dark:ring-green-800',
                rounded: 'rounded-xl',
                shadow: 'shadow-xl'
            }">
                <!-- Success Header -->
                <template #header>
                    <div class="text-center py-2">
                        <div
                            class="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Icon name="i-heroicons-check-circle" class="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Success!</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Stock has been added successfully</p>
                    </div>
                </template>

                <div class="space-y-6 px-2">
                    <!-- Product Added Info -->
                    <div
                        class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex">
                                <Icon name="i-heroicons-cube" class="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-green-700 dark:text-green-300">Product Added</p>
                                <p class="text-lg font-bold text-green-900 dark:text-green-100">
                                    {{ formState.product_name }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Price Total -->
                    <div
                        class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <Icon name="i-heroicons-banknotes" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Price</span>
                            </div>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                                    {{ numeral(Number(formState.price)).format('0,0') }}
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">Per Unit</div>
                            </div>
                        </div>
                    </div>

                    <!-- Summary Stats -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formState.amount }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">Units Added</div>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                            <div class="text-xl font-bold text-blue-900 dark:text-blue-100">
                                {{ numeral(Number(formState.price) * Number(formState.amount)).format('0,0') }}
                            </div>
                            <div class="text-xs text-blue-600 dark:text-blue-400">
                                {{ formState.amount }} × {{ numeral(Number(formState.price)).format('0,0') }}
                            </div>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="flex justify-center pt-2">
                        <NuxtUiButton label="Perfect!" size="lg" color="green" icon="i-heroicons-check"
                            class="px-8 font-semibold" @click="successMsgShown = false" />
                    </div>
                </div>
            </NuxtUiCard>
        </NuxtUiModal>
    </NuxtUiModal>
</template>
<script lang="ts" setup>
import type { TAPIResponse } from '~/types/api-response/basicResponse'
import type { TProductResponse } from '~/types/api-response/product'
import numeral from 'numeral'
const id = defineModel('product_id')
const emit = defineEmits(['updated'])
const modalShown = computed({
    set(newVal) {
        if (!newVal) {
            id.value = undefined
        }
    },
    get() { return !!id.value }
})

const formState = reactive<Partial<{
    product_code: string,
    product_name: string,
    price: number,
    amount: number,
}>>({
    product_code: undefined,
    product_name: undefined,
    price: undefined,
    amount: 1,
})

const { data, status: statusProduct } = useFetchWithAutoReNew<TAPIResponse<TProductResponse>>(computed(() => `/product-get-by-id/${id.value}`))

watch(statusProduct, newVal => {
    if (newVal === 'success') {
        const d = data.value?.data
        formState.product_code = d?.product_code
        formState.product_name = d?.product_name
        formState.price = d?.buying_price
    } else if (newVal === 'error') {
        id.value = undefined
    }
})

const successMsgShown = ref<boolean>(false)
watch(successMsgShown, (newVal, oldVal) => {
    if (!newVal && oldVal) {
        id.value = undefined
    }
})

const { execute, status: statusPost } = use$fetchWithAutoReNew('/restocks', {
    body: { data: [formState] },
    method: 'post',
    onResponse(ctx) {
        emit('updated')
        successMsgShown.value = true
    }
})
</script>