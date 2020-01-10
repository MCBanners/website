export default {
  data() {
    return {
      password: ''
    }
  },
  computed: {
    passwordRequirementsNotMet() {
      return !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
        this.password
      )
    },
    passwordOk() {
      if (!this.password) return null
      return !this.passwordRequirementsNotMet
    }
  }
}
