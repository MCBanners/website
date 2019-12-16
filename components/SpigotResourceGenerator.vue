<template>
  <b-card-group columns>
    <ControlBox title="Banner Template">
      <template #hint>
        <p>Choose a base template for your banner.</p>
      </template>
      <template #controls>
        <b-select v-model="template" :options="templateOptions" />
      </template>
    </ControlBox>
    <ControlBox title="Resource Logo">
      <template #hint>
        <p>
          Configure how the resource logo will display in the generated banner.
        </p>
      </template>
      <template #controls>
        <b-input-group prepend="Size">
          <b-form-input v-model="logo.size" type="number" />
        </b-input-group>
        <b-input-group prepend="X Offset">
          <b-form-input v-model="logo.x" type="number" />
        </b-input-group>
      </template>
    </ControlBox>
    <ControlBox title="Resource Name">
      <template #hint>
        <p>
          Configure how the resource name will display in the generated banner.
        </p>
        <p>
          <small
            >* If your resource's name is too long for the image, set a
            <strong>Text Override</strong>.</small
          >
        </p>
      </template>
      <template #controls>
        <ImageTextFieldOptions
          :x="res_name.x"
          :y="res_name.y"
          :fontSize="res_name.font_size"
          :bold="res_name.bold"
          :textAlign="res_name.text_align"
          :font="res_name.font"
          @update="handleFieldUpdate"
          namespace="res_name"
        />
        <b-input-group prepend="Text Override">
          <b-input
            v-model="res_name.display"
            type="text"
            placeholder="No Override Set"
          />
        </b-input-group>
      </template>
    </ControlBox>
    <ControlBox title="Author Name">
      <template #hint>
        <p>
          Configure how the author's name will display in the generated banner.
        </p>
      </template>
      <template #controls>
        <ImageTextFieldOptions
          :x="aut_name.x"
          :y="aut_name.y"
          :fontSize="aut_name.font_size"
          :bold="aut_name.bold"
          :textAlign="aut_name.text_align"
          :font="aut_name.font"
          @update="handleFieldUpdate"
          namespace="aut_name"
        />
      </template>
    </ControlBox>
    <ControlBox title="Review Count">
      <template #hint>
        <p>
          Configure how the review count will display in the generated banner.
        </p>
      </template>
      <template #controls>
        <ImageTextFieldOptions
          :x="rev_count.x"
          :y="rev_count.y"
          :fontSize="rev_count.font_size"
          :bold="rev_count.bold"
          :textAlign="rev_count.text_align"
          :font="rev_count.font"
          @update="handleFieldUpdate"
          namespace="rev_count"
        />
      </template>
    </ControlBox>
    <ControlBox title="Stars">
      <template #hint>
        <p>Configure how the stars will display in the generated banner.</p>
      </template>
      <template #controls>
        <b-input-group prepend="X Offset">
          <b-form-input v-model="stars.x" type="number" />
        </b-input-group>
        <b-input-group prepend="Y Offset">
          <b-form-input v-model="stars.y" type="number" />
        </b-input-group>
        <b-input-group prepend="Gap">
          <b-form-input v-model="stars.gap" type="number" />
        </b-input-group>
      </template>
    </ControlBox>
    <ControlBox title="Download Count">
      <template #hint>
        <p>
          Configure how the download count will display in the generated banner.
        </p>
      </template>
      <template #controls>
        <ImageTextFieldOptions
          :x="dl_count.x"
          :y="dl_count.y"
          :fontSize="dl_count.font_size"
          :bold="dl_count.bold"
          :textAlign="dl_count.text_align"
          :font="dl_count.font"
          @update="handleFieldUpdate"
          namespace="dl_count"
        />
      </template>
    </ControlBox>
    <ControlBox title="Price">
      <template #hint>
        <p>
          Configure how the price (if the resource is premium) will display in
          the generated banner.
        </p>
      </template>
      <template #controls>
        <ImageTextFieldOptions
          :x="price.x"
          :y="price.y"
          :fontSize="price.font_size"
          :bold="price.bold"
          :textAlign="price.text_align"
          :font="price.font"
          @update="handleFieldUpdate"
          namespace="price"
        />
      </template>
    </ControlBox>
  </b-card-group>
</template>

<script>
import { mapState } from 'vuex'
import UtilityMethods from '~/mixins/utility_methods'
import ControlBox from '~/components/ControlBox'
import ImageTextFieldOptions from '~/components/ImageTextFieldOptions'

export default {
  name: 'SpigotResourceGenerator',
  components: { ControlBox, ImageTextFieldOptions },
  mixins: [UtilityMethods],
  data() {
    return {
      template: 'moonlight_purple',
      logo: {
        size: 80,
        x: 12
      },
      res_name: {
        x: 104,
        y: 25,
        font_size: 18,
        bold: true,
        text_align: 'left',
        font: 'source_sans_pro',
        display: undefined
      },
      aut_name: {
        x: 104,
        y: 42,
        font_size: 14,
        bold: false,
        text_align: 'left',
        font: 'source_sans_pro'
      },
      rev_count: {
        x: 104,
        y: 62,
        font_size: 14,
        bold: false,
        text_align: 'left',
        font: 'source_sans_pro'
      },
      stars: {
        x: 180,
        y: 51,
        gap: 16.0
      },
      dl_count: {
        x: 104,
        y: 83,
        font_size: 14,
        bold: false,
        text_align: 'left',
        font: 'source_sans_pro'
      },
      price: {
        x: 210,
        y: 83,
        font_size: 14,
        bold: true,
        text_align: 'left',
        font: 'source_sans_pro'
      }
    }
  },
  computed: {
    ...mapState({
      templates: (state) => state.constants.templates
    }),
    templateOptions() {
      return this.makeSelectable(this.templates)
    }
  },
  methods: {
    handleFieldUpdate(payload) {
      this[payload.namespace][payload.key] = payload.value
    }
  }
}
</script>

<style lang="scss" scoped>
.card-columns {
  column-count: 1;

  @media (min-width: 768px) {
    column-count: 2;
  }
}

.input-group {
  margin-bottom: 2px;
}
</style>
