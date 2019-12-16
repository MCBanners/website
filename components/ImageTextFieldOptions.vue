<template>
  <div>
    <b-input-group prepend="X Offset" append="px">
      <b-form-input @change="xUpdate" :value="x" type="number" />
    </b-input-group>
    <b-input-group prepend="Y Offset" append="px">
      <b-form-input @change="yUpdate" :value="y" type="number" />
    </b-input-group>
    <b-input-group prepend="Font Size" append="px">
      <b-form-input @change="fontSizeUpdate" :value="fontSize" type="number" />
    </b-input-group>
    <b-input-group prepend="Bold">
      <b-select
        @change="boldUpdate"
        :value="bold"
        :options="[
          { value: true, text: 'Yes' },
          { value: false, text: 'No' }
        ]"
      />
    </b-input-group>
    <b-input-group prepend="Text Alignment">
      <b-select
        @change="textAlignUpdate"
        :value="textAlign"
        :options="textAlignmentOptions"
      >
      </b-select>
    </b-input-group>
    <b-input-group prepend="Font">
      <b-select @change="fontUpdate" :value="font" :options="fontOptions">
      </b-select>
    </b-input-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UtilityMethods from '~/mixins/utility_methods'

export default {
  name: 'ImageTextFieldOptions',
  mixins: [UtilityMethods],
  props: {
    namespace: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    fontSize: {
      type: Number,
      required: true
    },
    bold: {
      type: Boolean,
      required: true
    },
    textAlign: {
      type: String,
      required: true
    },
    font: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      fonts: (state) => state.constants.fonts,
      text_alignments: (state) => state.constants.text_alignments
    }),
    fontOptions() {
      return this.makeSelectable(this.fonts)
    },
    textAlignmentOptions() {
      return this.makeSelectable(this.text_alignments)
    }
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
      this.emitUpdate('font', font)
    },
    emitUpdate(key, value) {
      this.$emit('update', {
        namespace: this.namespace,
        key,
        value
      })
    }
  }
}
</script>
