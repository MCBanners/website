<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div v-if="module.selected == 0" class="generator">
      <ServerGenerator />
    </div>
  </b-container>
</template>

<script>
import ServerGenerator from '~/components/ServerGenerator'

export default {
  components: { ServerGenerator },
  data() {
    return {
      module: {
        selected: 0,
        options: [{ value: 0, text: 'Server Banner' }]
      }
    }
  },
  asyncData(ctx) {
    ctx.seo({
      name: 'MCBanners',
      title: 'Server Banners',
      templateTitle: '%name% - %title%'
    })
  }
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
