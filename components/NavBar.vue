<template>
  <div>
    <b-navbar toggleable="sm" variant="light">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand class="text-dark">MCBanners</b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/spigot">Spigot</b-nav-item>
          <b-nav-item to="/servers">Servers</b-nav-item>
          <!-- <b-nav-item to="/servers">Servers</b-nav-item> -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style lang="scss" scoped>
.navbar-brand {
  font-family: 'Carter One', cursive;
}
</style>
