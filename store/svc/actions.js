export default {
  async hydrate({ dispatch }) {
    await dispatch('loadConstantsRequest')
    await dispatch('loadDefaultsRequest')
  },

  async loadConstantsRequest({ dispatch }) {
<<<<<<< HEAD:store/svc/actions.js
    const constants = await this.$axios.get(`banner/svc/constants`)
=======
    const constants = await this.$axios.get('banner/svc/constants')
>>>>>>> 210d6fc3d31c2fab215fb06d6318407cb6e36451:store/constants/actions.js
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
