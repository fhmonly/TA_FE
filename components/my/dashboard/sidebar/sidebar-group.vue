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
