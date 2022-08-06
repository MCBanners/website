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
    async saveCurseForgeAuthorBanner() {
      await this.saveBanner(
        'CURSEFORGE_AUTHOR',
        {
          _author_id: this.author.username,
        },
        this.recompiledParams
      )
    },
    async saveModrinthAuthorBanner() {
      await this.saveBanner(
        'MODRINTH_AUTHOR',
        {
          _author_id: this.author.username,
        },
        this.recompiledParams
      )
    },
    async saveBuiltByBitAuthorBanner() {
      await this.saveBanner(
        'BUILTBYBIT_AUTHOR',
        {
          _author_id: this.author.id,
        },
        this.recompiledParams
      )
    },
    async savePolyMartAuthorBanner() {
      await this.saveBanner(
        'POLYMART_AUTHOR',
        {
          _author_id: this.author.id,
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
    async saveCurseForgeResourceBanner() {
      await this.saveBanner(
        'CURSEFORGE_RESOURCE',
        {
          _resource_id: this.resource.id,
        },
        this.recompiledParams
      )
    },
    async saveModrinthResourceBanner() {
      await this.saveBanner(
        'MODRINTH_RESOURCE',
        {
          _resource_id: this.resource.name,
        },
        this.recompiledParams
      )
    },
    async saveBuiltByBitResourceBanner() {
      await this.saveBanner(
        'BUILTBYBIT_RESOURCE',
        {
          _resource_id: this.resource.id,
        },
        this.recompiledParams
      )
    },
    async saveBuiltByBitMemberBanner() {
      await this.saveBanner(
        'BUILTBYBIT_MEMBER',
        {
          _member_id: this.member.id,
        },
        this.recompiledParams
      )
    },
  },
  async savePolyMartResourceBanner() {
    await this.saveBanner(
      'POLYMART_RESOURCE',
      {
        _resource_id: this.resource.id,
      },
      this.recompiledParams
    )
  },
}
