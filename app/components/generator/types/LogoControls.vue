<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDefaultStore } from '~/stores/defaults'
import { useStyleStore } from '~/stores/style'
import FormInput from '~/components/generator/types/raw/FormInput.vue'

const defaults = useDefaultStore()
const style = useStyleStore()

const { type } = storeToRefs(defaults)

const resource = storeToRefs(defaults).resource
const author = storeToRefs(defaults).author
const server = storeToRefs(defaults).server

const using = computed(() => {
  if (type.value === 'resource') {
    return resource.value!
  } else if (type.value === 'author') {
    return author.value!
  } else {
    return server.value!
  }
})

const { logo } = using.value
const { logoY } = storeToRefs(style)

function onLogoYChange (event: Event) {
  style.setLogoY((event.target as HTMLInputElement).valueAsNumber)
}

function onLogoYCommit () {
  style.flushPreview()
}
</script>

<script lang="ts">
export default {
  name: 'LogoControls'
}
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
    <FormInput
      v-model="logo.size"
      name="logoSize"
      label="Size"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <FormInput
      v-model="logo.x"
      name="logoXOffset"
      label="X Offset"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <UFormField
      label="Y Offset"
      name="logoYOffset"
      class="mr-4 w-fit"
    >
      <template #hint>
        <UTooltip text="Vertical offset for the logo. 0 preserves the default auto-centered position.">
          <UIcon
            name="i-heroicons-question-mark-circle"
            class="size-4 cursor-help text-gray-400"
          />
        </UTooltip>
      </template>
      <div class="flex items-center gap-2">
        <input
          type="range"
          :value="logoY"
          min="-50"
          max="50"
          step="1"
          class="w-28 accent-primary-500"
          data-testid="logo-y-slider"
          @input="onLogoYChange"
          @change="onLogoYCommit"
        >
        <span class="w-12 text-center text-sm tabular-nums text-gray-700 dark:text-gray-300">
          {{ logoY }}px
        </span>
      </div>
    </UFormField>
    <div class="ml-auto flex min-w-32 justify-end">
      <UButton
        v-if="logoY !== 0"
        size="xs"
        variant="outline"
        color="neutral"
        icon="i-heroicons-arrow-path"
        data-testid="reset-logo-y-button"
        @click="style.resetLogoY()"
      >
        Reset Logo
      </UButton>
    </div>
  </div>
</template>
