<template>
  <div>
    <form-wizard
      title="Banner Creator"
      subtitle="Create a Sponge Author Banner"
      shape="tab"
      color="#4299e1"
      error-color="#ec4e20"
      @on-loading="setLoading"
      @on-complete="handleComplete"
    >
      <tab-content :before-change="checkValidAuthor" title="Author Details">
        <GeneratorPreCheck
          :loading="loading"
          :error-message="author.error"
          loading-message="One sec...we're just checking that author."
        >
          <AuthorGeneratorStepOne type="sponge" @update="updateAuthorDetails" />
        </GeneratorPreCheck>
      </tab-content>
      <tab-content title="Configure Banner">
        <b-card no-body>
          <b-tabs pills card vertical>
            <GeneratorPreview :banner-u-r-l="bannerURL" />
            <b-tab title="Background">
              <BannerSelectControlBox
                :default="background.template"
                :options="templateOptions"
                title="Background"
                hint="Choose the background for your banner."
                @update="(newTemplate) => (background.template = newTemplate)"
              />
            </b-tab>
            <b-tab title="Author Logo">
              <ControlBox title="Author Logo">
                <template #hint>
                  <p>
                    Configure how the resource logo will display in the
                    generated banner.
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
            </b-tab>
            <b-tab title="Author Name">
              <BannerTextFieldControlBox
                :target="author_name"
                title="Author Name"
                namespace="author_name"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the author name will display in the generated
                    banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Resource Count">
              <BannerTextFieldControlBox
                :target="resource_count"
                title="Resource Count"
                namespace="resource_count"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the resource count will display in the
                    generated banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Likes Count">
              <BannerTextFieldControlBox
                :target="likes"
                title="Likes Count"
                namespace="likes"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the likes count will display in the generated
                    banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Download Count">
              <BannerTextFieldControlBox
                :target="downloads"
                title="Download Count"
                namespace="downloads"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the download count will display in the
                    generated banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
          </b-tabs>
        </b-card>
      </tab-content>
    </form-wizard>

    <CopyURLModal :banner-u-r-l="savedBannerURL" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UtilityMethods from '~/mixins/utility_methods'
import GeneratorParamMixin from '~/mixins/generator/generator_param_mixin'
import SaveBannerMixin from '~/mixins/generator/save_banner_mixin'
import LoadingMixin from '~/mixins/loading_mixin'
import GeneratorPreCheck from '~/components/generator/GeneratorPreCheck'
import GeneratorPreview from '~/components/generator/GeneratorPreview'
import ControlBox from '~/components/generator/control/ControlBox'
import BannerSelectControlBox from '~/components/generator/control/BannerSelectControlBox'
import BannerTextFieldControlBox from '~/components/generator/control/BannerTextFieldControlBox'
import AuthorGeneratorStepOne from '~/components/generator/type/author/steps/AuthorGeneratorStepOne'
import CopyURLModal from '~/components/flow/CopyURLModal'

export default {
  name: 'SpongeAuthorGenerator',
  components: {
    GeneratorPreCheck,
    GeneratorPreview,
    ControlBox,
    BannerSelectControlBox,
    BannerTextFieldControlBox,
    AuthorGeneratorStepOne,
    CopyURLModal,
  },
  mixins: [UtilityMethods, GeneratorParamMixin, SaveBannerMixin, LoadingMixin],
  data() {
    return {
      author: {
        username: '',
        error: '',
      },
      background: {
        template: 'MOONLIGHT_PURPLE',
      },
      logo: {
        size: 80,
        x: 12,
      },
      author_name: {
        x: 104,
        y: 22,
        font_size: 18,
        font_bold: true,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
      resource_count: {
        x: 104,
        y: 38,
        font_size: 14,
        font_bold: false,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
      likes: {
        x: 104,
        y: 55,
        font_size: 14,
        font_bold: false,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
      downloads: {
        x: 104,
        y: 72,
        font_size: 14,
        font_bold: false,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
    }
  },
  computed: {
    ...mapState({
      templates: (state) => state.svc.templates,
      defaults: (state) => state.svc.defaults.author,
    }),
    templateOptions() {
      return this.makeSelectable(this.templates)
    },
    baseURL() {
      return this.generateBannerUrl('author-sponge', {
        id: this.author.username,
      })
    },
  },
  methods: {
    handleFieldUpdate(payload) {
      this[payload.namespace][payload.key] = payload.value
    },
    cleanupModifiedParams(copy) {
      delete copy.author
      return copy
    },
    updateAuthorDetails(payload) {
      this.author.username = payload.subject
    },
    async checkValidAuthor() {
      this.author.error = ''
      const { username } = this.author

      if (!username) {
        this.author.error = 'Please enter a Sponge Author Username.'
        return false
      }

      const valid = await this.$store.dispatch(
        'checkValidSpongeAuthor',
        username
      )

      if (valid.state) {
        return true
      } else {
        this.author.error =
          "That doesn't seem to a valid Sponge Author Username. Please double check it."
        return false
      }
    },
    async handleComplete() {
      this.loading = true
      await this.saveSpongeAuthorBanner()
      this.loading = false
      this.$bvModal.show('copy-url-modal')
    },
  },
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
