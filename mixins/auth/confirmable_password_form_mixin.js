import PasswordFormMixin from './password_form_mixin'

export default {
  mixins: [PasswordFormMixin],
  data() {
    return {
      passwordConfirm: '',
    }
  },
  computed: {
    passwordsDoNotMatch() {
      return this.password !== this.passwordConfirm
    },
    passwordsOk() {
      return this.passwordOk && !this.passwordsDoNotMatch
    },
  },
}
