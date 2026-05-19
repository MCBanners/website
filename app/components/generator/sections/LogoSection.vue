<script setup lang="ts">
import LogoControls from '~/components/generator/types/LogoControls.vue'
import GlobalSettings from '~/components/generator/global/Settings.vue'

defineProps({
  label: String,
  description: String
})
</script>

<script lang="ts">
export default {
  name: 'LogoSection'
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="text-center">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
        >
          {{ label }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
    </template>
    <div class="space-y-5">
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Typography
        </p>
        <GlobalSettings />
      </div>
      <USeparator />
      <LogoControls />
    </div>
  </UCard>
</template>
