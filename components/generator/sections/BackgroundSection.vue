<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConstantStore } from '~/stores/constants'
import { useDefaultStore } from '~/stores/defaults'

defineProps({
  label: String,
  description: String
})

const defaults = useDefaultStore()
const constants = useConstantStore()

const { template } = storeToRefs(defaults)

const templates = constants.templates
</script>

<script lang="ts">
export default {
  name: 'BackgroundSection'
}
</script>

<template>
  <UCard class="h-full">
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
    <UFormGroup label="Template" name="template" class="flex justify-center space-x-2">
      <USelect
        v-model="template"
        :options="templates"
        option-attribute="value"
      />
    </UFormGroup>
  </UCard>
</template>
