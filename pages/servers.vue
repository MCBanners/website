<template>
  <div>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div class="container">
      <div v-if="module.selected == 0">
        <ServerGenerator />
      </div>
    </div>
  </div>
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
