<template>
  <b-form @submit.prevent="logIn()" class="log-in-form">
    <p v-if="error" class="error">
      {{ error }}
    </p>
    <p v-if="cameFromSignUp" class="success">
      Thanks for signing up. Now you can log in and start saving banners.
    </p>
    <b-input-group>
      <b-input
        v-model="username"
        :state="usernameOkButNotAvailable"
        @change="checkUsernameAvailable()"
        placeholder="Username"
        required
      />
      <b-form-invalid-feedback :state="usernameOkButNotAvailable">
        <p v-if="usernameTooShort">
          Your username must be longer than 4 characters.
        </p>
        <p v-if="usernameTooLong">
          Your username must be shorter than 24 characters.
        </p>
        <p v-if="usernameAvailable">
          That username isn't registered. Did you mean to
          <nuxt-link to="/signup">sign up</nuxt-link>?
        </p>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group>
      <b-input
        v-model="password"
        :state="passwordOk"
        type="password"
        placeholder="Password"
      />
    </b-input-group>

    <b-button
      :disabled="loggingIn"
      type="submit"
      variant="primary"
      block
      required
    >
      <span v-if="loggingIn">Logging In...</span>
      <span v-else>Log In</span>
    </b-button>
  </b-form>
</template>

<script>
import UsernameFormMixin from '~/mixins/auth/username_form_mixin'
import PasswordFormMixin from '~/mixins/auth/password_form_mixin'

export default {
  name: 'LogInForm',
  mixins: [UsernameFormMixin, PasswordFormMixin],
  data() {
    return {
      loggingIn: false,
      error: ''
    }
  },
  computed: {
    cameFromSignUp() {
      const param = this.$route.query.r
      return param && param === 's'
    }
  },
  methods: {
    async logIn() {
      this.error = ''
      this.loggingIn = true

      const result = await this.$store.dispatch('user/logIn', {
        username: this.username,
        password: this.password
      })

      if (result.status !== 200) {
        this.error = result.message
      } else {
        this.$router.push('/dashboard')
      }

      this.loggingIn = false
    }
  }
}
</script>

<style lang="scss" scoped>
.log-in-form {
  .error {
    color: #ec4e20;
  }

  .success {
    color: #4299e1;
  }

  input {
    margin-bottom: 15px;
  }
}
</style>
