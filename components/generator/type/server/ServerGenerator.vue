<template>
  <div>
    <form-wizard
      @on-loading="setLoading"
      @on-complete="handleComplete"
      title="Banner Creator"
      subtitle="Create a Minecraft Server Banner"
      shape="tab"
      color="#4299e1"
      error-color="#ec4e20"
    >
      <tab-content :before-change="checkValidServer" title="Server Details">
        <GeneratorPreCheck
          :loading="loading"
          :error-message="server.error"
          loading-message="One sec...we're just checking that server."
        >
          <ServerGeneratorStepOne @update="updateServerDetails" />
        </GeneratorPreCheck>
      </tab-content>
      <tab-content title="Configure Banner">
        <b-card no-body>
          <b-tabs pills card vertical>
            <GeneratorPreview :bannerURL="bannerURL" />
            <b-tab title="Background">
              <BannerSelectControlBox
                :default="template"
                :options="templateOptions"
                @update="(newTemplate) => (template = newTemplate)"
                title="Background"
                hint="Choose the background for your banner."
              />
            </b-tab>
            <b-tab title="Server Logo">
              <ControlBox title="Server Logo">
                <template #hint>
                  <p>
                    Configure how the server logo will display in the generated
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
            <b-tab title="Server Name">
              <BannerTextFieldControlBox
                :target="server_name"
                @update="handleFieldUpdate"
                title="Server Name"
                namespace="server_name"
              >
                <template #hint>
                  <p>
                    Configure how the server name will display in the generated
                    banner.
                  </p>
                  <p>
                    <small
                      >* If your servers's name is too long for the image, set a
                      <strong>Text Override</strong>.</small
                    >
                  </p>
                </template>
                <template #ext_bot_controls>
                  <b-input-group prepend="Text Override">
                    <b-input
                      v-model="server_name.display"
                      type="text"
                      placeholder="No Override Set"
                    ></b-input>
                  </b-input-group>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Version">
              <BannerTextFieldControlBox
                :target="version"
                @update="handleFieldUpdate"
                title="Version"
                namespace="version"
              >
                <template #hint>
                  <p>
                    Configure how the server version will display in the
                    generated banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="MOTD">
              <BannerTextFieldControlBox
                :target="motd"
                @update="handleFieldUpdate"
                title="MOTD"
                namespace="motd"
              >
                <template #hint>
                  <p>
                    Configure how the server MOTD will display in the generated
                    banner.
                  </p>
                </template>
                <template #ext_top_controls>
                  <b-input-group prepend="Show?">
                    <b-select
                      v-model="motd.enable"
                      :options="[
                        { value: true, text: 'Yes' },
                        { value: false, text: 'No' }
                      ]"
                    />
                  </b-input-group>
                </template>
                <template #ext_bot_controls>
                  <b-input-group prepend="Max Characters">
                    <b-input v-model.number="motd.max_chars" type="number" />
                  </b-input-group>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
            <b-tab title="Player Count">
              <BannerTextFieldControlBox
                :target="players"
                @update="handleFieldUpdate"
                title="Player Count"
                namespace="players"
              >
                <template #hint>
                  <p>
                    Configure how the player count will display in the generated
                    banner.
                  </p>
                </template>
              </BannerTextFieldControlBox>
            </b-tab>
          </b-tabs>
        </b-card>
      </tab-content>
    </form-wizard>

    <CopyURLModal :bannerURL="savedBannerURL" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UtilityMethods from '~/mixins/utility_methods'
import GeneratorParamMixin from '~/mixins/generator/generator_param_mixin'
import SaveBannerMixin from '~/mixins/generator/save_banner_mixin'
import LoadingMixin from '~/mixins/loading_mixin'
import GeneratorPreCheck from '~/components/generator/GeneratorPreCheck'
import ServerGeneratorStepOne from '~/components/generator/type/server/steps/ServerGeneratorStepOne'
import GeneratorPreview from '~/components/generator/GeneratorPreview'
import ControlBox from '~/components/generator/control/ControlBox'
import BannerSelectControlBox from '~/components/generator/control/BannerSelectControlBox'
import BannerTextFieldControlBox from '~/components/generator/control/BannerTextFieldControlBox'
import CopyURLModal from '~/components/flow/CopyURLModal'

export default {
  name: 'ServerGenerator',
  components: {
    GeneratorPreCheck,
    ControlBox,
    ServerGeneratorStepOne,
    GeneratorPreview,
    BannerSelectControlBox,
    BannerTextFieldControlBox,
    CopyURLModal
  },
  mixins: [UtilityMethods, GeneratorParamMixin, SaveBannerMixin, LoadingMixin],
  data() {
    return {
      server: {
        ip: undefined,
        port: 25565,
        error: ''
      },
      template: 'MOONLIGHT_PURPLE',
      logo: {
        x: 12,
        size: 80
      },
      server_name: {
        bold: true,
        display: '',
        font_face: 'SOURCE_SANS_PRO',
        font_size: 18,
        text_align: 'LEFT',
        x: 104,
        y: 22
      },
      version: {
        bold: false,
        font_face: 'SOURCE_SANS_PRO',
        font_size: 14,
        text_align: 'LEFT',
        x: 104,
        y: 38
      },
      motd: {
        enable: true,
        max_chars: 9999,
        bold: false,
        font_face: 'SOURCE_SANS_PRO',
        font_size: 14,
        text_align: 'LEFT',
        x: 104,
        y: 55
      },
      players: {
        bold: false,
        font_face: 'SOURCE_SANS_PRO',
        font_size: 14,
        text_align: 'LEFT',
        x: 104,
        y: 85
      }
    }
  },
  computed: {
    ...mapState({
      templates: (state) => state.svc.templates,
      defaults: (state) => state.svc.defaults.server
    }),
    templateOptions() {
      return this.makeSelectable(this.templates)
    },
    baseURL() {
      return this.generateBannerUrl('server', {
        ip: this.server.ip,
        port: this.server.port
      })
    }
  },
  methods: {
    handleFieldUpdate(payload) {
      this[payload.namespace][payload.key] = payload.value
    },
    cleanupModifiedParams(copy) {
      delete copy.loading
      delete copy.server

      if (!copy.server_name.display) {
        copy.server_name.display = ''
      }

      return copy
    },
    updateServerDetails(payload) {
      if (payload.tempIP) {
        this.server.ip = payload.tempIP
      }

      if (payload.tempPort && !isNaN(this.tempPort)) {
        this.server.port = payload.tempPort
      }
    },
    checkValidServer() {
      return new Promise(async (resolve, reject) => {
        this.server.error = ''
        const { ip, port } = this.server

        if (!ip) {
          this.server.error =
            "Please enter an IP address and port. You can leave the port empty if you're using 25565."
          return resolve(false)
        }

        const valid = await this.$store.dispatch('checkValidServer', {
          ip,
          port
        })

        if (valid) {
          return resolve(true)
        } else {
          this.server.error =
            "That doesn't seem to a valid server IP. Please double check it."
          return resolve(false)
        }
      })
    },
    async handleComplete() {
      this.loading = true
      await this.saveServerBanner()
      this.loading = false
      this.$bvModal.show('copy-url-modal')
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
