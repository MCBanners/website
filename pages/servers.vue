<template>
  <b-container>
    <ServerGenerator />
  </b-container>
</template>

<script>
import ServerGenerator from '~/components/generator/type/server/ServerGenerator'

export default {
  components: { ServerGenerator },
  head({ $seo }) {
    return $seo({
      title: 'Server Banners',
    })
  },
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
