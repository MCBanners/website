<template>
  <div>
    <div v-if="loading" class="text-center">
      <b-spinner
        type="grow"
        style="width: 6rem; height: 6rem;"
        variant="primary"
      />
      <p>{{ loadingMessage }}</p>
    </div>
    <div v-else>
      <p v-if="errorMessage" class="text-danger font-weight-bold text-center">
        {{ errorMessage }}
      </p>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeneratorPreCheck',
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    loadingMessage: {
      type: String,
      required: true
    },
    errorMessage: {
      type: String,
      required: true
    }
  }
}
</script>
