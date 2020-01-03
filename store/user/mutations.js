export default {
  setAuthenticated(state) {
    state.authenticated = true
  },

  setUsername(state, username) {
    state.username = username
  },

  reset(state) {
    state.authenticated = false
    state.username = null
  }
}
