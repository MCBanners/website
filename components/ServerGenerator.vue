<template>
  <div>
    <b-row>
      <b-col cols="12">
        <ControlBox title="Server IP">
          <template #hint>
            <p>
              Enter the IP of your server in the "Server IP" box. If you are
              <b>not</b> using the default port (25565) you can leave the
              "Server Port" box blank.
            </p>
            <p v-if="server.invalid" class="text-danger">
              The Server IP provided does not seem to exist.
            </p>
          </template>
          <template #controls>
            <b-form inline>
              <b-input-group prepend="Server IP" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input
                  id="inline-form-input-ip"
                  v-model="server.tempIP"
                ></b-form-input>
              </b-input-group>
              <b-input-group prepend="Server Port" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input
                  id="inline-form-input-port"
                  v-model="server.tempPort"
                ></b-form-input>
              </b-input-group>
            </b-form>
            <br />
            <b-button @click="checkValidServer" variant="primary"
              >Check</b-button
            >
          </template>
        </ControlBox>
      </b-col>
    </b-row>
    <div v-if="server.ip">
      <b-row>
        <b-col cols="12" class="result_box">
          <b-card bg-variant="secondary" text-variant="dark">
            <template #header>
              <h6 class="mb-0 text-center">Preview</h6>
            </template>
            <b-row>
              <b-col cols="12" class="text-center">
                <img :src="bannerURL" width="300px" height="100px" />
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
                  @click.prevent="saveServerBanner()"
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
        <ControlBox title="Server Name">
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
          <template #controls>
            <ImageTextFieldOptions
              :x="server_name.x"
              :y="server_name.y"
              :fontSize="server_name.font_size"
              :bold="server_name.bold"
              :textAlign="server_name.text_align"
              :font="server_name.font_face"
              @update="handleFieldUpdate"
              namespace="server_name"
            />
            <b-input-group prepend="Text Override">
              <b-input
                v-model="server_name.display"
                type="text"
                placeholder="No Override Set"
              ></b-input>
            </b-input-group>
          </template>
        </ControlBox>
        <ControlBox title="Version Name">
          <template #hint>
            <p>
              Configure how the server version will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="version.x"
              :y="version.y"
              :fontSize="version.font_size"
              :bold="version.bold"
              :textAlign="version.text_align"
              :font="version.font_face"
              @update="handleFieldUpdate"
              namespace="version"
            />
          </template>
        </ControlBox>
        <ControlBox title="MOTD">
          <template #hint>
            <p>
              Configure how the server MOTD will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="motd.x"
              :y="motd.y"
              :fontSize="motd.font_size"
              :bold="motd.bold"
              :textAlign="motd.text_align"
              :font="motd.font_face"
              @update="handleFieldUpdate"
              namespace="motd"
            />
          </template>
        </ControlBox>
        <ControlBox title="Player Count">
          <template #hint>
            <p>
              Configure how the player count will display in the generated
              banner.
            </p>
          </template>
          <template #controls>
            <ImageTextFieldOptions
              :x="players.x"
              :y="players.y"
              :fontSize="players.font_size"
              :bold="players.bold"
              :textAlign="players.text_align"
              :font="players.font_face"
              @update="handleFieldUpdate"
              namespace="players"
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
  name: 'ServerGenerator',
  components: { ControlBox, ImageTextFieldOptions },
  mixins: [UtilityMethods, GeneratorParamMixin, SaveBannerMixin],
  data() {
    return {
      server: {
        tempIP: undefined,
        tempPort: undefined,
        ip: undefined,
        port: undefined,
        invalid: false
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
      return `${this.$axios.defaults.baseURL}banner/server/${this.server.ip}/${this.server.port}/banner.png`
    }
  },
  methods: {
    handleFieldUpdate(payload) {
      this[payload.namespace][payload.key] = payload.value
    },
    async checkValidServer(ip, port) {
      this.server.ip = undefined
      this.server.port = undefined
      this.server.invalid = false
      ip = this.server.tempIP
      if (!this.server.tempPort || isNaN(this.server.tempPort)) {
        port = 25565
      } else {
        port = this.server.tempPort
      }
      const valid = await this.$store.dispatch('checkValidServer', { ip, port })
      if (valid) {
        this.server.ip = ip
        this.server.port = port
      } else {
        this.server.invalid = true
      }
    },
    cleanupModifiedParams(copy) {
      delete copy.server
      delete copy.temp

      if (!copy.server_name.display) {
        copy.server_name.display = 'UNSET'
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
