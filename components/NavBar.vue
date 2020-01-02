<template>
  <div>
    <b-navbar toggleable="md" variant="transparent">
      <b-container>
        <b-navbar-brand class="mr-1">
          <img src="~/assets/mcbanners-logo.svg" alt="MCBanners" class="logo" />
        </b-navbar-brand>

        <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
        <b-collapse id="nav-text-collapse" is-nav>
          <b-navbar-nav class="mx-auto">
            <b-nav-item to="/spigot">Spigot</b-nav-item>
            <b-nav-item to="/sponge">Sponge</b-nav-item>
            <b-nav-item to="/servers">Servers</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Login</b-nav-item>
            <b-nav-item to="/">Sign Up</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style lang="scss" scoped>
.navbar {
  .logo {
    height: 64px;

    @media (min-width: 1200px) {
      height: 72px;
    }
  }

  .navbar-nav {
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;

    li {
      @media (min-width: 768px) {
        font-size: 18px;
        margin: 0 10px 0 0;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
