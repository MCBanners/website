<template>
  <b-form class="sign-up-form" @submit.prevent="signUp()">
    <p v-if="error" class="error">
      {{ error }}
    </p>
    <b-input-group>
      <b-input
        v-model="username"
        :state="usernameOkAndAvailable"
        placeholder="Username"
        required
        @change="checkUsernameAvailable()"
      />
      <b-form-invalid-feedback :state="usernameOkAndAvailable">
        <p v-if="usernameTooShort">
          Your username must be longer than 4 characters.
        </p>
        <p v-if="usernameTooLong">
          Your username must be shorter than 24 characters.
        </p>
        <p v-if="usernameAvailable === false">
          That username is already registered. Did you mean to
          <nuxt-link to="/login">log in</nuxt-link>?
        </p>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group>
      <b-input
        v-model="email"
        :state="emailOk && emailAvailable"
        placeholder="Email"
        required
        @change="checkEmailAvailable"
      />
      <b-form-invalid-feedback :state="emailOk || emailAvailable === false">
        <p v-if="emailFormatWrong">
          That doesn't look like a valid email address.
        </p>
        <p v-if="emailAvailable === false">
          That email is already in use by another user.
        </p>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group>
      <b-input
        v-model="password"
        :state="passwordsOk"
        type="password"
        placeholder="Password"
      />
      <b-form-invalid-feedback :state="passwordsOk">
        <p v-if="passwordRequirementsNotMet">
          Your password must be at least 8 characters long.
        </p>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-input-group>
      <b-input
        v-model="passwordConfirm"
        :state="passwordsOk"
        type="password"
        placeholder="Password Confirmation"
      />
      <b-form-invalid-feedback :state="passwordsOk">
        <p v-if="passwordsDoNotMatch">
          Your password confirmation doesn't match your password.
        </p>
      </b-form-invalid-feedback>
    </b-input-group>

    <b-button
      :disabled="signingUp"
      type="submit"
      variant="primary"
      block
      required
    >
      <span v-if="signingUp">Signing Up...</span>
      <span v-else>Sign Up</span>
    </b-button>
  </b-form>
</template>

<script>
import UsernameFormMixin from '~/mixins/auth/username_form_mixin'
import EmailFormMixin from '~/mixins/auth/email_form_mixin'
import PasswordFormMixin from '~/mixins/auth/confirmable_password_form_mixin'

export default {
  name: 'SignUpForm',
  mixins: [UsernameFormMixin, EmailFormMixin, PasswordFormMixin],
  data() {
    return {
      signingUp: false,
      error: '',
    }
  },
  methods: {
    async signUp() {
      this.error = ''
      this.signingUp = true

      const result = await this.$store.dispatch('user/signUp', {
        username: this.username,
        email: this.email,
        password: this.password,
      })

      if (result.status !== 200) {
        this.error = result.message
      } else {
        this.$router.push('/login?r=s')
      }

      this.signingUp = false
    },
  },
}
</script>

<style lang="scss" scoped>
.sign-up-form {
  .error {
    color: #ec4e20;
  }

  input {
    margin-bottom: 15px;
  }
}
</style>
