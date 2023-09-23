<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConstantStore } from '~/stores/constants'
import FormInput from '~/components/generator/types/raw/FormInput.vue'

import { useDefaultStore } from '~/stores/defaults'

const defaults = useDefaultStore()
const constants = useConstantStore()
const server = storeToRefs(defaults).server

const { server_name } = server.value!

const alignments = constants.alignments
const fonts = constants.fontFaces
</script>

<script lang="ts">
export default {
  name: 'ServerNameControls'
}
</script>

<template>
  <div class="flex justify-center space-x-2">
    <FormInput
      v-model="server_name.x"
      name="xoffset"
      label="X Offset"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <FormInput
      v-model="server_name.y"
      name="yoffset"
      label="Y Offset"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <FormInput
      v-model="server_name.font_size"
      name="fontsize"
      label="Font Size"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <UFormGroup label="Bold" name="bold">
      <UToggle v-model="server_name.font_bold" />
    </UFormGroup>
    <UFormGroup label="Text Alignment" name="alignment">
      <USelect
        v-model="server_name.text_align"
        value-attribute="key"
        :options="alignments"
        option-attribute="value"
      />
    </UFormGroup>
    <UFormGroup label="Font Face" name="font">
      <USelect v-model="server_name.font_face" value-attribute="key" :options="fonts" option-attribute="value" />
    </UFormGroup>
    <UFormGroup label="Text Override" name="override">
      <UInput v-model="server_name.display" value-attribute="key" type="text" class="w-full" />
    </UFormGroup>
  </div>
</template>
