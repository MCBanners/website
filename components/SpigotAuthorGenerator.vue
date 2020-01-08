<template>
  <div>
    <b-row>
      <b-col cols="12">
        <ControlBox title="Author ID">
          <template #hint>
            <p>Enter the author ID that you want to generate a banner for.</p>
            <p v-if="author.invalid" class="text-danger">
              The author ID you entered does not refer to a valid author at
              Spigot.
            </p>
          </template>
          <template #controls>
            <b-input-group prepend="Author ID">
              <b-form-input @change="checkValidAuthor" type="number" />
            </b-input-group>
          </template>
        </ControlBox>
      </b-col>
    </b-row>
    <div v-if="author.id">
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
                <b-input
                  :value="
                    Object.keys(modifiedParams).length
                      ? Object.keys(banner_save.result).length
                        ? savedBannerURL
                        : 'Save to see URL'
                      : bannerURL
                  "
                  type="text"
                />
                <b-button
                  v-if="Object.keys(modifiedParams).length"
                  @click.prevent="saveSpigotAuthorBanner()"
                  :disabled="banner_save.working"
                  variant="primary"
                >
                  <span v-if="banner_save.working">
                    Saving banner... <b-spinner size="sm" />
                  </span>
                  <span v-else>
                    Save banner
                  </span>
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
        <ControlBox title="Author Logo">
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
        <ControlBox title="Author Name">
          <template #hint>
            <p>
              Configure how the resource name will display in the generated
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
        <ControlBox title="Resource Count">
          <template #hint>
            <p>
              Configure how the resource count will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="resource_count.x"
              :y="resource_count.y"
              :fontSize="resource_count.font_size"
              :bold="resource_count.bold"
              :textAlign="resource_count.text_align"
              :font="resource_count.font"
              @update="handleFieldUpdate"
              namespace="resource_count"
            />
          </template>
        </ControlBox>
        <ControlBox title="Likes Count">
          <template #hint>
            <p>
              Configure how the like count will display in the generated banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="likes.x"
              :y="likes.y"
              :fontSize="likes.font_size"
              :bold="likes.bold"
              :textAlign="likes.text_align"
              :font="likes.font"
              @update="handleFieldUpdate"
              namespace="likes"
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
      </b-card-group>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UtilityMethods from '~/mixins/utility_methods'
import GeneratorParamMixin from '~/mixins/generator/generator_param_mixin'
import SaveBannerMixin from '~/mixins/generator/save_banner_mixin'
import ControlBox from '~/components/ControlBox'
import ImageTextFieldOptions from '~/components/ImageTextFieldOptions'

export default {
  name: 'SpigotAuthorGenerator',
  components: { ControlBox, ImageTextFieldOptions },
  mixins: [UtilityMethods, GeneratorParamMixin, SaveBannerMixin],
  data() {
    return {
      author: {
        id: undefined,
        invalid: false
      },
      template: 'MOONLIGHT_PURPLE',
      logo: {
        size: 80,
        x: 12
      },
      author_name: {
        x: 104,
        y: 22,
        font_size: 18,
        bold: true,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      },
      resource_count: {
        x: 104,
        y: 38,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      },
      likes: {
        x: 104,
        y: 55,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      },
      downloads: {
        x: 104,
        y: 72,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      },
      reviews: {
        x: 104,
        y: 89,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font: 'SOURCE_SANS_PRO'
      }
    }
  },
  computed: {
    ...mapState({
      templates: (state) => state.svc.templates,
      defaults: (state) => state.svc.defaults.author
    }),
    templateOptions() {
      return this.makeSelectable(this.templates)
    },
    baseURL() {
      if (!this.author.id) return '#'
      return `${this.$axios.defaults.baseURL}banner/author/spigot/${this.author.id}/banner.png`
    }
  },
  methods: {
    handleFieldUpdate(payload) {
      this[payload.namespace][payload.key] = payload.value
    },
    async checkValidAuthor(authId) {
      this.author.id = undefined
      this.author.invalid = false
      const valid = await this.$store.dispatch('checkValidSpigotAuthor', authId)
      if (valid) {
        this.author.id = authId
      } else {
        this.author.invalid = true
      }
    },
    cleanupModifiedParams(copy) {
      delete copy.author
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
