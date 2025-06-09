<template>
    <div class="p-4">
        <h2 class="text-2xl font-bold mb-4">Peramalan Stok Produk</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <MyPredictionsPredictionCard v-for="(product, key) in storeFileRecord.products" :product :key />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useStoreFileRecord } from '~/stores/file/record';
const storeFileRecord = useStoreFileRecord()
</script>