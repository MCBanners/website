export default {
  async hydrate({ dispatch }) {
    await dispatch('loadConstantsRequest')
  },

  async loadConstantsRequest({ dispatch }) {
    const constants = await this.$axios.get('banner/svc/constants')
    if (constants.status === 200) {
      await dispatch('loadConstants', constants.data)
    }
  },

  loadConstants({ commit }, payload) {
    commit('setFonts', payload.fonts)
    commit('setTemplates', payload.templates)
    commit('setTextAlignments', payload.text_alignments)
  }
}
