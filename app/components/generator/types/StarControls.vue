<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDefaultStore } from '~/stores/defaults'
import FormInput from '~/components/generator/types/raw/FormInput.vue'

const defaults = useDefaultStore()

const resource = storeToRefs(defaults).resource

const { stars } = resource.value!
</script>

<script lang="ts">
export default {
  name: 'StarControls'
}
</script>

<template>
  <div class="flex justify-center space-x-4">
    <FormInput
      v-model="stars.x"
      name="starXOffset"
      label="X Offset"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <FormInput
      v-model="stars.y"
      name="starYOffset"
      label="Y Offset"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
    <FormInput
      v-model="stars.gap"
      name="starGap"
      label="Gap"
      type="number"
      class="w-1/12"
      trail-text="px"
    />
  </div>
</template>
