<template>
    <div class="w-full h-full min-h-screen">
        <header class="fixed top-0 left-0 right-0 flex gap-2 shadow-md bg-white" ref="header" :class="[
            isLowerThanMd ? 'z-10' : 'z-20'
        ]">
            <NuxtUiButton icon="i-heroicons-bars-3-16-solid" class="aspect-[1/1] w-11 justify-center" variant="ghost"
                color="white" @click="() => asideToggle()" />
            <NuxtImg src="/assets/icons/logo-text.png" width="auto" height="44" format="webp" />
        </header>
        <div>
            <div class="fixed z-10 top-0 left-0 right-0 bottom-0 isolate" :class="[
                isLowerThanMd ? 'z-20' : 'z-10'
            ]" v-show="!isLowerThanMd || (asideState === 'shown' || asideState === 'before-shown')">
                <div class="bg-black/30  absolute top-0 left-0 right-0  bottom-0 z-[1]"
                    v-if="isLowerThanMd && (asideState === 'shown' || asideState === 'before-shown')"
                    @click="() => asideToggle()"></div>
                <aside
                    class="flex-shrink-0 w-full h-full overflow-y-auto overflow-x-hidden z-[2] relative bg-gray-200 bottom-0 flex flex-col"
                    ref="aside" :class="[
                        asideTailwindClass
                    ]">
                    <header class="flex gap-2 sticky top-0 bg-white shadow-md">
                        <NuxtUiButton icon="i-heroicons-bars-3-16-solid" class="aspect-[1/1] w-11 justify-center"
                            variant="ghost" color="white" @click="() => asideToggle()" />
                        <NuxtImg src="/assets/icons/logo-text.png" width="auto" height="44" format="webp" />
                    </header>
                    <div class="w-full">
                        <div class="p-3 flex flex-col ">
                            <NuxtLink class="flex items-center gap-2">
                                <NuxtUiIcon name="i-heroicons-home-20-solid" class="flex-shrink-0 w-6 h-6" />
                                <span>Home</span>
                            </NuxtLink>
                            <NuxtLink>
                                <NuxtUiIcon name="i-heroicons-home-20-solid" />
                                <span>Stock</span>
                            </NuxtLink>
                            <NuxtLink>
                                <NuxtUiIcon name="i-heroicons-home-20-solid" />
                                <span>Inventory</span>
                            </NuxtLink>
                        </div>
                    </div>
                </aside>
            </div>
            <main :style="mainContentSafePadding">
                <div>
                </div>
            </main>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useElementSize, useWindowSize } from '@vueuse/core'

const windowSize = useWindowSize()
const header = ref<HTMLElement>()
const { height: headerHeight } = useElementSize(header)
const aside = ref<HTMLElement>()
const { width: asideWidth } = useElementSize(aside)
type TAsideState = 'before-shown' | 'shown' | 'hidden'
const asideState = ref<TAsideState>('hidden')
watch(asideState, newVal => {
    if (newVal === 'before-shown') {
        setTimeout(() => {
            asideState.value = 'shown'
        }, 50);
    }
})
const isLowerThanMd = computed(() => windowSize.width.value < 768)
watch(isLowerThanMd, newVal => {
    if (newVal) {
        asideState.value = 'hidden'
    } else {
        asideState.value = 'shown'
    }
}, { immediate: true })
const mainContentSafePadding = computed(() => {
    if (isLowerThanMd.value) {
        return `padding-top:${headerHeight.value}px;`
    }
    return `padding-top:${headerHeight.value}px;padding-left:${asideWidth.value}px;`
})
function asideToggle(value?: TAsideState) {
    if (asideState.value === 'before-shown') {
        return
    }
    if (!!value) {
        if (value === 'shown') {
            asideState.value = 'before-shown'
        } else {
            asideState.value = value
        }
    } else {
        if (asideState.value === 'hidden') {
            asideState.value = 'before-shown'
        } else if (asideState.value === 'shown') {
            asideState.value = 'hidden'
        }
    }
}
const asideTailwindClass = computed(() => {
    if (asideState.value === 'shown') {//on
        if (isLowerThanMd.value) {//mobile
            return 'max-w-[360px]'
        } else {//desktop
            return 'max-w-[240px]'
        }
    } else if (asideState.value === 'hidden') {//of
        if (isLowerThanMd.value) {//mobile
            // return '-translate-x-full'
        } else {//desktop
            return 'max-w-16'
        }
    }
})
</script>