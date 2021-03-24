<template>
  <b-row>
    <b-col cols="12">
      <p>
        Enter the Resource {{ subjectName }} that you want to generate a banner
        for.
      </p>
    </b-col>
    <b-col cols="12">
      <b-input-group :prepend="'Resource ' + subjectName">
        <b-form-input
          v-model="subject"
          :type="subjectName === 'spigot' ? 'number' : 'text'"
          @change="$emit('update', { subject })"
        />
      </b-input-group>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'ResourceGeneratorStepOne',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      subject: undefined,
    }
  },
  computed: {
    subjectName() {
      if (this.type === 'spigot') {
        return 'ID'
      } else if (this.type === 'sponge') {
        return 'Name'
      } else {
        return 'unknown'
      }
    },
  },
}
</script>
