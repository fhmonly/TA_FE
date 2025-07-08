<template>
    <div class="grow" :id="`id-${item.product_code}`">
        <div
            class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
            <!-- Header with gradient background -->
            <header class="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white relative overflow-hidden">
                <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                </div>
                <div class="flex items-center justify-between relative z-10">
                    <div class="flex items-center space-x-2 flex-1 min-w-0">
                        <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        <h2 class="font-bold text-lg truncate">{{ item.product_name }}</h2>
                    </div>
                    <button @click="emit('remove-item')"
                        class="ml-3 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200 group/btn">
                        <svg class="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </header>

            <!-- Content -->
            <div class="p-5 space-y-4">
                <!-- Price Section -->
                <div class="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-600">Price</span>
                    </div>
                    <span class="text-lg font-bold text-gray-900">
                        Rp {{ numeral(Number(item.price)).format('0,0') }}
                    </span>
                </div>

                <!-- Quantity Section -->
                <div class="space-y-2 bg-gray-50 rounded-lg p-3 ">
                    <div class="flex items-center space-x-2 mb-2">
                        <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-600">Quantity</span>
                    </div>

                    <div class="flex items-center justify-center space-x-3 bg-gray-50 rounded-lg p-2">
                        <button @click="decrementQty(item)" :disabled="item.amount <= 1"
                            class="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>

                        <input v-model="item.amount" type="number" min="1"
                            class="w-16 text-center bg-transparent border-none outline-none font-semibold text-lg text-gray-900" />

                        <button @click="item.amount += 1"
                            class="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Subtotal Section -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center space-x-2">
                            <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <span class="font-semibold text-gray-700">Subtotal</span>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-green-600">
                                Rp {{ numeral(calculateSubtotal(item)).format('0,0') }}
                            </div>
                            <div class="text-xs text-green-500 font-medium">
                                {{ item.amount }} × Rp {{ numeral(Number(item.price)).format('0,0') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import numeral from 'numeral';

const item = defineModel<{
    id: number;
    product_code: string;
    product_name: string;
    price: number;
    amount: number;
}>('item-data', {
    required: true
})
const emit = defineEmits(['remove-item'])

function decrementQty(item: { amount: number }) {
    if (item.amount > 1) {
        item.amount -= 1;
    }
}

function calculateSubtotal(product: { price: number, amount: number }) {
    return product.price * product.amount;
}

const weeklyForecastConfig = ref<{
    product_id: number
    source_type: 'sales' | 'purchases'
    prediction_period: 'weekly' | 'monthly'
    auto_source_type: boolean
}>({
    prediction_period: 'weekly',
    product_id: item.value.id,
    source_type: 'sales',
    auto_source_type: true
})
const monthlyForecastConfig = ref<{
    product_id: number
    source_type: 'sales' | 'purchases'
    prediction_period: 'weekly' | 'monthly'
    auto_source_type: boolean
}>({
    prediction_period: 'monthly',
    product_id: item.value.id,
    source_type: 'sales',
    auto_source_type: true
})
</script>