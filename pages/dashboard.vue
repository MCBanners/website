<template>
  <b-container>
    <h1>Hey, {{ username }},</h1>
    <div v-if="!numSavedBanners" class="text-center">
      <h3>you have no saved banners.</h3>
      <p>
        While logged in, visit a generator and modify a banner to your liking.
      </p>
      <p>
        Once finished, press Finish and you will be given your very own URL!
      </p>
      <p>
        After that, any banners you make while logged in while appear right
        here.
      </p>
    </div>
    <div v-else>
      <h3>you have {{ numSavedBanners }} saved banners.</h3>
      <b-row>
        <b-col
          v-for="(savedBanner, idx) in savedBanners"
          :key="idx"
          cols="12"
          md="6"
          lg="4"
          class="mx-auto"
        >
          <b-card
            :img-src="getShortUrl(savedBanner.mnemonic)"
            :img-alt="'Banner: ' + savedBanner.mnemonic + '.png'"
            img-top
          >
            <div class="text-center">
              <h5>Mnemonic</h5>
              <p>
                <strong
                  ><a
                    :href="getShortUrl(savedBanner.mnemonic)"
                    target="_blank"
                    >{{ savedBanner.mnemonic }}</a
                  >
                  <small
                    ><fa
                      :icon="['fas', 'external-link-alt']"
                      class="icon" /></small
                ></strong>
              </p>

              <h5>Banner Type</h5>
              <p>
                <strong> {{ savedBanner.bannerType }}</strong>
              </p>
            </div>
            <template #footer>
              <b-nav align="right" small>
                <!-- Later -->
                <!-- <b-nav-item @click.prevent="editBanner"
                ><fa :icon="['fas', 'edit']"
              /></b-nav-item> -->
                <b-nav-item @click.prevent="deleteBanner(savedBanner.id)"
                  ><fa :icon="['fas', 'trash']"
                /></b-nav-item>
              </b-nav>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import filter from 'lodash.filter'
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  async asyncData({ store }) {
    const savedBanners = await store.dispatch('banner/getAllSavedBanners')
    if (savedBanners) {
      return { savedBanners }
    }
  },
  computed: {
    ...mapState({
      username: (state) => state.user.username,
    }),
    numSavedBanners() {
      return Object.keys(this.savedBanners).length
    },
  },
  methods: {
    getShortUrl(mnemonic) {
      return `${this.$axios.defaults.baseURL}banner/saved/${mnemonic}.png`
    },
    editBanner() {
      // eslint-disable-next-line no-console
      console.log('Not Yet Implemented')
    },
    async deleteBanner(id) {
      const confirmation = await this.$bvModal
        .msgBoxConfirm(
          'Do you really want to delete this banner? You can always make another one later.'
        )
        .catch(() => false)
      if (confirmation) {
        const success = await this.$store.dispatch('banner/deleteBanner', id)
        if (success) {
          this.savedBanners = filter(
            this.savedBanners,
            (banner) => banner.id !== id
          )
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
h1,
h3 {
  font-family: 'Fredoka One';
  text-align: center;
}

h1 {
  margin-top: 30px;
}

h3 {
  margin-bottom: 45px;
}

p {
  font-family: 'Open Sans';
}

.card {
  margin-bottom: 10px;
}
</style>
