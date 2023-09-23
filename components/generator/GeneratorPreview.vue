<script setup lang="ts">
import { useDefaultStore } from '~/stores/defaults'
import GlobalSettings from '~/components/generator/global/Settings.vue'

defineProps({
  label: String,
  description: String
})

const isOpen = ref(false)

const defaults = useDefaultStore()

const computedImageUrl: ComputedRef<string> = computed(() => {
  return defaults.generateBannerUrl()
})
</script>

<template>
  <UCard class="w-full mb-4">
    <template #header>
      <h3
        class="text-base font-semibold leading-6 text-gray-900 dark:text-white text-center"
      >
        Preview
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 text-center underline" @click="isOpen = true">
        Global Settings
      </p>
      <UModal v-model="isOpen" :overlay="false">
        <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white text-center"
            >
              Global Font Family + Bold Controls
            </h3>
          </template>
          <GlobalSettings />
        </UCard>
      </UModal>
    </template>
    <div class="flex items-center justify-center">
      <img
        :alt="label"
        :src="computedImageUrl"
        width="300"
        height="100"
        class="rounded-lg"
      >
    </div>
  </UCard>
</template>
