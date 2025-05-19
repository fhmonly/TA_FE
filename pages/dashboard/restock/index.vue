<template>
    <NuxtLayout name="main">
        <div class="space-y-6 p-4 md:flex">
            <!-- Scanner -->
            <div class="md:w-1/2 max-w-[360px] h-full">
                <MyBarcodeScanner @scanned="(e) => handleScan(e)" class="sticky top-[84px] " />
            </div>

            <!-- Product List -->
            <div class="space-y-4" ref="productsContainer">
                <div v-for="(item, index) in productsFormState" :key="index"
                    class="p-4 rounded-lg border shadow-sm space-y-3" :class="[
                        productAlreadyExist === item.product_code ?
                            'bg-green-500/50 dark:bg-green-400/50 animate-pulse' : ''
                    ]" @mouseenter="productExistMouseEnterHandle" :id="`id-${item.product_code}`">
                    <div class="flex justify-between items-center">
                        <h3 class="font-semibold text-lg">{{ item.product_name || 'Unnamed Product' }}</h3>
                        <NuxtUiButton color="red" size="sm" @click="deleteModalId = index">
                            Delete
                        </NuxtUiButton>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <!-- Qty Input -->
                        <NuxtUiFormGroup label="Quantity" class="col-span-1">
                            <NuxtUiInput v-model="item.qty" type="number">
                                <template #leading>
                                    <NuxtUiButton color="gray" variant="link" icon="i-heroicons-minus-small-20-solid"
                                        :padded="false" @click="item.qty = Math.max(1, item.qty - 1)" />
                                </template>
                                <template #trailing>
                                    <NuxtUiButton color="gray" variant="link" icon="i-heroicons-plus-small-20-solid"
                                        :padded="false" @click="item.qty += 1" />
                                </template>
                            </NuxtUiInput>
                        </NuxtUiFormGroup>

                        <!-- Price Display -->
                        <div class="col-span-1">
                            <p class="text-sm text-gray-500">Price</p>
                            <p class="font-medium text-gray-800">Rp{{ item.price.toLocaleString() }}</p>
                        </div>

                        <!-- Subtotal -->
                        <div class="col-span-1">
                            <p class="text-sm text-gray-500">Subtotal</p>
                            <p class="font-medium text-gray-800">
                                Rp{{ (item.price * item.qty).toLocaleString() }}
                            </p>
                        </div>
                    </div>
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
    </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'authentication'
})

const productsContainer = ref<HTMLDivElement>()

const productsFormState = ref<
    {
        product_code: string
        product_name: string
        price: number
        qty: number
    }[]
>([])

const newProduct = ref()
const newProductModalShown = computed({
    get() { return !!newProduct.value },
    set(newVal) {
        if (!newVal) newProduct.value = undefined
    }
})

const handleScan = (code: string) => {
    const existing = productsContainer.value?.querySelector(`#id-${code}`)

    if (existing) {
        productAlreadyExist.value = code
        existing.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        })
        return
    }

    const { execute } = use$fetchWithAutoReNew(`/product/${code}`, {
        onResponse(ctx) {
            const data = ctx.response._data.data
            productsFormState.value.push({
                product_code: code,
                product_name: data.product_name,
                price: data.buying_price,
                qty: 1,
            })
        },
        onResponseError(ctx) {
            if (ctx.response.status === 404)
                newProduct.value = code
        }
    })
    execute()
}

const handleDelete = (index: number) => {
    productsFormState.value.splice(index, 1)
}

const deleteModalId = ref()
const deleteModalShown = computed({
    get() { return !!deleteModalId.value },
    set(newVal) {
        if (!newVal) deleteModalId.value = undefined
    }
})

const productAlreadyExist = ref<string>()
const productExistMouseEnterHandle = () => {
    productAlreadyExist.value = undefined
}
</script>
