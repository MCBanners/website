<template>
  <div class="d-flex flex-column sticky-footer-container">
    <NavBar />
    <main class="flex-fill">
      <transition
        name="page"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <nuxt />
      </transition>
    </main>
    <footer>
      <div class="footer text-center">
        <p>
          <nuxt-link to="/">MCBanners.com</nuxt-link> &vert; A Project by
          <a href="https://github.com/simpleauthority" target="_blank"
            >Simple</a
          >
          and <a href="https://github.com/darbyjack" target="_blank">Glare</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import NavBar from '~/components/NavBar'

export default {
  components: { NavBar }
}
</script>

<style lang="scss" scoped>
.footer {
  height: 80px;
  background: #718096;
  color: #d8dfe8;

  p {
    padding-top: 30px;

    a {
      color: inherit;
    }

    font-size: 12px;

    @media (min-width: 576px) {
      font-size: 15px;
    }
  }
}
</style>
