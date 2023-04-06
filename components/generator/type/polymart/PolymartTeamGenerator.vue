<template>
  <div>
    <form-wizard
      title="Banner Creator"
      subtitle="Create a Polymart Team Banner"
      shape="tab"
      color="#4299e1"
      error-color="#ec4e20"
      @on-loading="setLoading"
      @on-complete="handleComplete"
    >
      <tab-content :before-change="checkValidTeam" title="Team Details">
        <GeneratorPreCheck
          :loading="loading"
          :error-message="team.error"
          loading-message="One sec...we're just checking that team."
        >
          <TeamGeneratorStepOne type="polymart" @update="updateTeamDetails" />
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
            <b-tab title="Team Logo">
              <ControlBox title="Team Logo">
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
            <b-tab title="Team Name">
              <BannerTextFieldControlBox
                :target="team_name"
                title="Team Name"
                namespace="team_name"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the team name will display in the generated
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
            <b-tab title="Ratings Count">
              <BannerTextFieldControlBox
                :target="ratings"
                title="Ratings Count"
                namespace="ratings"
                @update="handleFieldUpdate"
              >
                <template #hint>
                  <p>
                    Configure how the ratings count will display in the
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
import TeamGeneratorStepOne from '~/components/generator/type/team/steps/TeamGeneratorStepOne'
import CopyURLModal from '~/components/flow/CopyURLModal'

export default {
  name: 'PolymartTeamGenerator',
  components: {
    GeneratorPreCheck,
    GeneratorPreview,
    ControlBox,
    BannerSelectControlBox,
    BannerTextFieldControlBox,
    TeamGeneratorStepOne,
    CopyURLModal,
  },
  mixins: [UtilityMethods, GeneratorParamMixin, SaveBannerMixin, LoadingMixin],
  data() {
    return {
      team: {
        id: undefined,
        error: '',
      },
      background: {
        template: 'MOONLIGHT_PURPLE',
      },
      logo: {
        size: 80,
        x: 12,
      },
      team_name: {
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
      downloads: {
        x: 104,
        y: 72,
        font_size: 14,
        font_bold: false,
        text_align: 'LEFT',
        font_face: 'SOURCE_SANS_PRO',
      },
      ratings: {
        x: 104,
        y: 89,
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
      defaults: (state) => state.svc.defaults.team,
    }),
    templateOptions() {
      return this.makeSelectable(this.templates)
    },
    baseURL() {
      return this.generateBannerUrl('team-polymart', {
        id: this.team.id,
      })
    },
  },
  methods: {
    handleFieldUpdate(payload) {
      this[payload.namespace][payload.key] = payload.value
    },
    cleanupModifiedParams(copy) {
      delete copy.team
      return copy
    },
    updateTeamDetails(payload) {
      this.team.id = payload.subject
    },
    async checkValidTeam() {
      this.team.error = ''
      const { id } = this.team

      if (!id) {
        this.team.error = 'Please enter a Polymart Team ID.'
        return false
      }

      const valid = await this.$store.dispatch('checkValidPolymartTeam', id)

      if (valid.state) {
        return true
      } else {
        this.team.error =
          "That doesn't seem to a valid Polymart Team ID. Please double check it."
        return false
      }
    },
    async handleComplete() {
      this.loading = true
      await this.savePolymartTeamBanner()
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
