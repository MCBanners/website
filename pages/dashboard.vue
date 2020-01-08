<template>
  <b-container>
    <h1>Welcome, {{ username }}.</h1>
    <div v-if="!numSavedBanners">
      <h3>You have no saved banners.</h3>
      <p>
        While logged in, visit a generator and modify a banner to your liking.
        Once finished, press save. Your banner will appear here after that!
      </p>
    </div>
    <div v-else>
      <h3>You have {{ numSavedBanners }} saved banners.</h3>

      <b-card-group columns>
        <b-card v-for="(savedBanner, idx) in savedBanners" :key="idx">
          <template #header> Banner ID: {{ savedBanner.id }} </template>
          <h4>
            Mnemonic:
            <a
              :href="
                'http://localhost:8100/banner/saved/' + savedBanner.mnemonic
              "
              target="_blank"
              >{{ savedBanner.mnemonic }}</a
            >
          </h4>
          <h4>Type: {{ savedBanner.bannerType }}</h4>
          <div v-if="savedBanner.bannerType === 'MINECRAFT_SERVER'">
            <h4>Server Host: {{ savedBanner.settings._server_host }}</h4>
            <h4>Server Port: {{ savedBanner.settings._server_port }}</h4>
          </div>
          <div
            v-else-if="
              savedBanner.bannerType === 'SPIGOT_AUTHOR' ||
                savedBanner.bannerType === 'SPONGE_AUTHOR'
            "
          >
            <h4>Author ID: {{ savedBanner.settings._author_id }}</h4>
          </div>
          <div
            v-else-if="
              savedBanner.bannerType === 'SPIGOT_RESOURCE' ||
                savedBanner.bannerType === 'SPONGE_RESOURCE'
            "
          >
            <h4>Resource ID: {{ savedBanner.settings._resource_id }}</h4>
          </div>
        </b-card>
      </b-card-group>
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  computed: {
    ...mapState({
      username: (state) => state.user.username
    }),
    numSavedBanners() {
      return Object.keys(this.savedBanners).length
    }
  },
  async asyncData({ store }) {
    const savedBanners = await store.dispatch('banner/getAllSavedBanners')
    if (savedBanners) {
      return { savedBanners }
    }
  }
}
</script>
