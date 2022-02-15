<template>
  <b-container>
    <Hero />
  </b-container>
</template>

<script>
import Hero from '~/components/structure/Hero'

export default {
  components: { Hero },
  head({ $seo }) {
    return $seo({
      title: 'Home Page',
    })
  },
}
</script>

<style lang="scss" scoped>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  color: #35495e;
  letter-spacing: 1px;

  font-size: 60px;

  @media (min-width: 576px) {
    font-size: 70px;
  }

  @media (min-width: 768px) {
    font-size: 80px;
  }

  @media (min-width: 992px) {
    font-size: 90px;
  }

  @media (min-width: 1200px) {
    font-size: 100px;
  }
}

.subtitle {
  font-weight: 300;
  color: #526488;
  word-spacing: 5px;

  font-size: 20px;

  @media (min-width: 576px) {
    font-size: 25px;
  }

  @media (min-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 992px) {
    font-size: 37px;
  }

  @media (min-width: 1200px) {
    font-size: 44px;
  }
}
</style>
