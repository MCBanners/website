<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConstantStore } from '~/stores/constants'
import { useDefaultStore } from '~/stores/defaults'
import { THEME_PRESETS, useStyleStore } from '~/stores/style'
import type { BackgroundMode, OutputFormat, ShadowPreset } from '~/types/style'
import ColorInput from '~/components/generator/types/ColorInput.vue'
import ThemePresetCard from '~/components/generator/builder/ThemePresetCard.vue'

const defaults = useDefaultStore()
const constants = useConstantStore()
const style = useStyleStore()

const { template } = storeToRefs(defaults)
const {
  backgroundMode,
  backgroundColor,
  textPrimaryColor,
  textSecondaryColor,
  textAccentColor,
  shadowPreset,
  outputFormat,
  activeThemePreset,
  errors
} = storeToRefs(style)

const backgroundModeOptions: Array<{ label: string, value: BackgroundMode }> = [
  { label: 'Template', value: 'template' },
  { label: 'Custom Color', value: 'solid' }
]

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

function flushPreview () {
  style.flushPreview()
}
</script>

<script lang="ts">
export default {
  name: 'DesignPanel'
}
</script>

<template>
  <UCard
    class="h-full border-white/10 bg-elevated/45"
    :ui="{ body: 'space-y-4', header: 'pb-3' }"
  >
    <template #header>
      <div>
        <h3 class="text-base font-semibold text-highlighted">
          Design
        </h3>
        <p class="mt-1 text-sm text-muted">
          Customize the look of your banner.
        </p>
      </div>
    </template>

    <section class="space-y-3">
      <p class="text-sm font-semibold text-highlighted">
        Theme Presets
      </p>
      <div
        class="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-5"
        data-testid="theme-presets"
      >
        <ThemePresetCard
          v-for="preset in THEME_PRESETS"
          :key="preset.name"
          :preset="preset"
          :active="activeThemePreset === preset.name"
          @select="style.applyThemePreset"
        />
      </div>
    </section>

    <USeparator />

    <section class="grid gap-5 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
      <div class="space-y-3">
        <p class="text-sm font-semibold text-highlighted">
          Background
        </p>
        <div
          role="radiogroup"
          class="inline-flex rounded-md shadow-sm"
          data-testid="background-mode-controls"
        >
          <UButton
            v-for="option in backgroundModeOptions"
            :key="option.value"
            size="sm"
            class="first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none"
            :variant="backgroundMode === option.value ? 'solid' : 'outline'"
            :color="backgroundMode === option.value ? 'primary' : 'neutral'"
            :aria-pressed="backgroundMode === option.value"
            :data-testid="`background-mode-${option.value}`"
            @click="style.setBackgroundMode(option.value)"
          >
            {{ option.label }}
          </UButton>
        </div>

        <UFormField
          v-if="backgroundMode === 'template'"
          label="Template"
          name="template"
        >
          <USelect
            v-model="template"
            :items="constants.templates"
            label-key="value"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <div v-else class="space-y-2" data-testid="background-color-section">
          <ColorInput
            :model-value="backgroundColor"
            label="Color"
            name="backgroundColor"
            tooltip="Use a solid background color instead of the selected template."
            :error="errors.backgroundColor"
            @update:model-value="style.setBackgroundColor($event)"
            @blur="flushPreview"
            @enter="flushPreview"
          />
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            icon="i-lucide-rotate-ccw"
            data-testid="reset-background-button"
            @click="style.resetBackground()"
          >
            Reset Background
          </UButton>
        </div>
      </div>

      <div class="space-y-3 border-white/10 xl:border-l xl:pl-5">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-semibold text-highlighted">
            Text Colors
          </p>
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            icon="i-lucide-rotate-ccw"
            data-testid="reset-text-colors-button"
            @click="style.resetTextColors()"
          >
            Reset
          </UButton>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <ColorInput
            :model-value="textPrimaryColor"
            label="Primary"
            name="textPrimaryColor"
            tooltip="Primary text color used for main labels and names."
            :error="errors.textPrimaryColor"
            @update:model-value="style.setTextPrimaryColor($event)"
            @blur="flushPreview"
            @enter="flushPreview"
          />
          <ColorInput
            :model-value="textSecondaryColor"
            label="Secondary"
            name="textSecondaryColor"
            tooltip="Secondary text color used for supporting information."
            :error="errors.textSecondaryColor"
            @update:model-value="style.setTextSecondaryColor($event)"
            @blur="flushPreview"
            @enter="flushPreview"
          />
          <ColorInput
            :model-value="textAccentColor"
            label="Accent"
            name="textAccentColor"
            tooltip="Accent color used for highlighted elements and counts."
            :error="errors.textAccentColor"
            @update:model-value="style.setTextAccentColor($event)"
            @blur="flushPreview"
            @enter="flushPreview"
          />
        </div>
      </div>
    </section>

    <USeparator />

    <section class="grid gap-5 xl:grid-cols-2">
      <div>
        <p class="mb-3 text-sm font-semibold text-highlighted">
          Shadow
        </p>
        <UFormField label="Preset" name="shadowPreset">
          <USelect
            v-model="shadowModel"
            :items="shadowOptions"
            label-key="label"
            value-key="value"
            class="w-full"
            data-testid="shadow-preset-select"
          />
        </UFormField>
      </div>

      <div class="border-white/10 xl:border-l xl:pl-5">
        <p class="mb-3 text-sm font-semibold text-highlighted">
          Output Format
        </p>
        <UFormField label="Format" name="outputFormat">
          <USelect
            v-model="formatModel"
            :items="formatOptions"
            label-key="label"
            value-key="value"
            class="w-full"
            data-testid="output-format-select"
          />
        </UFormField>
      </div>
    </section>

    <USeparator />

    <div>
      <UButton
        variant="outline"
        color="error"
        size="sm"
        icon="i-lucide-rotate-ccw"
        data-testid="reset-all-button"
        @click="style.resetAll()"
      >
        Reset All Design
      </UButton>
    </div>
  </UCard>
</template>
