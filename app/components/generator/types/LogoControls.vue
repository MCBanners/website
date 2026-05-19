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
  <div class="advanced-control-inspector">
    <section class="advanced-control-group">
      <p class="advanced-control-heading">
        Position
      </p>
      <div class="advanced-control-fields advanced-control-fields--inline">
        <FormInput
          v-model="logo.x"
          name="logoXOffset"
          label="X Offset"
          type="number"
          trail-text="px"
        />
        <UFormField label="Y Offset" name="logoYOffset">
          <template #hint>
            <UTooltip text="Vertical offset for the logo. 0 preserves the default auto-centered position.">
              <UIcon name="i-heroicons-question-mark-circle" class="size-4 cursor-help text-gray-400" />
            </UTooltip>
          </template>
          <div class="flex items-center gap-2">
            <input
              type="range"
              :value="logoY"
              min="-50"
              max="50"
              step="1"
              class="w-full min-w-28 accent-primary-500"
              data-testid="logo-y-slider"
              @input="onLogoYChange"
              @change="onLogoYCommit"
            >
            <span class="w-12 text-center text-sm tabular-nums text-gray-300">
              {{ logoY }}px
            </span>
          </div>
        </UFormField>
      </div>
    </section>

    <section class="advanced-control-group">
      <p class="advanced-control-heading">
        Size
      </p>
      <div class="advanced-control-fields">
        <FormInput
          v-model="logo.size"
          name="logoSize"
          label="Logo Size"
          type="number"
          trail-text="px"
        />
      </div>
    </section>

    <section class="advanced-control-group">
      <p class="advanced-control-heading">
        Actions
      </p>
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
      <p v-else class="text-xs text-muted">
        Logo is using default vertical placement.
      </p>
    </section>
  </div>
</template>
