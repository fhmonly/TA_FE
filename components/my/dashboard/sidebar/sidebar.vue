<template>
    <aside class="sidebar-container">
        <div>
            <!-- <div class="sidebar-header">
                <h2>Navigation Menu</h2>
            </div> -->

            <ul class="nav-list sidebar-content">
                <template v-for="item in sidebarItems" :key="item.label">
                    <MyDashboardSidebarGroup v-if="item.children" :item="item" />
                    <MyDashboardSidebarLink v-else v-bind="item" />
                </template>
            </ul>
        </div>
    </aside>
</template>

<script setup>
import { sidebarItems } from '~/constants/dashboard-menu'
</script>

<style scoped>
.sidebar-container {
    @apply bg-[#f9fafb] text-gray-800 dark:bg-[#1f2937] dark:text-white h-full flex flex-col rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-auto p-2;
}

.sidebar-header {
    @apply p-5 border-b border-gray-200 dark:border-white/10;
}
</style>