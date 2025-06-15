<template>
    <Line :data="chartData" :options="{
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Grafik Penjualan'
            }
        }
    }" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
} from 'chart.js'

// Register Chart.js modules
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
)

// Props (optional)
const props = defineProps<{
    labels: string[]
    saleValues: number[]
    purchaseValues: number[]
}>()

const chartData = computed(() => ({
    labels: props.labels,
    datasets: [
        {
            label: 'Sale',
            data: props.saleValues,
            fill: false,
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            tension: 0.4
        },
        {
            label: 'Purchase',
            data: props.purchaseValues,
            fill: false,
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            tension: 0.4
        }
    ]
}))

</script>
