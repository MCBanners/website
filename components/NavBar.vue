<template>
  <div>
    <b-navbar toggleable="md" variant="transparent">
      <b-container>
        <b-navbar-brand>
          <img src="~/assets/mcbanners-logo.svg" alt="MCBanners" class="logo" />
        </b-navbar-brand>

        <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
        <b-collapse id="nav-text-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/spigot">Spigot</b-nav-item>
            <b-nav-item to="/sponge">Sponge</b-nav-item>
            <b-nav-item to="/servers">Servers</b-nav-item>
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
    //font-family: 'Fredoka One', cursive;

    li {
      @media (min-width: 768px) {
        font-size: 18px;
        margin: 0 10px 0 0;
        background: rgba(0, 0, 0, 0.2);

        border-color: rgba(0, 0, 0, 0.4);
        border-width: 0.09rem 0.12rem 0.12rem 0.09rem;
        border-style: solid;

        border-top-left-radius: 12px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 12px;

        &:last-child {
          margin-right: 0;
        }

        &:hover {
          color: rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
}
</style>
