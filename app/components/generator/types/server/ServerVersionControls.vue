<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConstantStore } from '~/stores/constants'
import FormInput from '~/components/generator/types/raw/FormInput.vue'

import { useDefaultStore } from '~/stores/defaults'

const defaults = useDefaultStore()
const constants = useConstantStore()
const server = storeToRefs(defaults).server

const { version } = server.value!

const alignments = constants.alignments
const fonts = constants.fontFaces
</script>

<script lang="ts">
export default {
  name: 'ServerVersionControls'
}
</script>

<template>
  <div class="advanced-control-inspector">
    <section class="advanced-control-group">
      <p class="advanced-control-heading">Position</p>
      <div class="advanced-control-fields advanced-control-fields--inline">
        <FormInput v-model="version.x" name="xoffset" label="X Offset" type="number" trail-text="px" />
        <FormInput v-model="version.y" name="yoffset" label="Y Offset" type="number" trail-text="px" />
      </div>
    </section>
    <section class="advanced-control-group">
      <p class="advanced-control-heading">Typography</p>
      <div class="advanced-control-fields">
        <FormInput v-model="version.font_size" name="fontsize" label="Font Size" type="number" trail-text="px" />
        <UFormField label="Bold" name="bold"><USwitch v-model="version.font_bold" /></UFormField>
        <UFormField label="Text Alignment" name="alignment"><USelect v-model="version.text_align" value-key="key" label-key="value" :items="alignments" /></UFormField>
        <UFormField label="Font Face" name="font"><USelect v-model="version.font_face" value-key="key" label-key="value" :items="fonts" /></UFormField>
      </div>
    </section>
  </div>
</template>
