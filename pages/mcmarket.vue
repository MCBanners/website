<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div class="generator">
      <div v-if="module.selected == 0">
        <MCMarketResourceGenerator />
      </div>

      <div v-else-if="module.selected == 1">
        <MCMarketAuthorGenerator />
      </div>

      <div v-else>
        <MCMarketMemberGenerator />
      </div>
    </div>
  </b-container>
</template>

<script>
import MCMarketResourceGenerator from '~/components/generator/type/mcmarket/MCMarketResourceGenerator'
import MCMarketAuthorGenerator from '~/components/generator/type/mcmarket/MCMarketAuthorGenerator'
import MCMarketMemberGenerator from '~/components/generator/type/mcmarket/MCMarketMemberGenerator'

export default {
  components: {
    MCMarketAuthorGenerator,
    MCMarketResourceGenerator,
    MCMarketMemberGenerator,
  },
  data() {
    return {
      module: {
        selected: 0,
        options: [
          { value: 0, text: 'Resource Banner' },
          { value: 1, text: 'Author Banner' },
          { value: 2, text: 'Member Banner' },
        ],
      },
    }
  },
  head({ $seo }) {
    return $seo({
      title: 'MCMarket Banners',
    })
  },
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
