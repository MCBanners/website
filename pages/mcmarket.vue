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

      <div v-else>
        <MCMarketAuthorGenerator />
      </div>
    </div>
  </b-container>
</template>

<script>
import MCMarketResourceGenerator from "~/components/generator/type/mcmarket/MCMarketResourceGenerator";
import MCMarketAuthorGenerator from "~/components/generator/type/mcmarket/MCMarketAuthorGenerator";

export default {
  components: {MCMarketAuthorGenerator, MCMarketResourceGenerator},
  data() {
    return {
      module: {
        selected: 0,
        options: [
          { value: 0, text: 'Resource Banner' },
          { value: 1, text: 'Author Banner' },
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
