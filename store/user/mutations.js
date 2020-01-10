export default {
  setAuthenticated(state) {
    state.authenticated = true
  },

  setUsername(state, username) {
    state.username = username
  },

  setEmail(state, email) {
    state.email = email
  },

  reset(state) {
    state.authenticated = false
    state.username = ''
    state.email = ''
  }
}
