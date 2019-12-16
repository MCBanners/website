<template>
  <b-form>
    <b-row>
      <b-col cols="12" md="6">
        <b-card bg-variant="light">
          <b-form-group
            id="template_grp"
            label="Template"
            label-for="template"
            label-cols-lg="3"
            label-clase="font-weight-bold pt-0"
            class="mb-0"
          >
            <label for="template">Set the base template for your banner</label>
            <b-form-select
              id="template"
              v-model="template"
              :options="templateOptions"
            />
          </b-form-group>
        </b-card>
      </b-col>
      <b-col cols="12" md="6">
        <b-card bg-variant="light">
          <b-form-group
            id="logo_grp"
            label="Resource Logo"
            label-cols-lg="3"
            label-clase="font-weight-bold pt-0"
            class="mb-0"
          >
            <label for="logo_size">Set the size of the resource logo</label>
            <b-form-input id="logo_size" v-model="logo.size" type="number" />
            <label for="logo_x"
              >Set the initial x position of the resource logo</label
            >
            <b-form-input id="logo_x" v-model="logo.x" type="number" />
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" md="6">
        <b-card bg-variant="light">
          <b-form-group
            id="res_name_grp"
            label="Resource Name"
            label-cols-lg="3"
            label-clase="font-weight-bold pt-0"
            class="mb-0"
          >
            <label for="res_name_x"
              >Set the initial x position of the resource name</label
            >
            <b-form-input id="res_name_x" v-model="res_name.x" type="number" />
            <label for="res_name_y"
              >Set the initial y position of the resource name</label
            >
            <b-form-input id="res_name_y" v-model="res_name.y" type="number" />
            <label for="res_name_font_size"
              >Set the font size of the resource name</label
            >
            <b-form-input
              id="res_name_font_size"
              v-model="res_name.font_size"
              type="number"
            />
            <label for="res_name_bold"
              >Set whether or not to bold the resource name</label
            >
            <b-form-select
              id="res_name_bold"
              v-model="res_name.bold"
              :options="[
                { value: true, text: 'True' },
                { value: false, text: 'False' }
              ]"
            />
            <label for="res_name_font">Set the font of the resource name</label>
            <b-form-select
              id="res_name_font"
              v-model="res_name.font"
              :options="fontOptions"
            />
            <label for="res_name_x">Override the resource name</label>
            <b-form-input
              id="res_name_display"
              v-model="res_name.display"
              placeholder="If left blank, name from Spigot is used."
            />
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SpigotResourceGenerator',
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
      fonts: (state) => state.constants.fonts,
      templates: (state) => state.constants.templates,
      text_alignments: (state) => state.constants.text_alignments
    }),
    fontOptions() {
      return this.makeSelectable(this.fonts)
    },
    templateOptions() {
      return this.makeSelectable(this.templates)
    },
    textAlignmentOptions() {
      return this.makeSelectable(this.text_alignments)
    }
  },
  methods: {
    makeSelectable(obj) {
      return Object.keys(obj).map((key) => ({
        value: key,
        text: obj[key]
      }))
    }
  }
}
</script>

<style lang="scss" scoped></style>
