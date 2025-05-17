<template>
    <NuxtLayout name="main">
    </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: 'authentication'
})
</script>