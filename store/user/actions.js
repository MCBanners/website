import qs from 'qs'

export default {
  async hydrate({ dispatch, commit }) {
    if (this.$hasSession()) {
      const session = this.$getSession()
      const valid = await dispatch('checkSessionValid', session)
      if (valid) {
        commit('setUsername', session.username)
        commit('setEmail', session.email)
        commit('setAuthenticated')
      } else {
        // eslint-disable-next-line
        console.log('session existed, but server declared it invalid; killing.')
        dispatch('revokeSession')
      }
    }
  },

  async checkSessionValid({ _ }, payload) {
    try {
      await this.$axios.get(`validate`, this.$addAuthHeader())
      return true
    } catch {
      return false
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
      const session = {
        token: result.data.token,
        username: result.data.user.username,
        email: result.data.user.email
      }

      this.$setSession(session)

      commit('setUsername', session.username)
      commit('setEmail', session.email)
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

  async signUp({ dispatch }, payload) {
    const result = await dispatch('signUpRequest', payload)
    return {
      status: result.status,
      message: 'No message.'
    }
  },

  signUpRequest({ _ }, payload) {
    return this.$handleReqRes(
      this.$axios.post('user/signup', qs.stringify(payload))
    )
  },

  revokeSession({ commit }) {
    this.$killSession()
    commit('reset')
  }
}
