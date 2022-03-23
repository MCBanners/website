<!-- eslint-disable vue/multi-word-component-names -->
<script>
import NavBar from '~/components/structure/NavBar'

export default {
  components: { NavBar },
  data() {
    return {
      animation: {
        enter(element) {
          const height = element.clientHeight
          return {
            height: [height, 0],
            opacity: [1, 0],
          }
        },
        leave: {
          height: 0,
          opacity: 0,
        },
      },
    }
  },
}
</script>

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
      <notifications
        :animation="animation"
        group="global"
        animation-type="velocity"
      />
    </main>
    <footer>
      <div class="container">
        <div class="social-links">
          <a href="https://discord.gg/PHpuzZS" target="_blank"
            ><fa :icon="['fab', 'discord']"
          /></a>
          <a href="#" target="_blank"><fa :icon="['fab', 'twitter']" /></a>
          <a href="https://github.com/MCBanners/" target="_blank">
            <fa :icon="['fab', 'github']" />
          </a>
        </div>
        <p>
          <nuxt-link to="/">MCBanners.com</nuxt-link> &vert; A Project by
          <a href="https://github.com/simpleauthority" target="_blank"
            >Simple</a
          >
          and
          <a href="https://github.com/darbyjack" target="_blank">Glare</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
footer {
  background: var(--color__black);
  color: #fff;
  font-size: 14px;
  padding: 70px 0;
  text-align: center;
}

.social-links {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-bottom: 10px;

  a {
    color: inherit;

    &:active,
    &:hover {
      color: darken(#d8dfe8, 10);
    }
  }
}

p {
  margin: 0;

  a {
    color: inherit;
  }
}
</style>
