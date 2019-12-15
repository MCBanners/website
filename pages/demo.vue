<template>
  <div>
    <form>
      <input v-model="content" type="text" placeholder="Type something" />
    </form>
    <p>You typed: {{ content }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: ''
    }
  }
}
</script>
