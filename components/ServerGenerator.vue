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
                  v-model="tempIP"
                ></b-form-input>
              </b-input-group>
              <b-input-group prepend="Server Port" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input
                  id="inline-form-input-port"
                  v-model="tempPort"
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
        <ControlBox title="Server Logo">
          <template #hint>
            <p>
              Configure how the server logo will display in the generated
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
              :x="serv_name.x"
              :y="serv_name.y"
              :fontSize="serv_name.font_size"
              :bold="serv_name.bold"
              :textAlign="serv_name.text_align"
              :font="serv_name.font"
              @update="handleFieldUpdate"
              namespace="serv_name"
            />
            <b-input-group prepend="Text Override">
              <b-input
                v-model="serv_name.display"
                type="text"
                placeholder="No Override Set"
              />
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
              :x="ver_name.x"
              :y="ver_name.y"
              :fontSize="ver_name.font_size"
              :bold="ver_name.bold"
              :textAlign="ver_name.text_align"
              :font="ver_name.font"
              @update="handleFieldUpdate"
              namespace="ver_name"
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
              :x="player_count.x"
              :y="player_count.y"
              :fontSize="player_count.font_size"
              :bold="player_count.bold"
              :textAlign="player_count.text_align"
              :font="player_count.font"
              @update="handleFieldUpdate"
              namespace="player_count"
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
  name: 'ServerGenerator',
  components: { ControlBox, ImageTextFieldOptions },
  mixins: [UtilityMethods],
  data() {
    return {
      server: {
        ip: undefined,
        port: undefined,
        invalid: false
      },
      tempIP: null,
      tempPort: null,
      template: 'moonlight_purple',
      logo: {
        size: 80,
        x: 12
      },
      serv_name: {
        x: 104,
        y: 22,
        font_size: 18,
        bold: true,
        text_align: 'left',
        font: 'source_sans_pro',
        display: undefined
      },
      ver_name: {
        x: 104,
        y: 38,
        font_size: 14,
        bold: false,
        text_align: 'left',
        font: 'source_sans_pro'
      },
      motd_name: {
        x: 104,
        y: 55,
        font_size: 14,
        bold: false,
        text_align: 'left',
        font: 'source_sans_pro'
      },
      player_count: {
        x: 104,
        y: 85,
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
      if (!this.server) return
      return `${this.$axios.defaults.baseURL}banner/server/${this.server.ip}/${this.server.port}/banner.png`
    },
    bannerURLParams() {
      let params = `?template=${this.template}&logo_size=${this.logo.size}&logo_x=${this.logo.x}&serv_name_x=${this.serv_name.x}
        &serv_name_y=${this.serv_name.y}&serv_name_font_size=${this.serv_name.font_size}&serv_name_bold=${this.serv_name.bold}
        &serv_name_text_align=${this.serv_name.text_align}&serv_name_font_face=${this.serv_name.font}&ver_name_x=${this.ver_name.x}
        &ver_name_y=${this.ver_name.y}&ver_name_font_size=${this.ver_name.font_size}&ver_name_bold=${this.ver_name.bold}
        &ver_name_text_align=${this.ver_name.text_align}&ver_name_font_face=${this.ver_name.font}&motd_name_x=${this.motd_name.x}
        &motd_name_y=${this.motd_name.y}&motd_name_font_size=${this.motd_name.font_size}&motd_name_bold=${this.motd_name.bold}
        &motd_name_text_align=${this.motd_name.text_align}&motd_name_font_face=${this.motd_name.font}&player_count_x=${this.player_count.x}
        &player_count_y=${this.player_count.y}&player_count_font_size=${this.player_count.font_size}&player_count_bold=${this.player_count.bold}
        &player_count_text_align=${this.player_count.text_align}&player_count_font_face=${this.player_count.font}`

      if (this.serv_name.display) {
        params += `&serv_name_display=${this.serv_name.display}`
      }

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
    async checkValidServer(ip, port) {
      this.server.ip = undefined
      this.server.port = undefined
      this.server.invalid = false
      ip = this.tempIP
      if (!this.tempPort || isNaN(this.tempPort)) {
        port = 25565
      } else {
        port = this.tempPort
      }
      const valid = await this.$store.dispatch('checkValidServer', { ip, port })
      if (valid) {
        this.server.ip = ip
        this.server.port = port
      } else {
        this.server.invalid = true
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
