<template>
  <b-container>
    <ServerGenerator />
  </b-container>
</template>

<script>
import ServerGenerator from '~/components/generator/type/server/ServerGenerator'

export default {
  components: { ServerGenerator },
  head() {
    return this.$seo({
      name: 'MCBanners',
      title: 'Server Banners',
      templateTitle: '%name% - %title%',
    })
  },
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
