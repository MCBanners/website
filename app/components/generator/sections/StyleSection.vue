<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStyleStore, THEME_PRESETS } from '~/stores/style'
import type { ShadowPreset, OutputFormat } from '~/types/style'
import ColorInput from '~/components/generator/types/ColorInput.vue'

defineProps<{
  label?: string
  description?: string
}>()

const style = useStyleStore()
  const {
  textPrimaryColor,
  textSecondaryColor,
  textAccentColor,
  shadowPreset,
  outputFormat,
  activeThemePreset,
  errors
} = storeToRefs(style)

const shadowOptions = [
  { label: 'None', value: 'none' },
  { label: 'Soft', value: 'soft' },
  { label: 'Strong', value: 'strong' }
]

const formatOptions = [
  { label: 'PNG', value: 'png' },
  { label: 'JPG', value: 'jpg' }
]

const shadowModel = computed({
  get: () => shadowPreset.value,
  set: (val: ShadowPreset) => style.setShadowPreset(val)
})

const formatModel = computed({
  get: () => outputFormat.value,
  set: (val: OutputFormat) => { outputFormat.value = val }
})

function onColorBlur () {
  style.flushPreview()
}

function onColorEnter () {
  style.flushPreview()
}
</script>

<script lang="ts">
export default {
  name: 'StyleSection'
}
</script>

<template>
  <UCard class="h-full">
    <template #header>
      <div class="text-center">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          {{ label }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Theme Presets -->
      <div>
        <p class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme Presets
        </p>
        <div
          class="grid grid-cols-3 gap-2"
          data-testid="theme-presets"
        >
          <button
            v-for="preset in THEME_PRESETS"
            :key="preset.name"
            type="button"
            :aria-pressed="activeThemePreset === preset.name"
            :data-testid="`theme-preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`"
            :class="[
              'flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition',
              activeThemePreset === preset.name
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
            ]"
            @click="style.applyThemePreset(preset)"
          >
            <span class="flex gap-1">
              <span
                class="size-3 rounded-full border border-white/20 shadow"
                :style="{ background: preset.backgroundColor || '#6b7280' }"
              />
              <span
                class="size-3 rounded-full border border-white/20 shadow"
                :style="{ background: preset.textPrimaryColor || '#9ca3af' }"
              />
              <span
                class="size-3 rounded-full border border-white/20 shadow"
                :style="{ background: preset.textAccentColor || '#d1d5db' }"
              />
            </span>
            <span class="truncate text-center leading-none">{{ preset.name }}</span>
          </button>
        </div>
      </div>

      <!-- Text Colors -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Text Colors
          </p>
          <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-arrow-path"
            data-testid="reset-text-colors-button"
            @click="style.resetTextColors()"
          >
            Reset
          </UButton>
        </div>
        <ColorInput
          :model-value="textPrimaryColor"
          label="Primary"
          name="textPrimaryColor"
          tooltip="Primary text color used for main labels and names."
          :error="errors.textPrimaryColor"
          @update:model-value="style.setTextPrimaryColor($event)"
          @blur="onColorBlur"
          @enter="onColorEnter"
        />
        <ColorInput
          :model-value="textSecondaryColor"
          label="Secondary"
          name="textSecondaryColor"
          tooltip="Secondary text color used for supporting information."
          :error="errors.textSecondaryColor"
          @update:model-value="style.setTextSecondaryColor($event)"
          @blur="onColorBlur"
          @enter="onColorEnter"
        />
        <ColorInput
          :model-value="textAccentColor"
          label="Accent"
          name="textAccentColor"
          tooltip="Accent color used for highlighted elements and counts."
          :error="errors.textAccentColor"
          @update:model-value="style.setTextAccentColor($event)"
          @blur="onColorBlur"
          @enter="onColorEnter"
        />
      </div>

      <!-- Shadow Preset -->
      <UFormField
        label="Shadow"
        name="shadowPreset"
        hint=" "
      >
        <template #hint>
          <UTooltip text="Apply a drop shadow effect to text and logo elements.">
            <UIcon
              name="i-heroicons-question-mark-circle"
              class="size-4 cursor-help text-gray-400"
            />
          </UTooltip>
        </template>
        <USelect
          v-model="shadowModel"
          :items="shadowOptions"
          label-key="label"
          value-key="value"
          data-testid="shadow-preset-select"
        />
      </UFormField>

      <!-- Output Format -->
      <UFormField
        label="Output Format"
        name="outputFormat"
      >
        <template #hint>
          <UTooltip text="Choose the image format for your banner download and preview.">
            <UIcon
              name="i-heroicons-question-mark-circle"
              class="size-4 cursor-help text-gray-400"
            />
          </UTooltip>
        </template>
        <USelect
          v-model="formatModel"
          :items="formatOptions"
          label-key="label"
          value-key="value"
          data-testid="output-format-select"
        />
      </UFormField>

      <!-- Global Reset -->
      <div class="border-t pt-4 dark:border-gray-700">
        <UButton
          variant="outline"
          color="error"
          size="sm"
          icon="i-heroicons-arrow-path"
          data-testid="reset-all-button"
          @click="style.resetAll()"
        >
          Reset All Design
        </UButton>
      </div>
    </div>
  </UCard>
</template>
