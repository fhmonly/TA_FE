<template>
    <NuxtLayout name="main">
        <NuxtUiTabs :items="items" class="w-full">
            <template #purchase>
                <MyDummyPurchaseList />
            </template>
            <template #sales>
                <MyDummySaleList />
            </template>
        </NuxtUiTabs>
    </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: 'authentication'
})
import type { TabItem } from '#ui/types'
const items = ref<TabItem[]>([
    {
        label: 'Dummy Purchases',
        icon: 'i-heroicons:shopping-cart-20-solid',
        slot: 'purchase'
    },
    {
        label: 'Dummy Sales',
        icon: 'i-heroicons:clipboard-document-list',
        slot: 'sales'
    }
])
</script>