<template>
  <b-row>
    <b-col cols="12">
      <p>
        Enter the Author {{ subjectName }} that you want to generate a banner
        for.
      </p>
    </b-col>
    <b-col cols="12">
      <b-input-group :prepend="'Author ' + subjectName">
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
  name: 'AuthorGeneratorStepOne',
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
      if (this.type === 'spigot' || this.type === 'polymart') {
        return 'ID'
      } else if (this.type === 'sponge' || this.type === 'curseforge') {
        return 'Username'
      } else {
        return 'unknown'
      }
    },
  },
}
</script>
