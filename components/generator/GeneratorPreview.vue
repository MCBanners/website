<template>
  <div style="padding: 1.25rem">
    <ControlBox title="Preview" hint-md-cols="6" controls-md-cols="6">
      <template #hint>
        This is how your banner will look with the current settings. Once you're
        happy with it, click "Finish".
      </template>
      <template #controls>
        <img :src="bannerURL" />
      </template>
    </ControlBox>
  </div>
</template>

<script>
import ControlBox from '~/components/generator/control/ControlBox'

export default {
  name: 'GeneratorPreview',
  components: { ControlBox },
  props: {
    bannerURL: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 1280px) {
  img {
    width: 100%;
  }
}
</style>
