<script setup lang="ts">
import { useConstantStore } from './stores/constants'
import { useDefaultStore } from './stores/defaults'

defineOgImageScreenshot({
  colorScheme: 'dark'
})

const constants = useConstantStore()
const defaults = useDefaultStore()

await constants.getConstants()
await defaults.getDefaults()
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900 h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
