<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div class="generator">
      <div v-if="module.selected == 0">
        <BuiltByBitResourceGenerator />
      </div>

      <div v-else-if="module.selected == 1">
        <BuiltByBitAuthorGenerator />
      </div>

      <div v-else>
        <BuiltByBitMemberGenerator />
      </div>
    </div>
  </b-container>
</template>

<script>
import BuiltByBitResourceGenerator from '~/components/generator/type/builtbybit/BuiltByBitResourceGenerator'
import BuiltByBitAuthorGenerator from '~/components/generator/type/builtbybit/BuiltByBitAuthorGenerator'
import BuiltByBitMemberGenerator from '~/components/generator/type/builtbybit/BuiltByBitMemberGenerator'

export default {
  components: {
    BuiltByBitResourceGenerator,
    BuiltByBitMemberGenerator,
    BuiltByBitAuthorGenerator,
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
      title: 'BuiltByBit Banners',
    })
  },
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
