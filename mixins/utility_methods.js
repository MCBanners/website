export default {
  methods: {
    makeSelectable(obj) {
      return Object.keys(obj).map((key) => ({
        value: key,
        text: obj[key],
      }))
    },
    generateBannerUrl(module, options) {
      module = module.toLowerCase()
      const urlModule = module.split('-')[0]

      let url = `${this.$axios.defaults.baseURL}banner/${urlModule}/`

      switch (module) {
        case 'server':
          url += `${options.ip}/${options.port}`
          break
        case 'author-sponge':
        case 'resource-sponge':
          url += `sponge/${options.id}`
          break
        case 'author-spigot':
        case 'resource-spigot':
          url += `spigot/${options.id}`
          break
        case 'author-curseforge':
        case 'resource-curseforge':
          url += `curseforge/${options.id}`
          break
        case 'author-modrinth':
        case 'resource-modrinth':
          url += `modrinth/${options.id}`
          break
        case 'author-mcmarket':
        case 'resource-mcmarket':
          url += `mcmarket/${options.id}`
          break
      }

      return url + '/banner.png'
    },
  },
}
