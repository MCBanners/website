<template>
  <b-row>
    <b-col cols="12">
      <p>
        Enter the Team {{ subjectName }} that you want to generate a banner for.
      </p>
    </b-col>
    <b-col cols="12">
      <b-input-group :prepend="'Team ' + subjectName">
        <b-form-input
          v-model="subject"
          :type="'number'"
          @change="$emit('update', { subject })"
        />
      </b-input-group>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'TeamGeneratorStepOne',
  data() {
    return {
      subject: undefined,
    }
  },
  computed: {
    subjectName() {
      return 'ID'
    },
  },
}
</script>
