<template>
  <b-container>
    <b-row>
      <b-col cols="8" class="mx-auto">
        <b-card class="log-in-card" bg-variant="light" text-variant="dark">
          <template #header>
            <h3 class="text-center">Log In</h3>
          </template>
          <LogInForm />
          <template #footer>
            No account? <nuxt-link to="/signup">Sign up here</nuxt-link>.
          </template>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LogInForm from '~/components/flow/LogInForm'

export default {
  middleware: 'unauthenticated',
  components: { LogInForm },
  asyncData(ctx) {
    ctx.seo({
      name: 'MCBanners',
      title: 'Log In',
      templateTitle: '%name% - %title%'
    })
  }
}
</script>

<style lang="scss" scoped>
.log-in-card {
  margin-top: 80px;
}
</style>
