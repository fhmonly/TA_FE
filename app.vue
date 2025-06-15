<template>
  <NuxtPage />
  <Html :class="{ 'nuxt-unload': !isLoaded }" />
  <div class="flex fixed top-0 left-0 right-0 bottom-0 bg-gray-800 items-center justify-center" v-if="!isLoaded"
    style="z-index: 99999;">
    <div>
      <MyLoaderPulseRing />
    </div>
  </div>
  <NuxtUiNotifications />
  <NuxtLoadingIndicator color="red" :throttle="0" />
</template>
<script lang="ts" setup>
const isLoaded = ref(false)
const { authState } = useMyAppState()
const { logoutNow } = useAuthLogout()
useAutoRefreshAccessToken()
watch(authState, (newVal, oldVal) => {
  if (oldVal === 'logged-in' && newVal === 'logged-out') {
    logoutNow()
  }
})
onNuxtReady(async () => {
  isLoaded.value = true;
})
</script>
<style>
.nuxt-unload body,
.nuxt-unload body * {
  overflow: hidden !important;
}
</style>