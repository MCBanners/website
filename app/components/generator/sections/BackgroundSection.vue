<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConstantStore } from '~/stores/constants'
import { useDefaultStore } from '~/stores/defaults'
import { useStyleStore } from '~/stores/style'
import type { BackgroundMode } from '~/types/style'
import ColorInput from '~/components/generator/types/ColorInput.vue'

defineProps({
  label: String,
  description: String
})

const defaults = useDefaultStore()
const constants = useConstantStore()
const style = useStyleStore()

const { template } = storeToRefs(defaults)
const { backgroundMode, backgroundColor, errors } = storeToRefs(style)

const templates = constants.templates

const backgroundModeOptions: Array<{ label: string, value: BackgroundMode }> = [
  { label: 'Template', value: 'template' },
  { label: 'Solid Color', value: 'solid' }
]

function onColorBlur () {
  style.flushPreview()
}

function onColorEnter () {
  style.flushPreview()
}
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
    <div class="space-y-4">
      <UFormField label="Background Mode" name="backgroundMode">
        <div role="radiogroup" data-testid="background-mode-controls">
          <UButtonGroup>
            <UButton
              v-for="option in backgroundModeOptions"
              :key="option.value"
              size="xs"
              :variant="backgroundMode === option.value ? 'solid' : 'outline'"
              :aria-pressed="backgroundMode === option.value"
              :data-testid="`background-mode-${option.value}`"
              @click="style.setBackgroundMode(option.value)"
            >
              {{ option.label }}
            </UButton>
          </UButtonGroup>
        </div>
      </UFormField>

      <UFormField
        v-if="backgroundMode === 'template'"
        label="Template"
        name="template"
        class="flex justify-center space-x-2"
      >
        <USelect
          v-model="template"
          :items="templates"
          label-key="value"
          value-key="value"
        />
      </UFormField>

      <div v-else class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Solid Color
          </p>
          <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-arrow-path"
            data-testid="reset-background-button"
            @click="style.resetBackground()"
          >
            Reset
          </UButton>
        </div>
        <ColorInput
          :model-value="backgroundColor"
          label="Color"
          name="backgroundColor"
          tooltip="Use a solid background color instead of the selected template."
          :error="errors.backgroundColor"
          data-testid="background-color-section"
          @update:model-value="style.setBackgroundColor($event)"
          @blur="onColorBlur"
          @enter="onColorEnter"
        />
      </div>
    </div>
  </UCard>
</template>
