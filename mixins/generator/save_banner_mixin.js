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
    async saveBanner(type, metadata, settings) {
      this.banner_save.error = ''
      this.banner_save.working = true
      this.banner_save.result = {}

      const result = await this.$store.dispatch('banner/saveBanner', {
        type,
        metadata,
        settings,
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
          server_host: this.server.ip,
          server_port: this.server.port,
        },
        this.recompiledParams
      )
    },
    async saveSpigotAuthorBanner() {
      await this.saveBanner(
        'SPIGOT_AUTHOR',
        {
          author_id: this.author.id,
        },
        this.recompiledParams
      )
    },
    async saveSpongeAuthorBanner() {
      await this.saveBanner(
        'SPONGE_AUTHOR',
        {
          author_id: this.author.username,
        },
        this.recompiledParams
      )
    },
    async saveCurseForgeAuthorBanner() {
      await this.saveBanner(
        'CURSEFORGE_AUTHOR',
        {
          author_id: this.author.username,
        },
        this.recompiledParams
      )
    },
    async saveModrinthAuthorBanner() {
      await this.saveBanner(
        'MODRINTH_AUTHOR',
        {
          author_id: this.author.username,
        },
        this.recompiledParams
      )
    },
    async saveBuiltByBitAuthorBanner() {
      await this.saveBanner(
        'BUILTBYBIT_AUTHOR',
        {
          author_id: this.author.id,
        },
        this.recompiledParams
      )
    },
    async savePolymartAuthorBanner() {
      await this.saveBanner(
        'POLYMART_AUTHOR',
        {
          author_id: this.author.id,
        },
        this.recompiledParams
      )
    },
    async saveHangarAuthorBanner() {
      await this.saveBanner(
        'HANGAR_AUTHOR',
        {
          author_id: this.author.username,
        },
        this.recompiledParams
      )
    },
    async saveSpigotResourceBanner() {
      await this.saveBanner(
        'SPIGOT_RESOURCE',
        {
          resource_id: this.resource.id,
        },
        this.recompiledParams
      )
    },
    async saveSpongeResourceBanner() {
      await this.saveBanner(
        'SPONGE_RESOURCE',
        {
          resource_id: this.resource.name,
        },
        this.recompiledParams
      )
    },
    async saveCurseForgeResourceBanner() {
      await this.saveBanner(
        'CURSEFORGE_RESOURCE',
        {
          resource_id: this.resource.id,
        },
        this.recompiledParams
      )
    },
    async saveModrinthResourceBanner() {
      await this.saveBanner(
        'MODRINTH_RESOURCE',
        {
          resource_id: this.resource.name,
        },
        this.recompiledParams
      )
    },
    async saveBuiltByBitResourceBanner() {
      await this.saveBanner(
        'BUILTBYBIT_RESOURCE',
        {
          resource_id: this.resource.id,
        },
        this.recompiledParams
      )
    },
    async saveBuiltByBitMemberBanner() {
      await this.saveBanner(
        'BUILTBYBIT_MEMBER',
        {
          member_id: this.member.id,
        },
        this.recompiledParams
      )
    },
    async savePolymartResourceBanner() {
      await this.saveBanner(
        'POLYMART_RESOURCE',
        {
          resource_id: this.resource.id,
        },
        this.recompiledParams
      )
    },
    async saveHangarResourceBanner() {
      await this.saveBanner(
        'HANGAR_RESOURCE',
        {
          resource_id: this.resource.name,
          author_id: -1,
          author_name: this.resource.author,
        },
        this.recompiledParams
      )
    },
    async savePolymartTeamBanner() {
      await this.saveBanner(
        'POLYMART_TEAM',
        {
          team_id: this.team.id,
        },
        this.recompiledParams
      )
    },
  },
}
