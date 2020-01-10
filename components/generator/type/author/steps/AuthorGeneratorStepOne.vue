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
          @change="$emit('update', { subject })"
          v-model="subject"
          :type="subjectName === 'spigot' ? 'number' : 'text'"
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
      required: true
    }
  },
  data() {
    return {
      subject: undefined
    }
  },
  computed: {
    subjectName() {
      if (this.type === 'spigot') {
        return 'ID'
      } else if (this.type === 'sponge') {
        return 'Username'
      } else {
        return 'unknown'
      }
    }
  }
}
</script>
