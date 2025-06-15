<template>
    <NuxtLayout name="main">
        <main class="p-4 md:p-6">
            <h1 class="text-2xl font-bold mb-6">Dashboard Overview</h1>

            <MyUiHomeStatsCard />

            <MyUiHomeChartSession />

            <MyUiHomeLowStock />

            <!-- Prediction Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MyUiHomeLatestPurchasesPredictions />
                <MyUiHomeLatestSalesPredictions />
            </div>
        </main>
    </NuxtLayout>
</template>
<script lang="ts" setup>
import { MyUiHomeLatestPurchasesPredictions, MyUiHomeStatsCard } from '#components';

definePageMeta({
    middleware: 'authentication'
})

// Chart references
const salesChart = ref(null);
const forecastChart = ref(null);

// Dropdown options
const forecastTimeframe = ref('Next Week');
const timeframeOptions = ['This Week', 'This Month', 'This Quarter', 'This Year'];
const forecastOptions = ['Next Week', 'Next Month', 'Next Quarter'];

// Sample data for low stock products
const lowStockProducts = ref([
    { name: 'Laptop Asus ROG', category: 'Electronics', stock: 5, threshold: 10 },
    { name: 'Samsung Galaxy S21', category: 'Smartphones', stock: 3, threshold: 15 },
    { name: 'Logitech MX Master', category: 'Accessories', stock: 2, threshold: 8 },
    { name: 'Sony WH-1000XM4', category: 'Audio', stock: 0, threshold: 5 },
    { name: 'iPad Pro 12.9"', category: 'Tablets', stock: 4, threshold: 10 }
]);

// Sample data for weekly predictions
const weeklyPredictions = ref([
    { name: 'Laptop Asus ROG', category: 'Electronics', predicted: 12, change: -15 },
    { name: 'Samsung Galaxy S21', category: 'Smartphones', predicted: 25, change: 10 },
    { name: 'Logitech MX Master', category: 'Accessories', predicted: 18, change: 5 },
    { name: 'Sony WH-1000XM4', category: 'Audio', predicted: 8, change: -8 }
]);

// Sample data for monthly predictions
const monthlyPredictions = ref([
    { name: 'Laptop Asus ROG', category: 'Electronics', predicted: 45, change: 12 },
    { name: 'Samsung Galaxy S21', category: 'Smartphones', predicted: 120, change: 25 },
    { name: 'Logitech MX Master', category: 'Accessories', predicted: 75, change: -5 },
    { name: 'Sony WH-1000XM4', category: 'Audio', predicted: 30, change: 18 }
]);

onMounted(() => {
    // This would be replaced with actual Chart.js implementation
    // For this example, we're just simulating the charts would be initialized here
    console.log('Charts would be initialized here with Chart.js');

    // In a real implementation, you would have:
    // import Chart from 'chart.js/auto'
    // new Chart(salesChart.value.getContext('2d'), { 
    //   type: 'line',
    //   data: { ... },
    //   options: { ... }
    // })

    // new Chart(forecastChart.value.getContext('2d'), { 
    //   type: 'bar',
    //   data: { ... },
    //   options: { ... }
    // })
});
</script>