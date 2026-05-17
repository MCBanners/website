<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDefaultStore } from '~/stores/defaults'
import { useConstantStore } from '~/stores/constants'
import FormInput from '~/components/generator/types/raw/FormInput.vue'

const defaults = useDefaultStore()
const constants = useConstantStore()

const author = storeToRefs(defaults).author

const { resource_count } = author.value!

const alignments = constants.alignments
const fonts = constants.fontFaces
</script>

<script lang="ts">
export default {
  name: 'ResourceCountControls'
}
</script>

<template>
  <div class="flex justify-center space-x-4">
    <FormInput
      v-model="resource_count.x"
      name="xoffset"
      label="X Offset"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <FormInput
      v-model="resource_count.y"
      name="yoffset"
      label="Y Offset"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <FormInput
      v-model="resource_count.font_size"
      name="fontsize"
      label="Font Size"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <UFormField label="Bold" name="bold">
      <USwitch v-model="resource_count.font_bold" />
    </UFormField>
    <UFormField label="Text Alignment" name="alignment">
      <USelect
        v-model="resource_count.text_align"
        value-key="key" label-key="value"
        :items="alignments"
      />
    </UFormField>
    <UFormField label="Font Face" name="font">
      <USelect v-model="resource_count.font_face" value-key="key" label-key="value" :items="fonts" />
    </UFormField>
  </div>
</template>
