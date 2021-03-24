export default {
  data() {
    return {
      username: '',
      checks: {
        usernameAvailable: null,
      },
    }
  },
  computed: {
    usernameTooShort() {
      return this.username.length < 4
    },
    usernameTooLong() {
      return this.username.length > 24
    },
    usernameAvailable() {
      return this.checks.usernameAvailable
    },
    usernameOk() {
      if (!this.username) return null
      return !this.usernameTooShort && !this.usernameTooLong
    },
    usernameOkAndAvailable() {
      return this.usernameOk && this.usernameAvailable
    },
    usernameOkButNotAvailable() {
      return this.usernameOk && !this.usernameAvailable
    },
  },
  methods: {
    clearUsernameAvailability() {
      this.checks.usernameAvailable = null
    },
    async checkUsernameAvailable() {
      this.clearUsernameAvailability()

      if (!this.usernameOk) {
        return
      }

      this.checks.usernameAvailable = await this.$store.dispatch(
        'user/checkUsernameAvailable',
        { username: this.username }
      )
    },
  },
}
