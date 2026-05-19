<script setup lang="ts">
import { useConstantStore } from '~/stores/constants'
import { useDefaultStore } from '~/stores/defaults'

defineOgImageScreenshot({
  colorScheme: 'dark',
  delay: 2000,
})

useHead({
  htmlAttrs: {
    class: 'dark'
  }
})

const constants = useConstantStore()
const defaults = useDefaultStore()

await callOnce('mcbanners:constants', () => constants.getConstants())
await callOnce('mcbanners:defaults', () => defaults.getDefaults())
</script>

<template>
  <UApp>
    <div class="min-h-dvh bg-gray-950 text-white">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>
