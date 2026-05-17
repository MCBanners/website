<script setup lang="ts">
import LogoControls from '~/components/generator/types/LogoControls.vue'

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
    <div class="space-y-3">
      <LogoControls />
    </div>
  </UCard>
</template>
