<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select
          v-if="module.options.length"
          v-model="module.selected"
          :options="module.options"
        ></b-form-select>
      </b-input-group>
    </b-form-group>

    <div class="generator">
      <component :is="selectedComponent" />
    </div>
  </b-container>
</template>

<script>
import HangarAuthorGenerator from '~/components/generator/type/hangar/HangarAuthorGenerator'
import HangarResourceGenerator from '~/components/generator/type/hangar/HangarResourceGenerator'

export default {
  components: {
    HangarAuthorGenerator,
    HangarResourceGenerator,
  },
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
  computed: {
    selectedComponent() {
      return this.module.selected === 0
        ? 'HangarResourceGenerator'
        : 'HangarAuthorGenerator'
    },
    head({ $seo }) {
      return $seo({
        title: 'Hangar Banners',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
