<template>
  <b-container>
    <h1>Sign Up</h1>
  </b-container>
</template>

<script>
export default {
  middleware: 'unauthenticated',
  asyncData(ctx) {
    ctx.seo({
      name: 'MCBanners',
      title: 'Sign Up',
      templateTitle: '%name% - %title%'
    })
  }
}
</script>
