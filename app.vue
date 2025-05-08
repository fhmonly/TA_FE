<template>
  <NuxtPage />
  <NuxtUiNotifications />
</template>
<script lang="ts" setup>
const { authState } = useMyAppState()
const { logoutNow } = useAuthLogout()
watch(authState, (newVal, oldVal) => {
  if (oldVal === 'logged-in' && newVal === 'logged-out') {
    logoutNow()
  }
})
</script>