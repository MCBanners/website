import qs from 'qs'

export default {
  async saveBanner({ dispatch }, payload) {
    const savedBanner = await dispatch('saveBannerRequest', payload)
    if (savedBanner.status === 200) {
      return savedBanner.data
    }

    return undefined
  },

  saveBannerRequest({ _ }, payload) {
    const { type, body } = payload
    return this.$axios.post(
      `banner/saved/save/${type}`,
      qs.stringify(body),
      this.$addAuthHeader()
    )
  },

  async getAllSavedBanners({ dispatch }) {
    const savedBanners = await dispatch('getAllSavedBannersRequest')
    if (savedBanners.status === 200) {
      return savedBanners.data
    }

    return undefined
  },

  getAllSavedBannersRequest() {
    return this.$axios.get(
      `banner/manage_saved/find/all`,
      this.$addAuthHeader()
    )
  }
}
