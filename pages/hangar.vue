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

export default {
  components: {
    HangarAuthorGenerator,
  },
  data() {
    return {
      module: {
        selected: 1,
        options: [{ value: 1, text: 'Author Banner' }],
      },
    }
  },
  computed: {
    selectedComponent() {
      return this.module.selected === 0
        ? 'HangarAuthorGenerator'
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
