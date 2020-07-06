export default {
  async nuxtServerInit({ dispatch }) {
    await dispatch('svc/hydrate')
    await dispatch('user/hydrate')
  },

  checkValidSpigotResource({ dispatch }, resId) {
    return dispatch('isValid', `resource/spigot/${resId}`)
  },

  checkValidSpongeResource({ dispatch }, resName) {
    return dispatch('isValid', `resource/sponge/${resName}`)
  },

  checkValidSpigotAuthor({ dispatch }, authId) {
    return dispatch('isValid', `author/spigot/${authId}`)
  },

  checkValidSpongeAuthor({ dispatch }, authUsername) {
    return dispatch('isValid', `author/sponge/${authUsername}`)
  },

  checkValidServer({ dispatch }, payload) {
    const { ip } = payload
    let { port } = payload

    // Redundant checking, just a failsafe
    if (!port || port == null) {
      port = 25565
    }

    return dispatch('isValid', `server/${ip}/${port}`)
  },

  async isValid({ _ }, validatable) {
    const valid = await this.$axios
      .get(`banner/${validatable}/isValid`, {})
      .catch(() => false)
    return valid.status === 200 && valid.data.valid
  }
}
