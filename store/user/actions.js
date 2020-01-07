import qs from 'qs'

export default {
  async hydrate({ dispatch, commit }) {
    if (this.$hasSession()) {
      const self = await dispatch('getSelf')

      if (self === null) {
        // Had session, but it expired
        await dispatch('revokeSession')
        return
      }

      commit('setAuthenticated')
      commit('setUsername', self.username)
    }
  },

  checkUsernameAvailable({ dispatch }, payload) {
    return dispatch('checkAvailableRequest', {
      type: 'username',
      data: payload.username
    })
  },

  checkEmailAvailable({ dispatch }, payload) {
    return dispatch('checkAvailableRequest', {
      type: 'email',
      data: payload.email
    })
  },

  async checkAvailableRequest({ _ }, payload) {
    const available = await this.$handleReqRes(
      this.$axios.get(`user/resource/${payload.type}/${payload.data}`)
    )

    if (available.status === 200 && available.data) {
      return available.data.available
    }

    return false
  },

  async logIn({ dispatch, commit }, payload) {
    const result = await dispatch('logInRequest', payload)

    if (result.status === 200 && result.data) {
      this.$setSession(result.data.token)

      commit('setUsername', result.data.user.username)
      commit('setAuthenticated')

      return {
        status: 200
      }
    } else if (result.status === 403) {
      return {
        status: 403,
        message: 'Invalid username or password.'
      }
    }
  },

  logInRequest({ _ }, payload) {
    return this.$handleReqRes(
      this.$axios.post(`user/login`, qs.stringify(payload))
    )
  },

  revokeSession({ commit }) {
    this.$killSession()
    commit('reset')
  }
}
