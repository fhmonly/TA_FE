<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStoreSalesCart } from '~/stores/cart/sales'

const modalShown = defineModel<boolean>('shown', { required: true })
const cartStore = useStoreSalesCart()
const { cart, totalPrice, totalItem } = storeToRefs(cartStore)
const isUploading = ref(false)

async function uploadTrx() {
    isUploading.value = true
    await use$fetchWithAutoReNew('/transactions', {
        method: 'post',
        body: { data: cartStore.cart },
        onResponse() {
            modalShown.value = false
            cartStore.clearCart()
        }
    }).execute()
    isUploading.value = false
}

// Get current date and time
const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
})
const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
})
</script>

<template>
    <NuxtUiModal v-model="modalShown" :prevent-close="true">
        <div class="bg-white relative">
            <div class="p-3 flex">
                <NuxtUiButton label="Back" @click="modalShown = false" color="red"
                    icon="i-heroicons:chevron-left-20-solid" />
            </div>

            <div class="relative bg-gradient-to-b from-white to-gray-50 rounded-lg">
                <div class="p-6 space-y-6">
                    <!-- Header -->
                    <div class="text-center space-y-3">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                            <NuxtUiIcon name="i-heroicons-document-text" class="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">Nota Transaksi</h2>
                            <p class="text-green-600 font-medium">Terima kasih telah berbelanja!</p>
                        </div>
                        <div class="text-xs text-gray-500 space-y-1">
                            <p>{{ currentDate }}</p>
                            <p>{{ currentTime }}</p>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="border-t-2 border-dashed border-gray-300"></div>

                    <!-- Items List -->
                    <div class="space-y-3">
                        <div class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                            <NuxtUiIcon name="i-heroicons-shopping-bag" class="w-4 h-4" />
                            <span>Detail Pembelian</span>
                        </div>

                        <div class="space-y-3">
                            <div v-for="(item, index) in cart" :key="item.id"
                                class="flex justify-between items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <div class="flex-1">
                                    <p class="font-semibold text-gray-800">{{ item.product_name }}</p>
                                    <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                        <span
                                            class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                            {{ item.amount }} pcs
                                        </span>
                                        <span>@ Rp{{ item.price.toLocaleString('id-ID') }}</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-gray-800">
                                        Rp{{ (item.price * item.amount).toLocaleString('id-ID') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="border-t-2 border-dashed border-gray-300"></div>

                    <!-- Summary -->
                    <div class="space-y-3">
                        <div class="flex justify-between items-center text-sm text-gray-600">
                            <span>Total Item</span>
                            <span class="font-semibold">{{ totalItem }} pcs</span>
                        </div>

                        <div
                            class="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                            <span class="text-lg font-bold text-gray-800">Total Bayar</span>
                            <span class="text-2xl font-bold text-green-600">
                                Rp{{ totalPrice.toLocaleString('id-ID') }}
                            </span>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="border-t-2 border-dashed border-gray-300"></div>

                    <!-- Actions -->
                    <div class="flex justify-center">
                        <NuxtUiButton @click="uploadTrx" :loading="isUploading" :disabled="isUploading" size="lg"
                            class="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                            <template v-if="isUploading">
                                <NuxtUiIcon name="i-heroicons-arrow-path" class="w-5 h-5 mr-2 animate-spin" />
                                Menyimpan...
                            </template>
                            <template v-else>
                                <NuxtUiIcon name="i-heroicons-check" class="w-5 h-5 mr-2" />
                                Simpan Transaksi
                            </template>
                        </NuxtUiButton>
                    </div>

                    <!-- Footer -->
                    <div class="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
                        <p>Simpan nota ini sebagai bukti transaksi</p>
                        <p class="mt-1">🙏 Terima kasih atas kepercayaan Anda</p>
                    </div>
                </div>
            </div>
        </div>
    </NuxtUiModal>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}

/* Receipt paper texture effect */
.receipt-paper {
    background-image:
        linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
        linear-gradient(#eee .1em, transparent .1em);
    background-size: 100% 1.2em;
}
</style>