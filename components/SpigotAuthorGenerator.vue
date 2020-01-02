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
              <b-col cols="8" class="mx-auto mt-3">
                <b-input-group prepend="URL">
                  <b-form-input :value="bannerURL" type="text" />
                </b-input-group>
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
              <b-form-input v-model="logo.size" type="number" />
            </b-input-group>
            <b-input-group prepend="X Offset" append="px">
              <b-form-input v-model="logo.x" type="number" />
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
        <ControlBox title="Resource Count">
          <template #hint>
            <p>
              Configure how the resource count will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="res_count.x"
              :y="res_count.y"
              :fontSize="res_count.font_size"
              :bold="res_count.bold"
              :textAlign="res_count.text_align"
              :font="res_count.font"
              @update="handleFieldUpdate"
              namespace="res_count"
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
              :x="likes_count.x"
              :y="likes_count.y"
              :fontSize="likes_count.font_size"
              :bold="likes_count.bold"
              :textAlign="likes_count.text_align"
              :font="likes_count.font"
              @update="handleFieldUpdate"
              namespace="likes_count"
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
        <ControlBox title="Download Count">
          <template #hint>
            <p>
              Configure how the download count will display in the generated
              banner.
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
      </b-card-group>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UtilityMethods from '~/mixins/utility_methods'
import ControlBox from '~/components/ControlBox'
import ImageTextFieldOptions from '~/components/ImageTextFieldOptions'

export default {
  name: 'SpigotAuthorGenerator',
  components: { ControlBox, ImageTextFieldOptions },
  mixins: [UtilityMethods],
  data() {
    return {
      author: {
        id: undefined,
        invalid: false
      },
      template: 'moonlight_purple',
      logo: {
        size: 80,
        x: 12
      },
      aut_name: {
        x: 104,
        y: 22,
        font_size: 18,
        bold: true,
        text_align: 'left',
        font: 'source_sans_pro'
      },
      res_count: {
        x: 104,
        y: 38,
        font_size: 14,
        bold: false,
        text_align: 'left',
        font: 'source_sans_pro',
        display: undefined
      },
      dl_count: {
        x: 104,
        y: 89,
        font_size: 14,
        bold: false,
        text_align: 'left',
        font: 'source_sans_pro'
      },
      likes_count: {
        x: 104,
        y: 55,
        font_size: 14,
        bold: false,
        text_align: 'left',
        font: 'source_sans_pro'
      },
      rev_count: {
        x: 104,
        y: 72,
        font_size: 14,
        bold: false,
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
    },
    bannerURLBase() {
      if (!this.author.id) return
      return `${this.$axios.defaults.baseURL}author/spigot/${this.author.id}/banner.png`
    },
    bannerURLParams() {
      const params = `?template=${this.template}&logo_size=${this.logo.size}&logo_x=${this.logo.x}&aut_name_x=${this.aut_name.x}
        &aut_name_y=${this.aut_name.y}&aut_name_font_size=${this.aut_name.font_size}&aut_name_bold=${this.aut_name.bold}
        &aut_name_text_align=${this.aut_name.text_align}&aut_name_font_face=${this.aut_name.font}&res_count_x=${this.res_count.x}
        &res_count_y=${this.res_count.y}&res_count_font_size=${this.res_count.font_size}&res_count_bold=${this.res_count.bold}
        &res_count_text_align=${this.res_count.text_align}&res_count_font_face=${this.res_count.font}&dl_count_x=${this.dl_count.x}&dl_count_y=${this.dl_count.y}
        &dl_count_font_size=${this.dl_count.font_size}&dl_count_bold=${this.dl_count.bold}&dl_count_text_align=${this.dl_count.text_align}
        &dl_count_font_face=${this.dl_count.font}&likes_count_x=${this.likes_count.x}
        &likes_count_y=${this.likes_count.y}&likes_count_font_size=${this.likes_count.font_size}&likes_count_bold=${this.likes_count.bold}
        &likes_count_text_align=${this.likes_count.text_align}&likes_count_font_face=${this.likes_count.font}&rev_count_x=${this.rev_count.x}
        &rev_count_y=${this.rev_count.y}&rev_count_font_size=${this.rev_count.font_size}&rev_count_bold=${this.rev_count.bold}
        &rev_count_text_align=${this.rev_count.text_align}&rev_count_font_face=${this.rev_count.font}`

      return params.replace(/\s+/g, '')
    },
    bannerURL() {
      return this.bannerURLBase + this.bannerURLParams
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
