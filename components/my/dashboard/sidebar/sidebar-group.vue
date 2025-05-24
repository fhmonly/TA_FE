<template>
    <li>
        <button class="nav-link w-full text-left" :class="{ 'router-link-active': isGroupActive }" @click="toggle">
            <span class="nav-icon">
                <NuxtUiIcon :name="item.icon" />
            </span>
            <span class="nav-text flex-1">{{ item.label }}</span>
            <NuxtUiIcon :name="isOpen ? 'i-heroicons-chevron-up-20-solid' : 'i-heroicons-chevron-down-20-solid'" />
        </button>

        <Transition name="fade">
            <ul v-if="isOpen" class="nav-list ml-2">
                <MyDashboardSidebarLink v-for="child in item.children" :key="child.to" v-bind="child" isSub />
            </ul>
        </Transition>
    </li>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    item: Object,
})

const route = useRoute()

const isGroupActive = computed(() =>
    props.item.children?.some(child => route.path.startsWith(child.to))
)

const isOpen = ref(isGroupActive.value)

watch(() => route.path, () => {
    if (isGroupActive.value) isOpen.value = true
})

const toggle = () => {
    isOpen.value = !isOpen.value
};
</script>

<style scoped>
.nav-link {
    @apply flex items-center px-5 py-3 text-sm text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white w-full text-left;
}

.router-link-active {
    @apply bg-gray-200 dark:bg-white/15 text-black dark:text-white font-medium;
}
</style>
