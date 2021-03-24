export default {
  data() {
    return {
      banner_save: {
        error: '',
        working: false,
        result: {},
      },
    }
  },
  computed: {
    savedBannerURL() {
      return `${this.$axios.defaults.baseURL}banner/saved/${this.banner_save.result.mnemonic}.png`
    },
  },
  methods: {
    async saveBanner(type, extraData, recompiledParams) {
      this.banner_save.error = ''
      this.banner_save.working = true
      this.banner_save.result = {}

      const result = await this.$store.dispatch('banner/saveBanner', {
        type,
        body: {
          ...extraData,
          ...recompiledParams,
        },
      })

      if (!result) {
        this.banner_save.error = 'Failed to save your banner. Try again.'
      }

      this.banner_save.working = false
      this.banner_save.result = result
    },
    async saveServerBanner() {
      await this.saveBanner(
        'MINECRAFT_SERVER',
        {
          _server_host: this.server.ip,
          _server_port: this.server.port,
        },
        this.recompiledParams
      )
    },
    async saveSpigotAuthorBanner() {
      await this.saveBanner(
        'SPIGOT_AUTHOR',
        {
          _author_id: this.author.id,
        },
        this.recompiledParams
      )
    },
    async saveSpongeAuthorBanner() {
      await this.saveBanner(
        'SPONGE_AUTHOR',
        {
          _author_id: this.author.username,
        },
        this.recompiledParams
      )
    },
    async saveSpigotResourceBanner() {
      await this.saveBanner(
        'SPIGOT_RESOURCE',
        {
          _resource_id: this.resource.id,
        },
        this.recompiledParams
      )
    },
    async saveSpongeResourceBanner() {
      await this.saveBanner(
        'SPONGE_RESOURCE',
        {
          _resource_id: this.resource.name,
        },
        this.recompiledParams
      )
    },
  },
}
