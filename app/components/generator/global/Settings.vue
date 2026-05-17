<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConstantStore } from '~/stores/constants'
import { useDefaultStore } from '~/stores/defaults'

const constants = useConstantStore()
const defaults = useDefaultStore()

const { type } = storeToRefs(defaults)

const resource = storeToRefs(defaults).resource
const author = storeToRefs(defaults).author
const server = storeToRefs(defaults).server

const val = ref(false)
const font = ref('Source Sans Pro')
const fonts = constants.fontFaces

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | null): void
}>()

const change = (newValue: boolean | 'indeterminate') => {
  if (newValue === 'indeterminate') {
    return
  }

  val.value = newValue
  emit('update:modelValue', val.value)
}

const updateBoldValues = (newValue: boolean) => {
  if (type.value === 'resource') {
    const res = resource.value!
    res.author_name.font_bold = newValue
    res.downloads.font_bold = newValue
    res.price.font_bold = newValue
    res.resource_name.font_bold = newValue
    res.reviews.font_bold = newValue
    res.updated.font_bold = newValue
  } else if (type.value === 'author') {
    const auth = author.value!
    auth.author_name.font_bold = newValue
    auth.downloads.font_bold = newValue
    auth.likes.font_bold = newValue
    auth.resource_count.font_bold = newValue
    auth.reviews.font_bold = newValue
  } else if (type.value === 'server') {
    const serv = server.value!
    serv.server_name.font_bold = newValue
    serv.motd.font_bold = newValue
    serv.players.font_bold = newValue
    serv.version.font_bold = newValue
  }
}

const updateFontFaces = (newValue: string) => {
  if (type.value === 'resource') {
    const res = resource.value!
    res.author_name.font_face = newValue
    res.downloads.font_face = newValue
    res.price.font_face = newValue
    res.resource_name.font_face = newValue
    res.reviews.font_face = newValue
    res.updated.font_face = newValue
  } else if (type.value === 'author') {
    const auth = author.value!
    auth.author_name.font_face = newValue
    auth.downloads.font_face = newValue
    auth.likes.font_face = newValue
    auth.resource_count.font_face = newValue
    auth.reviews.font_face = newValue
  } else if (type.value === 'server') {
    const serv = server.value!
    serv.server_name.font_face = newValue
    serv.motd.font_face = newValue
    serv.players.font_face = newValue
    serv.version.font_face = newValue
  }
}

watch(val, updateBoldValues)
watch(font, updateFontFaces)
</script>

<script lang="ts">
export default {
  name: 'GlobalSettings'
}
</script>

<template>
  <div class="flex flex-row justify-center gap-4">
    <UFormField
      label="Bold"
      name="bold"
      class="w-1/4"
    >
      <UCheckbox
        v-model="val"
        @update:model-value="change"
      />
    </UFormField>

    <UFormField
      label="Font"
      name="font"
      class="w-1/2"
    >
      <USelect
        v-model="font"
        :items="fonts"
        label-key="value"
        value-key="value"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
