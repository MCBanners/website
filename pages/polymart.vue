<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div class="generator">
      <div v-if="module.selected == 0">
        <PolymartResourceGenerator />
      </div>

      <div v-else-if="module.selected == 1">
        <PolymartAuthorGenerator />
      </div>

      <div v-else>
        <PolymartTeamGenerator />
      </div>
    </div>
  </b-container>
</template>

<script>
import PolymartResourceGenerator from '~/components/generator/type/polymart/PolymartResourceGenerator'
import PolymartAuthorGenerator from '~/components/generator/type/polymart/PolymartAuthorGenerator'
import PolymartTeamGenerator from '~/components/generator/type/polymart/PolymartTeamGenerator'

export default {
  components: {
    PolymartResourceGenerator,
    PolymartAuthorGenerator,
    PolymartTeamGenerator,
  },
  data() {
    return {
      module: {
        selected: 0,
        options: [
          { value: 0, text: 'Resource Banner' },
          { value: 1, text: 'Author Banner' },
          { value: 2, text: 'Team Banner' },
        ],
      },
    }
  },
  head({ $seo }) {
    return $seo({
      title: 'Polymart Banners',
    })
  },
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
