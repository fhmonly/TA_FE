<template>
    <li :class="{ 'sub-item': isSub }">
        <NuxtLink :to="to" class="nav-link" active-class="router-link-active" exact>
            <span class="nav-icon">
                <NuxtUiIcon :name="icon" />
            </span>
            <span class="nav-text">{{ label }}</span>
        </NuxtLink>
    </li>
</template>

<script setup>
defineProps({
    to: String,
    icon: String,
    label: String,
    isSub: {
        type: Boolean,
        default: false,
    },
});
</script>
<style scoped>
.nav-link {
    @apply flex items-center px-5 py-3 text-sm text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white w-full text-left;
}

.router-link-active {
    @apply bg-gray-200 dark:bg-white/15 text-black dark:text-white font-medium;
}
</style>
