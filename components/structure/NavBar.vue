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
            <b-nav-item to="/curseforge">CurseForge</b-nav-item>
            <b-nav-item to="/modrinth">Modrinth</b-nav-item>
            <b-nav-item to="/builtbybit">BuiltByBit</b-nav-item>
            <b-nav-item to="/polymart">Polymart</b-nav-item>
            <b-nav-item to="/hangar">Hangar</b-nav-item>
            <b-nav-item to="/servers">Servers</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown :text="authenticated ? username : 'Account'">
              <div v-if="authenticated">
                <b-dropdown-item to="/dashboard">Dashboard</b-dropdown-item>
                <b-dropdown-item href="#" @click.prevent="logOut"
                  >Log Out</b-dropdown-item
                >
              </div>
              <div v-else>
                <b-dropdown-item to="/login">Log In</b-dropdown-item>
                <b-dropdown-item to="/signup">Sign Up</b-dropdown-item>
              </div>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NavBar',
  computed: mapState({
    authenticated: (state) => state.user.authenticated,
    username: (state) => state.user.username,
  }),
  methods: {
    logOut() {
      this.$store.dispatch('user/revokeSession')
      this.$router.push('/login')
    },
  },
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
      margin-right: -165px;

      @media (min-width: 992px) {
        margin-right: -140px;
      }
    }

    li {
      @media (min-width: 768px) {
        font-size: 16px;
        margin: 0 5px 0 0;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &.main-links li {
      @media (min-width: 768px) {
        padding-right: 5px;
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
