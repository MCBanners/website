<template>
  <div>
    <b-row>
      <b-col cols="12">
        <ControlBox title="Resource ID">
          <template #hint>
            <p>Enter the resource ID that you want to generate a banner for.</p>
            <p v-if="resource.invalid" class="text-danger">
              The resource ID you entered does not refer to a valid resource at
              Spigot.
            </p>
          </template>
          <template #controls>
            <b-input-group prepend="Resource ID">
              <b-form-input @change="checkValidResource" type="number" />
            </b-input-group>
          </template>
        </ControlBox>
      </b-col>
    </b-row>
    <div v-if="resource.id">
      <b-row>
        <b-col cols="12" class="result_box">
          <b-card bg-variant="secondary" text-variant="dark">
            <template #header>
              <h6 class="mb-0 text-center">Result</h6>
            </template>
            <b-row>
              <b-col cols="12" class="text-center">
                <img :src="bannerURL" />
              </b-col>
              <b-col cols="8" class="mx-auto text-center mt-3">
                <b-button variant="primary">
                  I like it, save!
                </b-button>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
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
              Configure how the resource logo will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <b-input-group prepend="Size" append="sq px">
              <b-form-input v-model.number="logo.size" type="number" />
            </b-input-group>
            <b-input-group prepend="X Offset" append="px">
              <b-form-input v-model.number="logo.x" type="number" />
            </b-input-group>
          </template>
        </ControlBox>
        <ControlBox title="Resource Name">
          <template #hint>
            <p>
              Configure how the resource name will display in the generated
              banner.
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
              :x="resource_name.x"
              :y="resource_name.y"
              :fontSize="resource_name.font_size"
              :bold="resource_name.bold"
              :textAlign="resource_name.text_align"
              :font="resource_name.font"
              @update="handleFieldUpdate"
              namespace="resource_name"
            />
            <b-input-group prepend="Text Override">
              <b-input
                v-model="resource_name.display"
                type="text"
                placeholder="No Override Set"
              />
            </b-input-group>
          </template>
        </ControlBox>
        <ControlBox title="Author Name">
          <template #hint>
            <p>
              Configure how the author's name will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="author_name.x"
              :y="author_name.y"
              :fontSize="author_name.font_size"
              :bold="author_name.bold"
              :textAlign="author_name.text_align"
              :font="author_name.font"
              @update="handleFieldUpdate"
              namespace="author_name"
            />
          </template>
        </ControlBox>
        <ControlBox title="Review Count">
          <template #hint>
            <p>
              Configure how the review count will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="reviews.x"
              :y="reviews.y"
              :fontSize="reviews.font_size"
              :bold="reviews.bold"
              :textAlign="reviews.text_align"
              :font="reviews.font"
              @update="handleFieldUpdate"
              namespace="reviews"
            />
          </template>
        </ControlBox>
        <ControlBox title="Stars">
          <template #hint>
            <p>Configure how the stars will display in the generated banner.</p>
          </template>
          <template #controls>
            <b-input-group prepend="X Offset" append="px">
              <b-form-input v-model.number="stars.x" type="number" />
            </b-input-group>
            <b-input-group prepend="Y Offset" append="px">
              <b-form-input v-model.number="stars.y" type="number" />
            </b-input-group>
            <b-input-group prepend="Gap" append="px">
              <b-form-input v-model.number="stars.gap" type="number" />
            </b-input-group>
          </template>
        </ControlBox>
        <ControlBox title="Download Count">
          <template #hint>
            <p>
              Configure how the download count will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="downloads.x"
              :y="downloads.y"
              :fontSize="downloads.font_size"
              :bold="downloads.bold"
              :textAlign="downloads.text_align"
              :font="downloads.font"
              @update="handleFieldUpdate"
              namespace="downloads"
            />
          </template>
        </ControlBox>
        <ControlBox title="Price">
          <template #hint>
            <p>
              Configure how the price (if the resource is premium) will display
              in the generated banner.
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UtilityMethods from '~/mixins/utility_methods'
import GeneratorParamMixin from '~/mixins/generator/generator_param_mixin'
import ControlBox from '~/components/ControlBox'
import ImageTextFieldOptions from '~/components/ImageTextFieldOptions'

export default {
  name: 'SpigotResourceGenerator',
  components: { ControlBox, ImageTextFieldOptions },
  mixins: [UtilityMethods, GeneratorParamMixin],
  data() {
    return {
      resource: {
        id: undefined,
        invalid: false
      },
      template: 'MOONLIGHT_PURPLE',
      logo: {
        size: 80,
        x: 12
      },
      resource_name: {
        x: 104,
        y: 25,
        font_size: 18,
        bold: true,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO',
        display: ''
      },
      author_name: {
        x: 104,
        y: 42,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      },
      reviews: {
        x: 104,
        y: 62,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      },
      stars: {
        x: 180,
        y: 51,
        gap: 16.0
      },
      downloads: {
        x: 104,
        y: 83,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      },
      price: {
        x: 210,
        y: 83,
        font_size: 14,
        bold: true,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      }
    }
  },
  computed: {
    ...mapState({
      templates: (state) => state.svc.templates,
      defaults: (state) => state.svc.defaults.resource
    }),
    templateOptions() {
      return this.makeSelectable(this.templates)
    },
    baseURL() {
      if (!this.resource.id) return '#'
      return `${this.$axios.defaults.baseURL}banner/resource/spigot/${this.resource.id}/banner.png`
    }
  },
  methods: {
    handleFieldUpdate(payload) {
      this[payload.namespace][payload.key] = payload.value
    },
    async checkValidResource(resId) {
      this.resource.id = undefined
      this.resource.invalid = false
      const valid = await this.$store.dispatch(
        'checkValidSpigotResource',
        resId
      )
      if (valid) {
        this.resource.id = resId
      } else {
        this.resource.invalid = true
      }
    },
    cleanupModifiedParams(copy) {
      delete copy.resource

      if (!copy.resource_name.display) {
        copy.resource_name.display = 'UNSET'
      }

      return copy
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

.result_box {
  margin-bottom: 10px;

  .col-12 {
    margin-bottom: 5px;
  }
}
</style>
