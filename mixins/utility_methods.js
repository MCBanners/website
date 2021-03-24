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
      }

      return url + '/banner.png'
    },
  },
}
