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
      <div class="footer text-center">
        <div class="footer-content">
          <div class="social-links">
            <a href="https://discord.gg/PHpuzZS" target="_blank"><fa :icon="['fab', 'discord']"/></a>
            <a href="#" target="_blank"><fa :icon="['fab', 'twitter']"/></a>
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
            <a href="https://github.com/darbyjack" target="_blank">Glare</a>.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

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
            opacity: [1, 0]
          }
        },
        leave: {
          height: 0,
          opacity: 0
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  height: 100px;
  background: #718096;
  color: #d8dfe8;

  .footer-content {
    padding-top: 30px;

    .social-links {
      display: inline-block;
      margin-bottom: 5px;

      a {
        margin-right: 40px;
        color: inherit;

        &:active,
        &:hover {
          color: darken(#d8dfe8, 10);
        }

        &:last {
          margin-right: 0;
        }
      }
    }

    p {
      a {
        color: inherit;
      }

      font-size: 12px;

      @media (min-width: 576px) {
        font-size: 15px;
      }
    }
  }
}
</style>
