export default {
  async nuxtServerInit({ dispatch }) {
    await dispatch('constants/hydrate')
  }
}
