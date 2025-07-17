<template>
    <div class="w-full h-full">
        <header class="fixed top-0 left-0 right-0 z-50" ref="header">
            <div
                class="m-3 md:mx-10 p-2 md:px-6 flex gap-2 shadow-md rounded-r-full rounded-l-full items-center bg-[#f9fafb]/70 text-gray-800 dark:bg-[#1f2937]/70 backdrop-blur-sm dark:text-white">
                <NuxtUiButton icon="i-heroicons-bars-3-16-solid" class="aspect-[1/1] w-11 justify-center ms-3"
                    variant="ghost" color="white" @click="() => sidebarShownToggle()" />
                <NuxtLink to='/'>
                    <NuxtImg src="/assets/icons/logo-text.png" width="auto" height="32" format="webp"
                        class="hidden tablet:block h-8" />
                    <NuxtImg src="/assets/icons/logo.png" width="auto" height="32" format="webp"
                        class="block tablet:hidden" />
                </NuxtLink>
                <div class="ms-auto">
                    <NuxtUiDropdown :items="items" :popper="{ offsetDistance: 0, placement: 'bottom-end' }" :ui="{
                        container: 'mt-[5px!important]'
                    }">
                        <NuxtUiButton color="white" label="Account" trailing-icon="i-heroicons-chevron-down-20-solid"
                            truncate :ui="{
                                rounded: 'rounded-full'
                            }">
                            <template #leading>
                                <NuxtUiAvatar alt="Account" />
                            </template>
                        </NuxtUiButton>
                    </NuxtUiDropdown>
                </div>
            </div>
        </header>
        <div>
            <Transition name="fade">
                <div class="fixed top-0 left-0 bottom-0 w-full max-w-[280px] flex flex-col z-40" ref="desktopMenu"
                    v-show="sidebarShownSmart">
                    <div ref="desktopMenu" :style="`padding-top:${headerHeight}px;`"
                        class="p-3 md:px-10 md:pe-3 h-full relative bottom-0">
                        <MyDashboardSidebar />
                    </div>
                </div>
            </Transition>
            <main :style="mainContentContainerStyle" class="px-4 tablet:px-6 md:px-4 md:pe-10 mb-4">
                <div>
                    <slot></slot>
                </div>
            </main>
        </div>
        <NuxtUiModal v-model="logoutConfirmation">
            <NuxtUiCard class="p-6">
                <div class="text-center space-y-2">
                    <h2 class="text-lg font-semibold text-gray-800">Confirm Logout</h2>
                    <p class="text-sm text-gray-600">Are you sure you want to log out of your account?</p>
                </div>
                <div class="flex justify-center gap-2 mt-10">
                    <NuxtUiButton label="Cancel" variant="ghost" @click="logoutConfirmation = false"
                        :disabled="logoutStatus === 'pending'" />
                    <NuxtUiButton color="red" label="Log out" @click="logoutNow()"
                        :loading="logoutStatus === 'pending'" />
                </div>
            </NuxtUiCard>
        </NuxtUiModal>

    </div>
</template>
<script lang="ts" setup>
import type { DropdownItem } from '#ui/types'
import { useElementSize, useWindowSize } from '@vueuse/core';

const windowSize = useWindowSize()
const header = ref<HTMLElement>()
const { height: headerHeight } = useElementSize(header)
const desktopMenu = ref<HTMLDivElement>()
const { width: desktopMenuWidth } = useElementSize(desktopMenu)
const mainContentContainerStyle = computed(() => {
    if (windowSize.width.value >= 768) {
        return `margin-top:${headerHeight.value}px;margin-left:${desktopMenuWidth.value}px;`
    } else {
        return `margin-top:${headerHeight.value}px;`
    }
})
const sidebarShown = ref(false)
const sidebarShownSmart = computed(() => {
    if (windowSize.width.value >= 768) {
        return true
    } else {
        return sidebarShown.value
    }
})
function sidebarShownToggle() {
    if (windowSize.width.value >= 768) {
        return
    }
    sidebarShown.value = !sidebarShown.value
}

const logoutConfirmation = ref(false)

const {
    logoutNow,
    logoutStatus
} = useAuthLogout()
const items: DropdownItem[][] = [
    [{
        label: 'Dashboard',
        icon: 'i-lucide:chart-column',
        to: '/dashboard/home'
    }],
    [{
        label: 'Logout',
        click() { logoutConfirmation.value = true },
        icon: 'i-heroicons-arrow-right-on-rectangle-20-solid'
    }]
]
</script>