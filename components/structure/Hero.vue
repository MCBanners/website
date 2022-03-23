<script>
import QuickServerBanner from '~/components/flow/QuickServerBanner'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Hero',
  components: { QuickServerBanner },
}
</script>

<template>
  <div>
    <div class="hero">
      <div>
        <h1>MCBanners.com</h1>
        <p>
          We turn backend statistics into beautiful front-end images that can be
          displayed on forums and more.
        </p>
      </div>
    </div>
    <QuickServerBanner class="quick-server-banner" />
  </div>
</template>

<style lang="scss" scoped>
.hero {
  background: url('~/assets/banner-mc-background.jpg') no-repeat center center;
  background-size: cover;
  text-align: center;
  color: #fff;
  padding: 130px 30px;
  border-radius: 50px;
  position: relative;
  overflow: hidden;

  div {
    position: relative;
  }

  &::before {
    content: '';
    background-color: #201d1f;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0.4;
  }
}

h1 {
  margin: 0 0 20px;
  font-weight: 800;
  font-size: 58px;
}

p {
  padding: 0 250px;
  margin: 0;
  font-size: 21px;

  @media (max-width: 991px) {
    padding: 0;
  }
}
</style>
