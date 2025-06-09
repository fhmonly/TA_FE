<template>
    <div class="space-y-4">
        <!-- Main Alert -->
        <NuxtUiAlert icon="i-heroicons-check-circle" color="green" variant="soft" title="All Products Well Stocked"
            description="Great news! All your products are currently in good stock condition. No immediate restocking required."
            :ui="{
                base: 'border-l-4',
                background: 'bg-green-50 dark:bg-green-900/10',
                border: 'border-green-400 dark:border-green-400',
                ring: 'ring-1 ring-green-200 dark:ring-green-800',
                rounded: 'rounded-lg',
                padding: 'p-4',
                gap: 'gap-3',
                icon: {
                    base: 'flex-shrink-0 w-5 h-5',
                    color: 'text-green-600 dark:text-green-400'
                },
                title: 'text-green-800 dark:text-green-200 font-semibold text-sm',
                description: 'text-green-700 dark:text-green-300 text-sm mt-1'
            }" />

        <!-- Detailed Status Alert -->
        <NuxtUiAlert icon="i-heroicons-chart-bar-square" color="blue" variant="outline" :ui="{
            base: 'border-l-4',
            background: 'bg-blue-50 dark:bg-blue-900/10',
            border: 'border-blue-400 dark:border-blue-400',
            ring: 'ring-1 ring-blue-200 dark:ring-blue-800',
            rounded: 'rounded-lg',
            padding: 'p-4',
            gap: 'gap-3',
            icon: {
                base: 'flex-shrink-0 w-5 h-5',
                color: 'text-blue-600 dark:text-blue-400'
            }
        }">
            <template #title>
                <div class="flex items-center justify-between w-full">
                    <span class="text-blue-800 dark:text-blue-200 font-semibold text-sm">Inventory Status
                        Overview</span>
                    <span
                        class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        {{ }} Products
                    </span>
                </div>
            </template>

            <template #description>
                <div class="space-y-3">
                    <p class="text-blue-700 dark:text-blue-300 text-sm">
                        Your inventory is in excellent condition with all {{ }} products maintaining
                        adequate stock levels.
                    </p>
                </div>
            </template>
        </NuxtUiAlert>

        <!-- Action Suggestions Alert -->
        <NuxtUiAlert icon="i-heroicons-light-bulb" color="amber" variant="soft" :ui="{
            base: 'border-l-4',
            background: 'bg-amber-50 dark:bg-amber-900/10',
            border: 'border-amber-400 dark:border-amber-400',
            ring: 'ring-1 ring-amber-200 dark:ring-amber-800',
            rounded: 'rounded-lg',
            padding: 'p-4',
            gap: 'gap-3',
            icon: {
                base: 'flex-shrink-0 w-5 h-5',
                color: 'text-amber-600 dark:text-amber-400'
            }
        }">
            <template #title>
                <span class="text-amber-800 dark:text-amber-200 font-semibold text-sm">Recommendations</span>
            </template>

            <template #description>
                <div class="text-amber-700 dark:text-amber-300 text-sm space-y-2">
                    <p>Since all products are well-stocked, consider these optimization strategies:</p>
                    <ul class="list-disc list-inside space-y-1 ml-2">
                        <li>Monitor sales trends to predict future demand</li>
                        <li>Review slow-moving inventory for potential promotions</li>
                        <li>Plan ahead for seasonal demand fluctuations</li>
                        <li>Consider bulk purchasing opportunities for cost savings</li>
                    </ul>
                </div>
            </template>
        </NuxtUiAlert>
    </div>
</template>