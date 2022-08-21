<template>
  <div>
    <form-wizard
      title="Banner Creator"
      subtitle="Create a BuiltByBit Member Banner"
      shape="tab"
      color="#4299e1"
      error-color="#ec4e20"
      @on-loading="setLoading"
      @on-complete="handleComplete"
    >
      <tab-content :before-change="checkValidMember" title="Member Details">
        <GeneratorPreCheck
          :loading="loading"
          :error-message="member.error"
          loading-message="One sec...we're just checking that member."
        >
          <MemberGeneratorStepOne @update="updateMemberDetails" />
        </GeneratorPreCheck>
      </tab-content>
      <tab-content title="Configure Banner">
        <b-card no-body>
          <b-tabs pills card vertical>
            <GeneratorPreview :banner-u-r-l="bannerURL" />
            <b-tab title="Background">
              <BannerSelectControlBox
                :default="template"
                :options="templateOptions"
                title="Background"
                hint="Choose the background for your banner."
                @update="(newTemplate) => (template = newTemplate)"
              />
            </b-tab>
            <b-tab title="Member Logo">
              <ControlBox title="Member Logo">
                <template #hint>
                  <p>
                    Configure how the member logo will display in the generated
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
            </b-tab>
            <b-tab title="Member Name">
              <BannerTextFieldControlBox
                :target="member_name"
                title="Member Name"
                namespace="member_name"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the member name will display in the generated
                    banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Rank">
              <BannerTextFieldControlBox
                :target="rank"
                title="Rank"
                namespace="rank"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the rank will display in the generated banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Join Date">
              <BannerTextFieldControlBox
                :target="joined"
                title="Join Date"
                namespace="joined"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the join date will display in the generated
                    banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Posts Count">
              <BannerTextFieldControlBox
                :target="posts"
                title="Posts Count"
                namespace="posts"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the amount of posts will display in the
                    generated banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Feedback Count">
              <BannerTextFieldControlBox
                :target="likes"
                title="Feedback Count"
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
import MemberGeneratorStepOne from '~/components/generator/type/member/steps/MemberGeneratorStepOne'
import CopyURLModal from '~/components/flow/CopyURLModal'

export default {
  name: 'BuiltByBitGenerator',
  components: {
    GeneratorPreCheck,
    GeneratorPreview,
    ControlBox,
    BannerSelectControlBox,
    BannerTextFieldControlBox,
    MemberGeneratorStepOne,
    CopyURLModal,
  },
  mixins: [UtilityMethods, GeneratorParamMixin, SaveBannerMixin, LoadingMixin],
  data() {
    return {
      member: {
        id: undefined,
        error: '',
      },
      template: 'MOONLIGHT_PURPLE',
      logo: {
        size: 80,
        x: 12,
      },
      member_name: {
        x: 104,
        y: 22,
        font_size: 18,
        bold: true,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
      rank: {
        x: 104,
        y: 37,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
      joined: {
        x: 104,
        y: 55,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
      posts: {
        x: 104,
        y: 72,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
      likes: {
        x: 104,
        y: 89,
        font_size: 14,
        bold: false,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
    }
  },
  computed: {
    ...mapState({
      templates: (state) => state.svc.templates,
      defaults: (state) => state.svc.defaults.member,
    }),
    templateOptions() {
      return this.makeSelectable(this.templates)
    },
    baseURL() {
      return this.generateBannerUrl('member-builtbybit', {
        id: this.member.id,
      })
    },
  },
  methods: {
    handleFieldUpdate(payload) {
      this[payload.namespace][payload.key] = payload.value
    },
    cleanupModifiedParams(copy) {
      delete copy.member
      return copy
    },
    updateMemberDetails(payload) {
      this.member.id = payload.subject
    },
    async checkValidMember() {
      this.member.error = ''
      const { id } = this.member

      if (!id) {
        this.member.error = 'Please enter a BuiltByBit Member ID.'
        return false
      }

      const valid = await this.$store.dispatch('checkValidBuiltByBitMember', id)

      if (valid.state) {
        return true
      } else {
        this.member.error =
          "That doesn't seem to a valid BuiltByBit Member ID. Please double check it."
        return false
      }
    },
    async handleComplete() {
      this.loading = true
      await this.saveBuiltByBitMemberBanner()
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
</style>
