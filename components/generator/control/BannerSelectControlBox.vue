<template>
  <ControlBox :title="title">
    <template #hint>
      <p>{{ hint }}</p>
    </template>
    <template #controls>
      <b-select v-model="selected" :options="options" />
    </template>
  </ControlBox>
</template>

<script>
import ControlBox from './ControlBox'

export default {
  name: 'BannerSelectControlBox',
  components: { ControlBox },
  props: {
    title: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      required: true,
    },
    default: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: this.default,
    }
  },
  watch: {
    selected(next, prev) {
      this.$emit('update', next)
    },
  },
}
</script>
