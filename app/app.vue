<script setup lang="ts">
import { useConstantStore } from '~/stores/constants'
import { useDefaultStore } from '~/stores/defaults'

defineOgImageScreenshot({
  colorScheme: 'dark'
})

const constants = useConstantStore()
const defaults = useDefaultStore()

await callOnce('mcbanners:constants', () => constants.getConstants())
await callOnce('mcbanners:defaults', () => defaults.getDefaults())
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>
