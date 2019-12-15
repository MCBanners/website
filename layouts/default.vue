<template>
  <div>
    <NavBar />
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<script>
import NavBar from '~/components/NavBar'

export default {
  components: { NavBar }
}
</script>
