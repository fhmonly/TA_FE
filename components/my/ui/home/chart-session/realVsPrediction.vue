<template>
    <NuxtUiCard class="bg-white dark:bg-gray-800">
        <div class="p-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium">Stock Forecast</h3>
                <NuxtUiSelect v-model="forecastTimeframe" :options="forecastOptions" size="sm" class="w-32" />
            </div>
            <div class="h-80">
                <canvas ref="forecastChart"></canvas>
            </div>
        </div>
    </NuxtUiCard>
</template>