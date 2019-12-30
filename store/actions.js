export default {
  async nuxtServerInit({ dispatch }) {
    await dispatch('constants/hydrate')
  },

  async checkValidResource({ _ }, resId) {
    const valid = await this.$axios.get(`resource/spigot/${resId}/isValid`, {})
    return valid.status === 200 && valid.data.valid
  },

  async checkValidAuthor({ _ }, authId) {
    const valid = await this.$axios.get(`author/spigot/${authId}/isValid`, {})
    return valid.status === 200 && valid.data.valid
  },

  async checkValidServer({ _ }, ip, port = 25565) {
    // Redundant checking, just a failsafe
    if (port == null) {
      port = 25565
    }
    const valid = await this.$axios.get(`server/${ip}/${port}/isValid`, {})
    return valid.status === 200 && valid.data.valid
  }
}
