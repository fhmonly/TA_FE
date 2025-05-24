<template>
    <NuxtLayout name="main">
        <DashboardDatasetProducts />
    </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: 'authentication'
})
</script>