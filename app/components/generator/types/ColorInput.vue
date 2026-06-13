<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    name: string
    modelValue: string
    tooltip?: string
    error?: string
  }>(),
  {
    tooltip: undefined,
    error: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur' | 'enter'): void
}>()

const hexInput = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    hexInput.value = val
  },
)

const colorPickerValue = computed(() => {
  return /^#[0-9A-Fa-f]{6}$/.test(props.modelValue)
    ? props.modelValue
    : '#ffffff'
})

const isColorSet = computed(() => /^#[0-9A-Fa-f]{6}$/.test(props.modelValue))

function onColorPickerInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  hexInput.value = value
  emit('update:modelValue', value)
}

function onHexInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  hexInput.value = value
  emit('update:modelValue', value)
}

function onBlur() {
  emit('blur')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    emit('enter')
  }
}
</script>

<script lang="ts">
export default {
  name: 'ColorInput',
}
</script>

<template>
  <UFormField :label="label" :name="name" :error="error">
    <template v-if="tooltip" #hint>
      <UTooltip :text="tooltip">
        <UIcon
          name="i-heroicons-question-mark-circle"
          class="size-4 cursor-help text-gray-400"
        />
      </UTooltip>
    </template>

    <div class="flex items-center gap-2">
      <input
        type="color"
        :value="colorPickerValue"
        :disabled="!isColorSet"
        :class="[
          'h-8 w-8 rounded border border-gray-300 bg-transparent p-0.5 dark:border-gray-700',
          isColorSet ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
        ]"
        :aria-label="`${label} color picker`"
        @input="onColorPickerInput"
        @change="onColorPickerInput"
      />
      <UInput
        :model-value="hexInput"
        placeholder="#RRGGBB"
        :class="{ 'ring-1 ring-red-500': !!error }"
        :ui="{ base: 'font-mono' }"
        :data-testid="`color-input-${name}`"
        @input="onHexInput"
        @blur="onBlur"
        @keydown="onKeydown"
      />
    </div>
  </UFormField>
</template>
