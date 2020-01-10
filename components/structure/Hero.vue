<template>
  <div>
    <b-jumbotron bg-variant="primary" text-variant="light">
      <b-container>
        <b-row>
          <b-col cols="12" lg="10" class="mx-auto">
            <div class="header-container">
              <h1 class="header">
                Welcome to MCBanners.com!
              </h1>
            </div>
            <div class="lead-container mx-auto">
              <p class="lead">
                We turn backend statistics into beautiful front-end images that
                can be displayed on forums and more.
              </p>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-jumbotron>
    <b-container>
      <b-row>
        <b-col cols="11" lg="10" xl="8" class="mx-auto">
          <QuickServerBanner class="quick-server-banner" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import QuickServerBanner from '~/components/flow/QuickServerBanner'

export default {
  name: 'Hero',
  components: { QuickServerBanner }
}
</script>

<style lang="scss" scoped>
.jumbotron {
  font-family: 'Open Sans', sans-serif;
  text-align: center;

  border-radius: 13px;

  .header-container {
    width: 100%;

    h1 {
      font-size: 18px;
      font-weight: 700;

      @media (min-width: 576px) {
        font-size: 28px;
      }

      @media (min-width: 768px) {
        font-size: 38px;
      }
    }
  }

  .lead-container {
    width: 95%;

    @media (min-width: 1200px) {
      width: 80%;
    }

    p.lead {
      font-size: 15px;
      font-weight: 400;

      @media (min-width: 576px) {
        font-size: 16px;
      }

      @media (min-width: 768px) {
        font-size: 22px;
      }

      @media (min-width: 1200px) {
        font-size: 28px;
      }
    }
  }
}

.quick-server-banner {
  margin-top: -55px;

  @media (min-width: 576px) {
    margin-top: -85px;
  }

  @media (min-width: 992px) {
    margin-top: -80px;
  }

  @media (min-width: 1200px) {
    margin-top: -75px;
  }

  background: white;
  padding: 20px;
  border-radius: 15px;
  filter: drop-shadow(0px 4px 2px #ccc);
}
</style>
