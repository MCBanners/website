<template>
  <ControlBox :title="title">
    <template #hint>
      <slot name="hint">
        <p>
          {{ hint }}
        </p>
      </slot>
    </template>
    <template #controls>
      <BannerTextFieldOptions
        :x="target.x"
        :y="target.y"
        :fontSize="target.font_size"
        :bold="target.bold"
        :textAlign="target.text_align"
        :font="target.font_face"
        @update="handleFieldUpdate"
        :namespace="namespace"
      />
      <slot name="ext_controls"></slot>
    </template>
  </ControlBox>
</template>

<script>
import ControlBox from './ControlBox'
import BannerTextFieldOptions from './BannerTextFieldOptions'

export default {
  name: 'BannerTextFieldControlBox',
  components: { ControlBox, BannerTextFieldOptions },
  props: {
    title: {
      type: String,
      required: true
    },
    hint: {
      type: String,
      default: 'No hint provided'
    },
    target: {
      type: Object,
      required: true
    },
    namespace: {
      type: String,
      required: true
    }
  },
  methods: {
    handleFieldUpdate(updated) {
      this.$emit('update', updated)
    }
  }
}
</script>
