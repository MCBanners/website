function _hasOwn(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

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

      if (
        (_hasOwn(options, 'ip') && !options.ip) ||
        (_hasOwn(options, 'id') && !options.id)
      ) {
        // Stop banner trying to render when URL cannot be built.
        return undefined
      }

      let url = `${this.$axios.defaults.baseURL}banner/${urlModule}/`

      switch (module) {
        case 'server':
          url += `${options.ip}/${options.port}`
          break
        case 'author-sponge':
        case 'resource-sponge':
          url += `ore/${options.id}`
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
        case 'author-builtbybit':
        case 'resource-builtbybit':
        case 'member-builtbybit':
          url += `builtbybit/${options.id}`
          break
        case 'author-polymart':
        case 'resource-polymart':
        case 'team-polymart':
          url += `polymart/${options.id}`
          break
      }

      return url + '/banner.png'
    },
  },
}
