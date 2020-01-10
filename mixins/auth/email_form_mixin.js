export default {
  data() {
    return {
      email: '',
      checks: {
        emailAvailable: null
      }
    }
  },
  computed: {
    emailFormatWrong() {
      if (this.email.length <= 4) return false
      return !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.email
      )
    },
    emailAvailable() {
      return this.checks.emailAvailable
    },
    emailOk() {
      if (!this.email) return null
      return !this.emailFormatWrong
    }
  },
  methods: {
    clearEmailAvailability() {
      this.checks.emailAvailable = null
    },
    async checkEmailAvailable() {
      this.clearEmailAvailability()

      if (!this.emailOk) {
        return
      }

      this.checks.emailAvailable = await this.$store.dispatch(
        'user/checkEmailAvailable',
        { email: this.email }
      )
    }
  }
}
