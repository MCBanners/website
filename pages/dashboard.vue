<template>
  <b-container>
    <h1>Logged In Dashboard</h1>
    <p>Your username is: {{ username }}</p>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  computed: mapState({
    username: (state) => state.user.username
  })
}
</script>
