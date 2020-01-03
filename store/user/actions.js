import qs from 'qs'
import config from '~/util/config'

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
      this.$axios.get(
        `${config.authBaseURL}/resource/available/${payload.type}/${payload.data}`
      )
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

      const self = await dispatch('getSelf')
      if (self === null) {
        await dispatch('revokeSession')
        return {
          status: 500,
          message: 'Log in failed (invalid session).'
        }
      }

      commit('setUsername', self.username)
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
      this.$axios.post(
        `${config.authBaseURL}/user/login`,
        qs.stringify(payload)
      )
    )
  },

  async getSelf({ dispatch }) {
    const self = await dispatch('getSelfRequest')

    if (self.status === 200 && self.data) {
      return self.data
    }

    return null
  },

  getSelfRequest() {
    return this.$handleReqRes(
      this.$axios.get(`${config.authBaseURL}/user/me`, this.$addAuthHeader())
    )
  },

  revokeSession({ commit }) {
    this.$killSession()
    commit('reset')
  }
}
