<script setup lang="ts">
import GlobalSettings from '~/components/generator/global/Settings.vue'
import { useDefaultStore } from '~/stores/defaults'

defineProps({
  label: String,
  description: String
})

const isOpen = ref(false)
const defaults = useDefaultStore()

const computedImageUrl = computed(() => defaults.generateBannerUrl())
</script>

<template>
  <UCard class="mb-4 w-full">
    <template #header>
      <h3 class="text-center text-base font-semibold leading-6 text-gray-900 dark:text-white">
        Preview
      </h3>
      <button
        type="button"
        class="mx-auto mt-1 block text-sm text-gray-500 underline dark:text-gray-400"
        @click="isOpen = true"
      >
        Global Settings
      </button>

      <UModal
        v-model:open="isOpen"
        :modal="false"
      >
        <template #content>
          <UCard>
            <template #header>
              <h3 class="text-center text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Global Font Family + Bold Controls
              </h3>
            </template>
            <GlobalSettings />
          </UCard>
        </template>
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
