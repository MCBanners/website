export default {
  async nuxtClientInit({ dispatch }) {
    await dispatch('svc/hydrate')
    await dispatch('user/hydrate')
  },

  checkValidSpigotResource({ dispatch }, resId) {
    return dispatch('isValid', `resource/spigot/${resId}`)
  },

  checkValidSpongeResource({ dispatch }, resName) {
    return dispatch('isValid', `resource/ore/${resName}`)
  },

  checkValidCurseForgeResource({ dispatch }, resId) {
    return dispatch('isValid', `resource/curseforge/${resId}`)
  },

  checkValidModrinthResource({ dispatch }, resName) {
    return dispatch('isValid', `resource/modrinth/${resName}`)
  },

  checkValidBuiltByBitResource({ dispatch }, resId) {
    return dispatch('isValid', `resource/builtbybit/${resId}`)
  },

  checkValidPolymartResource({ dispatch }, resId) {
    return dispatch('isValid', `resource/polymart/${resId}`)
  },

  checkValidHangarResource({ dispatch }, resource) {
    const { name, author } = resource
    return dispatch('isValid', `resource/hangar/${name}/${author}`)
  },

  checkValidSpigotAuthor({ dispatch }, authId) {
    return dispatch('isValid', `author/spigot/${authId}`)
  },

  checkValidSpongeAuthor({ dispatch }, authUsername) {
    return dispatch('isValid', `author/ore/${authUsername}`)
  },

  checkValidCurseForgeAuthor({ dispatch }, authUsername) {
    return dispatch('isValid', `author/curseforge/${authUsername}`)
  },

  checkValidModrinthAuthor({ dispatch }, authUsername) {
    return dispatch('isValid', `author/modrinth/${authUsername}`)
  },

  checkValidBuiltByBitAuthor({ dispatch }, authId) {
    return dispatch('isValid', `author/builtbybit/${authId}`)
  },

  checkValidPolymartAuthor({ dispatch }, authId) {
    return dispatch('isValid', `author/polymart/${authId}`)
  },

  checkValidHangarAuthor({ dispatch }, authId) {
    return dispatch('isValid', `author/hangar/${authId}`)
  },

  checkValidBuiltByBitMember({ dispatch }, memberId) {
    return dispatch('isValid', `member/builtbybit/${memberId}`)
  },

  checkValidPolymartTeam({ dispatch }, teamId) {
    return dispatch('isValid', `team/polymart/${teamId}`)
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
    const state = valid.status === 200 && valid.data.valid
    return { state, resp: valid.data }
  },
}
