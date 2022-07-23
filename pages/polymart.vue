<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div class="generator">
      <div v-if="module.selected == 0">
        <PolyMartResourceGenerator />
      </div>

      <div v-else>
        <PolyMartAuthorGenerator />
      </div>
    </div>
  </b-container>
</template>

<script>
import PolyMartResourceGenerator from '~/components/generator/type/polymart/PolyMartResourceGenerator'
import PolyMartAuthorGenerator from '~/components/generator/type/polymart/PolyMartAuthorGenerator'

export default {
  components: { PolyMartResourceGenerator, PolyMartAuthorGenerator },
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
      title: 'PolyMart Banners',
    })
  },
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
