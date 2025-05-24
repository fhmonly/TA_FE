<template>
    <NuxtLayout name="main">
        <div class="p-4 flex md:flex-row flex-col gap-3">
            <div class="flex gap-4 flex-wrap grow" :style="`margin-bottom:${footerMobileHeight}px;`"
                ref="productsContainer">
                <div v-for="(item, index) in productsFormState" :key="item.product_code + '-' + index"
                    class="w-[250px] shrink-0 grow rounded-lg"
                    :class="{ 'bg-green-500/50 dark:bg-green-400/50 animate-pulse': item.product_code === productAlreadyExist }"
                    :id="`id-${item.product_code}`">
                    <NuxtUiCard :ui="{ background: '' }">
                        <header class="mb-2 pb-2 border-b border-gray-400 flex items-center">
                            <h2 class="truncate grow font-bold">{{ item.product_name }}</h2>
                            <div class="ps-2">
                                <NuxtUiButton icon="i-heroicons-trash-20-solid" color="red" variant="ghost"
                                    @click="deleteModalId = index; deleteModalShown = true" />
                            </div>
                        </header>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="inline-block pe-3 w-fit">Price:</span>
                                <span class="inline-block">{{ numeral(Number(item.price)).format('0,0') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="inline-block pe-3 w-fit">Qty:</span>
                                <span class="inline-block">
                                    <div class="max-w-[150px]">
                                        <NuxtUiInput v-model="item.amount" type="number" min="1" :ui="{
                                            icon: {
                                                leading: { pointer: '', padding: { md: 'px-2' } },
                                                trailing: { pointer: '', padding: { md: 'px-2' } },
                                            },
                                            leading: {
                                                padding: { md: 'ps-12' }
                                            },
                                            trailing: {
                                                padding: { md: 'pe-12' }
                                            },
                                        }" size="md">
                                            <template #leading>
                                                <NuxtUiButton icon="i-heroicons-minus-small-20-solid"
                                                    @click="decrementQty(item)" variant="link" color="gray"
                                                    :disabled="item.amount <= 1" />
                                            </template>
                                            <template #trailing>
                                                <NuxtUiButton icon="i-heroicons-plus-small-20-solid"
                                                    @click="item.amount += 1" variant="link" color="gray" />
                                            </template>
                                        </NuxtUiInput>
                                    </div>
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="inline-block pe-3 w-fit">Sub Total:</span>
                                <span class="inline-block text-green-500 font-semibold">
                                    {{ numeral(calculateSubtotal(item)).format('0,0') }}
                                </span>
                            </div>
                        </div>
                    </NuxtUiCard>
                </div>

                <!-- Empty State -->
                <div v-if="productsFormState.length === 0"
                    class="w-full flex flex-col items-center justify-center py-10 text-gray-500">
                    <div class="text-5xl mb-3">
                        <span class="i-heroicons-shopping-cart"></span>
                    </div>
                    <p>Scan a product to add it to the cart</p>
                </div>
            </div>

            <!-- Scanner - Desktop -->
            <div class="flex justify-center sticky top-0 backdrop-blur-sm z-10" v-if="windowWidth >= 988">
                <div class="md:w-1/2 max-w-[360px] h-full sm:min-w-[300px]">
                    <div class="sticky md:top-[80px]">
                        <NuxtUiCard>
                            <h2 class="text-red-500 font-semibold text-center mb-3">Scan here</h2>
                            <MyBarcodeScanner @scanned="handleScan" />
                            <div class="mb-3">
                                <div class="my-4">
                                    <NuxtUiDivider label="Cart Detail" />
                                </div>
                                <p class="flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <span class="text-green-500">
                                        {{ numeral(priceTotal).format('0,0') }}
                                    </span>
                                </p>
                                <p class="flex justify-between text-sm text-gray-500 mt-1">
                                    <span>Items:</span>
                                    <span>{{ totalItems }}</span>
                                </p>
                            </div>
                            <div class="flex justify-center">
                                <NuxtUiButton label="Save" icon="i-lucide-lab-floppy-disk" block
                                    :disabled="productsFormState.length === 0" @click="saveTransaction" />
                            </div>
                        </NuxtUiCard>
                    </div>
                </div>
            </div>

            <!-- Scanner - Mobile -->
            <div v-else class="fixed bottom-0 right-0 px-3 pb-3 z-20"
                :class="[windowWidth <= 768 ? 'left-0' : 'left-[280px]']" ref="footerMobile">
                <div class="w-full max-w-[360px] mx-auto" v-if="qrShown">
                    <div class="rounded-md overflow-hidden shadow-lg">
                        <MyBarcodeScanner @scanned="handleScan" />
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded-md mt-3 shadow-lg justify-between flex items-center">
                    <div class="flex items-center justify-center gap-3">
                        <NuxtUiButton icon="i-heroicons-qr-code-20-solid" @click="qrShown = !qrShown"
                            :color="qrShown ? 'red' : 'gray'" />
                        <div>
                            <p class="dark:text-white">
                                Total: <span class="text-green-500 font-semibold">{{ numeral(priceTotal).format('0,0')
                                }}</span>
                            </p>
                            <p class="text-sm text-gray-500">Items: {{ totalItems }}</p>
                        </div>
                    </div>
                    <NuxtUiButton label="Save" icon="i-lucide-lab-floppy-disk"
                        :disabled="productsFormState.length === 0" @click="saveTransaction" />
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <NuxtUiModal v-model="deleteModalShown">
            <NuxtUiCard>
                <p>Are you sure you want to delete this product from transaction?</p>
                <template #footer>
                    <NuxtUiButton label="Cancel" variant="ghost" color="gray" @click="deleteModalShown = false" />
                    <NuxtUiButton label="Delete" color="red" @click="handleDelete(deleteModalId)" />
                </template>
            </NuxtUiCard>
        </NuxtUiModal>

        <MyUiCasierNewProduct v-model:product_code="newProduct" @created="actAfterNewProductCreated" />
        <MyUiCasierSetSellingPrice v-model:id-product="productIdWithoutSellingPrice" @updated="e => {
            productsFormState.push({
                amount: 1,
                product_code: e.product_code,
                product_name: e.product_name,
                price: e.selling_price
            })
        }" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
import numeral from 'numeral'
import { useElementSize, useWindowSize } from '@vueuse/core'

definePageMeta({
    middleware: 'authentication'
})

// Window size tracking
const { width: windowWidth } = useWindowSize()

// Mobile footer handling
const qrShown = ref(false)
const footerMobile = ref()
const { height: footerMobileHeight } = useElementSize(footerMobile)

// Product highlighting
const productAlreadyExist = ref<string>()
const highlightTimeout = ref<NodeJS.Timeout | null>(null)

// Product container reference for scrolling
const productsContainer = ref<HTMLDivElement>()

// Product data
const productsFormState = ref<{
    product_code: string
    product_name: string
    price: number
    amount: number
}[]>([])

// Computed properties
const priceTotal = computed(() => {
    return productsFormState.value.reduce((total, product) => {
        return total + calculateSubtotal(product);
    }, 0);
});

const totalItems = computed(() => {
    return productsFormState.value.reduce((total, product) => {
        return total + product.amount;
    }, 0);
});

// Modal state
const newProduct = ref<string>()
const deleteModalId = ref<number | undefined>()
const deleteModalShown = ref(false)

// Methods
function calculateSubtotal(product: { price: number, amount: number }) {
    return product.price * product.amount;
}

function decrementQty(item: { amount: number }) {
    if (item.amount > 1) {
        item.amount -= 1;
    }
}


const productIdWithoutSellingPrice = ref(undefined)

const handleScan = (code: string) => {
    // Skip if code is empty or invalid
    if (!code || code.trim() === '') return;

    // Check if product already exists
    const existingIndex = productsFormState.value.findIndex(p => p.product_code === code);

    if (existingIndex !== -1) {
        // Product exists, increment quantity
        productsFormState.value[existingIndex].amount += 1;

        // Highlight the product
        highlightProduct(code);

        // Scroll to the product
        const existing = productsContainer.value?.querySelector(`#id-${code}`);
        if (existing) {
            existing.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
        return;
    }

    // Product doesn't exist, fetch it
    const { execute } = use$fetchWithAutoReNew(`/product/${code}`, {
        onResponse(ctx) {
            const data = ctx.response._data.data;

            if (!data.selling_price) {
                productIdWithoutSellingPrice.value = data.id
                return
            }

            productsFormState.value.push({
                product_code: code,
                product_name: data.product_name,
                price: data.selling_price,
                amount: 1
            });

            // Scroll to the newly added product after DOM update
            nextTick(() => {
                const element = productsContainer.value?.querySelector(`#id-${code}`);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                }
            });
        },
        onResponseError(ctx) {
            if (ctx.response.status === 404) {
                // Show product creation modal
                newProduct.value = code;
            } else {
                // Show error toast
                const toast = useToast();
                toast.add({
                    title: 'Error',
                    description: 'Failed to fetch product data',
                    color: 'red'
                });
            }
        }
    });
    execute();
}

function highlightProduct(code: string) {
    // Clear any existing highlight timeout
    if (highlightTimeout.value) {
        clearTimeout(highlightTimeout.value);
    }

    // Set the highlighted product
    productAlreadyExist.value = code;

    // Clear the highlight after 2 seconds
    highlightTimeout.value = setTimeout(() => {
        productAlreadyExist.value = undefined;
    }, 2000);
}

const handleDelete = (index: number | undefined) => {
    if (index !== undefined && index >= 0 && index < productsFormState.value.length) {
        productsFormState.value.splice(index, 1);
    }
    deleteModalShown.value = false;
    deleteModalId.value = undefined;
}

function actAfterNewProductCreated(newProduct: {
    id: number,
    product_code: string;
    product_name: string;
    stock: number;
    buying_price: number;
    selling_price: number;
    product_category_id: number;
}) {
    productsFormState.value.push({
        price: newProduct.selling_price,
        product_code: newProduct.product_code,
        product_name: newProduct.product_name,
        amount: 1
    });

    // Highlight the newly added product
    highlightProduct(newProduct.product_code);

    // Scroll to the newly added product
    nextTick(() => {
        const element = productsContainer.value?.querySelector(`#id-${newProduct.product_code}`);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    });
}

function saveTransaction() {
    // Implementation for saving transaction
    // This is a placeholder that you would replace with your actual implementation
    const toast = useToast();
    const { execute } = use$fetchWithAutoReNew('/transactions', {
        method: 'post',
        body: { data: productsFormState.value },
        onResponse() {
            toast.add({
                title: 'Success',
                description: 'Transaction saved successfully',
                color: 'green'
            });
            productsFormState.value = [];
        }
    })
    execute()
}

// Clean up timeout on component unmount
onBeforeUnmount(() => {
    if (highlightTimeout.value) {
        clearTimeout(highlightTimeout.value);
    }
});

// Set QR shown state based on screen size
onMounted(() => {
    qrShown.value = windowWidth.value < 988;
});
</script>