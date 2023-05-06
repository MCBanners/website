<template>
  <b-row>
    <b-col cols="12">
      <p>
        Hangar requires the author username and resource name to generate a
        banner.
      </p>
    </b-col>
    <b-col cols="12">
      <b-input-group prepend="Author Username">
        <b-form-input v-model="author" type="text" @change="updateFields" />
      </b-input-group>
      <b-input-group prepend="Resource Name">
        <b-form-input v-model="resource" type="text" @change="updateFields" />
      </b-input-group>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'HangarGeneratorStepOne',
  data() {
    return {
      author: '',
      resource: '',
    }
  },
  computed: {
    canUpdate() {
      return this.author && this.resource
    },
  },
  methods: {
    updateFields() {
      if (this.canUpdate) {
        this.$emit('update', { author: this.author, resource: this.resource })
      }
    },
  },
}
</script>
