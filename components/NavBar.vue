<template>
  <div>
    <b-navbar toggleable="md" variant="transparent">
      <b-container>
        <b-navbar-brand class="mr-1">
          <div class="logo-container">
            <nuxt-link to="/"
              ><img
                src="~/assets/mcbanners-logo.svg"
                alt="MCBanners"
                class="logo"
            /></nuxt-link>
          </div>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
        <b-collapse id="nav-text-collapse" is-nav>
          <b-navbar-nav class="ml-auto nudge-it-to-the-center main-links">
            <b-nav-item to="/spigot">Spigot</b-nav-item>
            <b-nav-item to="/sponge">Sponge</b-nav-item>
            <b-nav-item to="/servers">Servers</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="#" target="_blank"
              ><fa :icon="['fab', 'discord']"
            /></b-nav-item>
            <b-nav-item href="#" target="_blank"
              ><fa :icon="['fab', 'twitter']"
            /></b-nav-item>
            <b-nav-item href="https://github.com/MCBanners/" target="_blank"
              ><fa :icon="['fab', 'github']"
            /></b-nav-item>
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
  .logo-container {
    position: relative;
    height: 75px;
    width: 0px;

    .logo {
      position: absolute;
      height: 64px;

      @media (min-width: 1200px) {
        height: 75px;
      }
    }
  }

  .navbar-nav {
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;

    &.nudge-it-to-the-center {
      @media (min-width: 768px) {
        margin-right: -140px;
      }

      @media (min-width: 992px) {
        margin-right: -70px;
      }
    }

    li {
      @media (min-width: 768px) {
        font-size: 18px;
        margin: 0 10px 0 0;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &.main-links li {
      @media (min-width: 768px) {
        padding-right: 10px;
        border-right: 2px #4299e1 solid;

        &:last-child {
          padding-right: 0;
          border-right: none;
        }
      }
    }
  }
}
</style>
