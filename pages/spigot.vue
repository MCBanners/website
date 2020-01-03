<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div class="generator">
      <div v-if="module.selected == 0">
        <SpigotResourceGenerator />
      </div>

      <div v-else>
        <SpigotAuthorGenerator />
      </div>
    </div>
  </b-container>
</template>

<script>
import SpigotResourceGenerator from '~/components/SpigotResourceGenerator'
import SpigotAuthorGenerator from '~/components/SpigotAuthorGenerator'

export default {
  components: { SpigotResourceGenerator, SpigotAuthorGenerator },
  data() {
    return {
      module: {
        selected: 0,
        options: [
          { value: 0, text: 'Resource Banner' },
          { value: 1, text: 'Author Banner' }
        ]
      }
    }
  },
  asyncData(ctx) {
    ctx.seo({
      name: 'MCBanners',
      title: 'SpigotMC Banners',
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
