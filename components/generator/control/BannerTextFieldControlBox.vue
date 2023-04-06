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
      <slot name="ext_top_controls"></slot>
      <BannerTextFieldOptions
        :x="target.x"
        :y="target.y"
        :font-size="target.font_size"
        :font-bold="target.font_bold"
        :text-align="target.text_align"
        :font-face="target.font_face"
        :namespace="namespace"
        @update="handleFieldUpdate"
      />
      <slot name="ext_bot_controls"></slot>
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
      required: true,
    },
    hint: {
      type: String,
      default: 'No hint provided',
    },
    target: {
      type: Object,
      required: true,
    },
    namespace: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleFieldUpdate(updated) {
      this.$emit('update', updated)
    },
  },
}
</script>
