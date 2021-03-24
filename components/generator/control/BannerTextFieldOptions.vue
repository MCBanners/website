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
    <b-input-group prepend="Bold">
      <b-select
        :value="bold"
        :options="[
          { value: true, text: 'Yes' },
          { value: false, text: 'No' },
        ]"
        @change="boldUpdate"
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
    <b-input-group prepend="Font">
      <b-select :value="font" :options="fontOptions" @change="fontUpdate">
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
    bold: {
      type: Boolean,
      required: true,
    },
    textAlign: {
      type: String,
      required: true,
    },
    font: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      fonts: (state) => state.svc.fonts,
      text_alignments: (state) => state.svc.text_alignments,
    }),
    fontOptions() {
      return this.makeSelectable(this.fonts)
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
    boldUpdate(bold) {
      this.emitUpdate('bold', bold)
    },
    textAlignUpdate(textAlign) {
      this.emitUpdate('text_align', textAlign)
    },
    fontUpdate(font) {
      this.emitUpdate('font_face', font)
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
