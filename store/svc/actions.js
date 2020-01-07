export default {
  async hydrate({ dispatch }) {
    await dispatch('loadConstantsRequest')
    await dispatch('loadDefaultsRequest')
  },

  async loadConstantsRequest({ dispatch }) {
    const constants = await this.$axios.get(`banner/svc/constants`)
    if (constants.status === 200) {
      await dispatch('loadConstants', constants.data)
    }
  },

  loadConstants({ commit }, payload) {
    commit('setFonts', payload.fonts)
    commit('setTemplates', payload.templates)
    commit('setTextAlignments', payload.text_alignments)
  },

  async loadDefaultsRequest({ dispatch }) {
    const defaults = await this.$axios.get(`banner/svc/defaults/all`)
    if (defaults.status === 200) {
      await dispatch('loadDefaults', defaults.data)
    }
  },

  loadDefaults({ commit }, payload) {
    commit('setDefaults', payload)
  }
}
