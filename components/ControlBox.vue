<template>
  <b-card header-tag="header" bg-variant="secondary" text-variant="dark">
    <template #header>
      <h6 class="mb-0 text-center">{{ title }}</h6>
    </template>
    <b-row>
      <b-col cols="12" md="4">
        <slot name="hint"></slot>
      </b-col>
      <b-col cols="12" md="8">
        <slot name="controls"></slot>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'ControlBox',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin: 0 0 10px 0;
}
</style>
