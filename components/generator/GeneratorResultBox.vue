<template>
  <b-row>
    <b-col cols="12" class="result_box text-center">
      <h2>Preview</h2>
      <img :src="bannerURL" />
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'GeneratorResultBox',
  props: {
    bannerURL: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.result_box {
  margin-bottom: 10px;

  .col-12 {
    margin-bottom: 5px;
  }
}
</style>
