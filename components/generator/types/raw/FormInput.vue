<script setup lang="ts">
defineProps({
  label: String,
  name: String,
  modelValue: Number,
  type: String,
  trailText: String
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (value: number) => {
  emit('update:modelValue', value)
}
</script>

<script lang="ts">
export default {
  name: 'FormInput'
}
</script>

<template>
  <UFormGroup :label="label" :name="name" class="w-1/6 mr-4">
    <UInput
      :model-value="modelValue"
      :type="type"
      @input="handleInput($event.target.valueAsNumber)"
    >
      <template #trailing>
        <span class="text-gray-500 dark:text-gray-400 text-xs">{{
          trailText
        }}</span>
      </template>
    </UInput>
  </UFormGroup>
</template>
