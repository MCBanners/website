<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDefaultStore } from '~/stores/defaults'
import FormInput from '~/components/generator/types/raw/FormInput.vue'

const defaults = useDefaultStore()

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

</script>

<script lang="ts">
export default {
  name: 'LogoControls'
}
</script>

<template>
  <div class="flex justify-center space-x-4">
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
  </div>
</template>
