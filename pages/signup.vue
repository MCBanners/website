<template>
  <b-container>
    <b-row>
      <b-col cols="8" class="mx-auto">
        <b-card class="sign-up-card" bg-variant="light" text-variant="dark">
          <template #header>
            <h3 class="text-center">Sign Up</h3>
          </template>
          <SignUpForm />
          <template #footer>
            Already have an account?
            <nuxt-link to="/login">Log in here</nuxt-link>.
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import SignUpForm from '~/components/flow/SignUpForm'

export default {
  components: { SignUpForm },
  middleware: 'unauthenticated',
  head({ $seo }) {
    return $seo({
      title: 'Sign Up',
    })
  },
}
</script>

<style lang="scss" scoped>
.sign-up-card {
  margin-top: 80px;
}
</style>
