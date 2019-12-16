<template>
  <div>
    <b-form-group>
      <b-form-select v-model="module.selected" :options="module.options" />
    </b-form-group>

    <div v-if="module.selected == 0">
      <SpigotResourceGenerator />
    </div>

    <div v-else>
      <SpigotAuthorGenerator />
    </div>
  </div>
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
  }
}
</script>
