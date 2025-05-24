<template>
    <NuxtLayout name="main">
        <div class="space-y-4">
            <DashboardDatasetSuppliers />
        </div>
    </NuxtLayout>
</template>
<script lang="ts" setup>
import { DashboardDatasetSuppliers } from '#components';

definePageMeta({
    middleware: 'authentication'
})
</script>