<template>
  <b-container>
    <b-form-group id="module-select">
      <b-input-group prepend="Module">
        <b-form-select v-model="module.selected" :options="module.options" />
      </b-input-group>
    </b-form-group>

    <div class="generator">
      <div v-if="module.selected == 0">
        <CurseForgeResourceGenerator />
      </div>

      <div v-else>
        <CurseForgeAuthorGenerator />
      </div>
    </div>
  </b-container>
</template>

<script>
import CurseForgeResourceGenerator from '~/components/generator/type/curseforge/CurseForgeResourceGenerator'
import CurseForgeAuthorGenerator from '~/components/generator/type/curseforge/CurseForgeAuthorGenerator'

export default {
  components: { CurseForgeResourceGenerator, CurseForgeAuthorGenerator },
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
      title: 'CurseForge Banners',
    })
  },
}
</script>

<style lang="scss" scoped>
.generator {
  margin-bottom: 45px;
}
</style>
