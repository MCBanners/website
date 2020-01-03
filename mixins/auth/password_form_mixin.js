export default {
  data() {
    return {
      password: ''
    }
  },
  computed: {
    passwordTooShort() {
      return this.password.length < 8
    },
    passwordOk() {
      if (!this.password) return null
      return !this.passwordTooShort
    }
  }
}
