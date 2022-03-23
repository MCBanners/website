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

<template>
  <header class="container">
    <nuxt-link to="/" class="logo">
      <img src="~/assets/logo.svg" alt="MCBanners" />
    </nuxt-link>

    <nav class="main-nav">
      <nuxt-link to="/spigot">Spigot</nuxt-link>
      <nuxt-link to="/sponge">Sponge</nuxt-link>
      <nuxt-link to="/curseforge">CurseForge</nuxt-link>
      <nuxt-link to="/modrinth">Modrinth</nuxt-link>
      <nuxt-link to="/servers">Servers</nuxt-link>
    </nav>

    <nav>
      <div>
        {{ authenticated ? `Welcome back, ${username}!` : `` }}
        <div v-if="authenticated">
          <a href="#" @click.prevent="logOut">Log Out</a>
          <nuxt-link to="/dashboard">Dashboard</nuxt-link>
        </div>
        <div v-else>
          <nuxt-link to="/login">Log In</nuxt-link>
          <nuxt-link to="/signup">Sign Up</nuxt-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 999;
}

a.logo {
  img {
    display: block;
    width: 120px;
    position: relative;
    top: 25px;
    left: 30px;
  }
}

.main-nav {
  display: flex;
  gap: 50px;

  a {
    color: var(--color__black);
    font-weight: 700;
  }
}

nav:not(.main-nav) {
  a {
    text-decoration: none;
    padding: 7px 20px;
    border-radius: 6px;
    border: 2px solid;
    font-weight: bold;
    font-size: 14px;

    &:first-of-type {
      border-color: #ceebe4;
      background: #ceebe4;
      color: #15483c;
    }

    &:last-of-type {
      background: var(--color__green);
      border-color: var(--color__green);
      color: #fff;
    }
  }
}
</style>
