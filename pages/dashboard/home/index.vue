<template>
    <NuxtLayout name="main">
        <main class="p-4 md:p-6">
            <h1 class="text-2xl font-bold mb-6">Dashboard Overview</h1>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <NuxtUiCard class="bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</h3>
                            <div class="p-2 bg-primary/10 rounded-full">
                                <Icon name="lucide:package" class="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <p class="text-2xl font-bold mt-2">1,248</p>
                        <div class="flex items-center mt-2 text-sm">
                            <span class="text-green-500 flex items-center">
                                <Icon name="lucide:trending-up" class="w-4 h-4 mr-1" />
                                12%
                            </span>
                            <span class="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                        </div>
                    </div>
                </NuxtUiCard>

                <NuxtUiCard class="bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Items
                            </h3>
                            <div class="p-2 bg-orange-100 rounded-full">
                                <Icon name="lucide:alert-triangle" class="w-5 h-5 text-orange-500" />
                            </div>
                        </div>
                        <p class="text-2xl font-bold mt-2">24</p>
                        <div class="flex items-center mt-2 text-sm">
                            <span class="text-red-500 flex items-center">
                                <Icon name="lucide:trending-up" class="w-4 h-4 mr-1" />
                                8%
                            </span>
                            <span class="text-gray-500 dark:text-gray-400 ml-2">from last week</span>
                        </div>
                    </div>
                </NuxtUiCard>

                <NuxtUiCard class="bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Sales</h3>
                            <div class="p-2 bg-green-100 rounded-full">
                                <Icon name="lucide:dollar-sign" class="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                        <p class="text-2xl font-bold mt-2">Rp 125.4M</p>
                        <div class="flex items-center mt-2 text-sm">
                            <span class="text-green-500 flex items-center">
                                <Icon name="lucide:trending-up" class="w-4 h-4 mr-1" />
                                18%
                            </span>
                            <span class="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                        </div>
                    </div>
                </NuxtUiCard>

                <NuxtUiCard class="bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Purchases
                            </h3>
                            <div class="p-2 bg-purple-100 rounded-full">
                                <Icon name="lucide:shopping-cart" class="w-5 h-5 text-purple-500" />
                            </div>
                        </div>
                        <p class="text-2xl font-bold mt-2">Rp 78.2M</p>
                        <div class="flex items-center mt-2 text-sm">
                            <span class="text-red-500 flex items-center">
                                <Icon name="lucide:trending-down" class="w-4 h-4 mr-1" />
                                5%
                            </span>
                            <span class="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                        </div>
                    </div>
                </NuxtUiCard>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

                <NuxtUiCard class="bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-medium">Stock Forecast</h3>
                            <NuxtUiSelect v-model="forecastTimeframe" :options="forecastOptions" size="sm"
                                class="w-32" />
                        </div>
                        <div class="h-80">
                            <canvas ref="forecastChart"></canvas>
                        </div>
                    </div>
                </NuxtUiCard>
            </div>

            <!-- Low Stock Products Table -->
            <NuxtUiCard class="bg-white dark:bg-gray-800 mb-6">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium">Low Stock Products</h3>
                        <NuxtUiButton size="sm" variant="outline">View All</NuxtUiButton>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-200 dark:border-gray-700">
                                    <th
                                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Product</th>
                                    <th
                                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category</th>
                                    <th
                                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Current Stock</th>
                                    <th
                                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Threshold</th>
                                    <th
                                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status</th>
                                    <th
                                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(product, index) in lowStockProducts" :key="index"
                                    class="border-b border-gray-200 dark:border-gray-700">
                                    <td class="px-4 py-3 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div
                                                class="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                                                <Icon name="lucide:package"
                                                    class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <span class="font-medium">{{ product.name }}</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap">{{ product.category }}</td>
                                    <td class="px-4 py-3 whitespace-nowrap">{{ product.stock }}</td>
                                    <td class="px-4 py-3 whitespace-nowrap">{{ product.threshold }}</td>
                                    <td class="px-4 py-3 whitespace-nowrap">
                                        <NuxtUiBadge :color="product.stock === 0 ? 'red' : 'orange'" variant="soft">
                                            {{ product.stock === 0 ? 'Out of Stock' : 'Low Stock' }}
                                        </NuxtUiBadge>
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap">
                                        <NuxtUiButton size="xs">Restock</NuxtUiButton>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </NuxtUiCard>

            <!-- Prediction Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NuxtUiCard class="bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <h3 class="text-lg font-medium mb-4">Next Week Prediction</h3>
                        <div class="space-y-4">
                            <div v-for="(prediction, index) in weeklyPredictions" :key="index"
                                class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div
                                        class="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                                        <Icon name="lucide:package" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ prediction.name }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">{{
                                            prediction.category }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-medium">{{ prediction.predicted }} units</p>
                                    <p class="text-sm"
                                        :class="prediction.change > 0 ? 'text-green-500' : 'text-red-500'">
                                        {{ prediction.change > 0 ? '+' : '' }}{{ prediction.change }}%
                                    </p>
                                </div>
                            </div>
                        </div>
                        <NuxtUiButton variant="outline" class="w-full mt-4">View Detailed Forecast
                        </NuxtUiButton>
                    </div>
                </NuxtUiCard>

                <NuxtUiCard class="bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <h3 class="text-lg font-medium mb-4">Next Month Prediction</h3>
                        <div class="space-y-4">
                            <div v-for="(prediction, index) in monthlyPredictions" :key="index"
                                class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div
                                        class="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                                        <Icon name="lucide:package" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ prediction.name }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">{{
                                            prediction.category }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-medium">{{ prediction.predicted }} units</p>
                                    <p class="text-sm"
                                        :class="prediction.change > 0 ? 'text-green-500' : 'text-red-500'">
                                        {{ prediction.change > 0 ? '+' : '' }}{{ prediction.change }}%
                                    </p>
                                </div>
                            </div>
                        </div>
                        <NuxtUiButton variant="outline" class="w-full mt-4">View Detailed Forecast
                        </NuxtUiButton>
                    </div>
                </NuxtUiCard>
            </div>
        </main>
    </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: 'authentication'
})

// Chart references
const salesChart = ref(null);
const forecastChart = ref(null);

// Dropdown options
const salesTimeframe = ref('This Month');
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