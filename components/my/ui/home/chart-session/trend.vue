<template>
    <NuxtUiCard class="bg-white dark:bg-gray-800">
        <div class="p-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium">Sales & Purchases Trend</h3>
                <NuxtUiSelect v-model="salesTimeframe" :options="timeframeOptions" size="sm" class="w-32" />
            </div>
            <div class="h-80">
                <canvas ref="salesChart"></canvas>
            </div>
        </div>
    </NuxtUiCard>
</template>
<script lang="ts" setup>
const salesTimeframe = ref('This Month');
const timeframeOptions = ['This Week', 'This Month', 'This Quarter', 'This Year'];
</script>