<template>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <NuxtUiCard class="bg-white dark:bg-gray-800">
            <div class="p-4">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</h3>
                    <div class="p-2 bg-primary/10 rounded-full shrink-0 aspect-[1/1] h-full">
                        <Icon name="lucide:package" class="w-5 h-5 text-primary" />
                    </div>
                </div>
                <p class="text-2xl font-bold mt-2">{{ data?.data?.total_product || 0 }}</p>
            </div>
        </NuxtUiCard>

        <NuxtUiCard class="bg-white dark:bg-gray-800">
            <div class="p-4">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Items</h3>
                    <div class="p-2 bg-orange-100 rounded-full shrink-0 aspect-[1/1] h-full">
                        <Icon name="lucide:alert-triangle" class="w-5 h-5 text-orange-500" />
                    </div>
                </div>

                <p class="text-2xl font-bold mt-2">
                    {{ data?.data?.total_low_stock || 0 }}
                </p>

                <div class="flex items-center mt-2 text-sm">
                    <span
                        :class="`${getLowStockStatusClass(getLowStockPercentage(data?.data?.total_low_stock || 0, data?.data?.total_product || 0))} flex items-center`">
                        <Icon name="lucide:trending-up" class="w-4 h-4 mr-1" />
                        {{ getLowStockPercentage(data?.data?.total_low_stock || 0, data?.data?.total_product || 0) }}%
                    </span>
                    <span class="text-gray-500 dark:text-gray-400 ml-2">
                        from {{ data?.data?.total_product || 0 }} product
                    </span>
                </div>
            </div>
        </NuxtUiCard>


        <NuxtUiCard class="bg-white dark:bg-gray-800">
            <div class="p-4">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Purchases</h3>
                    <div
                        :class="`${getTrendInfo(data?.data?.restock_growth || 0).bgColor} p-2 rounded-full  shrink-0 aspect-[1/1] h-full`">
                        <Icon name="lucide:shopping-cart" class="w-5 h-5 text-purple-500" />
                    </div>
                </div>
                <p class="text-2xl font-bold mt-2">
                    {{ numeral(data?.data?.total_monthly_restock).format('0,0') }}
                </p>
                <div class="flex items-center mt-2 text-sm">
                    <span :class="`${getTrendInfo(data?.data?.restock_growth || 0).color} flex items-center `">
                        <Icon :name="getTrendInfo(data?.data?.restock_growth || 0).icon" class="w-4 h-4 mr-1" />
                        {{ getTrendInfo(data?.data?.restock_growth || 0).label }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                </div>
            </div>
        </NuxtUiCard>


        <NuxtUiCard class="bg-white dark:bg-gray-800">
            <div class="p-4">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Sales</h3>
                    <div
                        :class="`${getTrendInfo(data?.data?.salesGrowth || 0).bgColor} p-2 rounded-full  shrink-0 aspect-[1/1] h-full`">
                        <Icon name="lucide:dollar-sign" class="w-5 h-5 text-green-500" />
                    </div>
                </div>
                <p class="text-2xl font-bold mt-2">
                    {{ numeral(data?.data?.total_monthly_sales).format('0,0') }}
                </p>
                <div class="flex items-center mt-2 text-sm">
                    <span :class="`${getTrendInfo(data?.data?.salesGrowth || 0).color} flex items-center`">
                        <Icon :name="getTrendInfo(data?.data?.salesGrowth || 0).icon" class="w-4 h-4 mr-1" />
                        {{ getTrendInfo(data?.data?.salesGrowth || 0).label }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                </div>
            </div>
        </NuxtUiCard>

    </div>
</template>
<script lang="ts" setup>
import numeral from 'numeral';
import type { TAPIResponse } from '~/types/api-response/basicResponse';
import type { IDashboardStatsResponse } from '~/types/api-response/dashboard';

const {
    data
} = useFetchWithAutoReNew<TAPIResponse<IDashboardStatsResponse>>('/dashboard')

function getTrendInfo(value: number) {
    if (value > 0) {
        return {
            color: 'text-green-500',
            bgColor: 'bg-green-100',
            icon: 'lucide:trending-up',
            label: `${value.toFixed(2)}%`,
        };
    } else if (value < 0) {
        return {
            color: 'text-red-500',
            bgColor: 'bg-red-100',
            icon: 'lucide:trending-down',
            label: `${value.toFixed(2)}%`,
        };
    } else {
        return {
            color: 'text-gray-500',
            bgColor: 'bg-gray-100',
            icon: 'lucide:minus',
            label: '0%',
        };
    }
}

function getLowStockPercentage(low: number, total: number): number {
    if (!total || total === 0) return 0;
    return parseFloat(((low / total) * 100).toFixed(2));
}

function getLowStockStatusClass(percentage: number): string {
    if (percentage > 50) return 'text-red-500';       // parah
    if (percentage > 20) return 'text-orange-500';    // waspada
    return 'text-yellow-500';                         // aman tapi merapat
}


</script>