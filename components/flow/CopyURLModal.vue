<template>
  <b-modal
    id="copy-url-modal"
    :centered="true"
    title="Your banner was successfully saved!"
    header-class="p-2 border-bottom-0"
    footer-class="p-2 border-top-0"
    ok-title="I'm done"
    ok-only
    size="md"
  >
    <div class="text-center final-image-container">
      <img :src="bannerURL" />
    </div>
    <b-input :value="bannerURL" type="text" disabled />
    <b-button
      v-clipboard:copy="bannerURL"
      v-clipboard:success="copySuccess"
      variant="primary"
      block
      >Copy Banner URL</b-button
    >
    <div class="mt-3">
      <p>Markdown:</p>
      <vue-code-highlight language="md">
        <pre>![Banner]({{ bannerURL }})</pre>
      </vue-code-highlight>
      <p>BBCode:</p>
      <vue-code-highlight language="bbcode">
        <pre>[img]{{ bannerURL }}[/img]</pre>
      </vue-code-highlight>
      <p>HTML:</p>
      <vue-code-highlight language="html">
        <pre>&lt;img src="{{ bannerURL }}" /&gt;</pre>
      </vue-code-highlight>
    </div>
  </b-modal>
</template>

<script>
import { component as VueCodeHighlight } from 'vue-code-highlight'
import 'vue-code-highlight/themes/prism-okaidia.css'

export default {
  name: 'GetURLModal',
  components: {
    VueCodeHighlight,
  },
  props: {
    bannerURL: {
      type: String,
      required: true,
    },
  },
  methods: {
    copySuccess() {
      this.$notify({
        group: 'global',
        type: 'success',
        title: 'Banner Saved',
        text: "Your banner has been saved and its new URL was copied for you. If you're signed in, it will also be available in your dashboard.",
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#copy-url-modal {
  .final-image-container {
    margin-bottom: 20px;
  }

  input {
    margin-bottom: 10px;
  }
}
</style>
