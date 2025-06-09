<template>
    <MyPredictionsPredictionCardList :get-all-prediction="getAllPrediction" v-if="viewStyle === 'card'" />
    <!-- <MyPredictionsPredictionTableList :get-all-prediction="getAllPrediction" v-else-if="viewStyle === 'table'" /> -->
</template>
<script setup lang="ts">
const viewStyle = ref<'card' | 'table'>('card')
const getAllPrediction = ref<boolean>(false)
</script>