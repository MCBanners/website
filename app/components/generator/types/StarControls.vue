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
  <div class="advanced-control-inspector">
    <section class="advanced-control-group">
      <p class="advanced-control-heading">Position</p>
      <div class="advanced-control-fields advanced-control-fields--inline">
        <FormInput v-model="stars.x" name="starXOffset" label="X Offset" type="number" trail-text="px" />
        <FormInput v-model="stars.y" name="starYOffset" label="Y Offset" type="number" trail-text="px" />
      </div>
    </section>
    <section class="advanced-control-group">
      <p class="advanced-control-heading">Spacing</p>
      <div class="advanced-control-fields">
        <FormInput v-model="stars.gap" name="starGap" label="Gap" type="number" trail-text="px" />
      </div>
    </section>
  </div>
</template>
