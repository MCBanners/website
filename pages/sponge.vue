<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div class="generator">
      <div v-if="module.selected == 0">
        <SpongeResourceGenerator />
      </div>
      <div v-else>
        <SpongeAuthorGenerator />
      </div>
    </div>
  </b-container>
</template>

<script>
import SpongeResourceGenerator from '~/components/SpongeResourceGenerator'
import SpongeAuthorGenerator from '~/components/SpongeAuthorGenerator'

export default {
  components: { SpongeResourceGenerator, SpongeAuthorGenerator },
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
      title: 'SpongePowered Banners',
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
