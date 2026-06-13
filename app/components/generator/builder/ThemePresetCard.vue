<script setup lang="ts">
import type { ThemePreset } from '~/types/style'

defineProps<{
  preset: ThemePreset
  active: boolean
}>()

defineEmits<{
  (e: 'select', preset: ThemePreset): void
}>()
</script>

<script lang="ts">
export default {
  name: 'ThemePresetCard',
}
</script>

<template>
  <button
    type="button"
    :aria-pressed="active"
    :data-testid="`theme-preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`"
    :class="[
      'group relative rounded-lg border p-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
      active
        ? 'border-primary-400 bg-primary-500/10 shadow-[0_0_0_1px_rgba(34,197,94,0.35)]'
        : 'border-muted bg-elevated/55 hover:border-primary-400/60 hover:bg-elevated',
    ]"
    @click="$emit('select', preset)"
  >
    <span
      v-if="active"
      class="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
    >
      <UIcon name="i-lucide-check" class="size-3.5" />
    </span>

    <span
      class="block h-10 rounded-md border border-white/10"
      :style="{
        background:
          preset.backgroundColor || 'linear-gradient(135deg, #101827, #243244)',
      }"
    />

    <span
      class="mt-2 block truncate text-center text-xs font-semibold text-highlighted"
    >
      {{ preset.name }}
    </span>

    <span class="mt-2 flex justify-center gap-1">
      <span
        v-for="color in [
          preset.textPrimaryColor,
          preset.textSecondaryColor,
          preset.textAccentColor,
        ]"
        :key="`${preset.name}-${color || 'default'}`"
        class="size-3 rounded-full border border-white/20 shadow"
        :style="{ background: color || '#64748b' }"
      />
    </span>
  </button>
</template>
