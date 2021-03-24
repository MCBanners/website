<template>
  <b-card header-tag="header" bg-variant="secondary" text-variant="dark">
    <template #header>
      <h6 class="mb-0 text-center">{{ title }}</h6>
    </template>
    <b-row>
      <b-col :md="hintMdCols" cols="12">
        <slot name="hint"></slot>
      </b-col>
      <b-col :md="controlsMdCols" cols="12">
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
      required: true,
    },
    hintMdCols: {
      type: String,
      default: '4',
    },
    controlsMdCols: {
      type: String,
      default: '8',
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  margin: 0 0 10px 0;
}
</style>
