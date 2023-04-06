<template>
  <div>
    <b-input-group prepend="X Offset" append="px">
      <b-form-input :value="x" type="number" @change="xUpdate" />
    </b-input-group>
    <b-input-group prepend="Y Offset" append="px">
      <b-form-input :value="y" type="number" @change="yUpdate" />
    </b-input-group>
    <b-input-group prepend="Font Size" append="px">
      <b-form-input :value="fontSize" type="number" @change="fontSizeUpdate" />
    </b-input-group>
    <b-input-group prepend="Font Bold">
      <b-select
        :value="fontBold"
        :options="[
          { value: true, text: 'Yes' },
          { value: false, text: 'No' },
        ]"
        @change="fontBoldUpdate"
      />
    </b-input-group>
    <b-input-group prepend="Text Alignment">
      <b-select
        :value="textAlign"
        :options="textAlignmentOptions"
        @change="textAlignUpdate"
      >
      </b-select>
    </b-input-group>
    <b-input-group prepend="Font Face">
      <b-select
        :value="fontFace"
        :options="fontFaceOptions"
        @change="fontFaceUpdate"
      >
      </b-select>
    </b-input-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UtilityMethods from '~/mixins/utility_methods'

export default {
  name: 'BannerTextFieldOptions',
  mixins: [UtilityMethods],
  props: {
    namespace: {
      type: String,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    fontSize: {
      type: Number,
      required: true,
    },
    fontBold: {
      type: Boolean,
      required: true,
    },
    textAlign: {
      type: String,
      required: true,
    },
    fontFace: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      font_faces: (state) => state.svc.fonts,
      text_alignments: (state) => state.svc.text_alignments,
    }),
    fontFaceOptions() {
      return this.makeSelectable(this.font_faces)
    },
    textAlignmentOptions() {
      return this.makeSelectable(this.text_alignments)
    },
  },
  methods: {
    xUpdate(x) {
      this.emitUpdate('x', Number(x))
    },
    yUpdate(y) {
      this.emitUpdate('y', Number(y))
    },
    fontSizeUpdate(fontSize) {
      this.emitUpdate('font_size', Number(fontSize))
    },
    fontBoldUpdate(fontBold) {
      this.emitUpdate('font_bold', fontBold)
    },
    textAlignUpdate(textAlign) {
      this.emitUpdate('text_align', textAlign)
    },
    fontFaceUpdate(fontFace) {
      this.emitUpdate('font_face', fontFace)
    },
    emitUpdate(key, value) {
      this.$emit('update', {
        namespace: this.namespace,
        key,
        value,
      })
    },
  },
}
</script>
