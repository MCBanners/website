export default {
  async nuxtServerInit({ dispatch }) {
    await dispatch('constants/hydrate')
  },

  async checkValidResource({ _ }, resId) {
    const valid = await this.$axios.get(`resource/${resId}/isValid`, {})
    return valid.status === 200 && valid.data.valid
  }
}
