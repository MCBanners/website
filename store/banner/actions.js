export default {
  async saveBanner({ dispatch }, payload) {
    const savedBanner = await dispatch('saveBannerRequest', payload)
    if (savedBanner.status === 200) {
      return savedBanner.data
    }

    return undefined
  },

  saveBannerRequest({ _ }, payload) {
    return this.$axios.post(`banner/saved/save`, payload, this.$addAuthHeader())
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
  },

  async deleteBanner({ dispatch }, bannerId) {
    const deleteBanner = await dispatch('deleteBannerRequest', bannerId)
    return deleteBanner.status === 200
  },

  deleteBannerRequest({ _ }, bannerId) {
    return this.$axios.delete(
      `banner/manage_saved/delete/${bannerId}`,
      this.$addAuthHeader()
    )
  },
}
