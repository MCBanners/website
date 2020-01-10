<template>
  <div>
    <b-form @submit.prevent inline class="quick-server-banner">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text>
            <fa :icon="['fas', 'server']" />
          </b-input-group-text>
        </b-input-group-prepend>

        <b-input v-model="ip" placeholder="Server IP" required />
      </b-input-group>

      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text>
            <fa :icon="['fas', 'server']" />
          </b-input-group-text>
        </b-input-group-prepend>

        <b-input v-model="port" placeholder="Port (25565)" />
      </b-input-group>
      <b-button
        @click="openQuickServerBanner()"
        type="submit"
        variant="primary"
      >
        Create
      </b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'QuickServerBanner',
  data() {
    return {
      ip: '',
      port: ''
    }
  },
  methods: {
    openQuickServerBanner() {
      if (!this.ip) return undefined

      let port = this.port
      if (!port || isNaN(port)) {
        port = 25565
      }

      this.$router.push(`servers?ip=${this.ip}&port=${port}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.quick-server-banner {
  * {
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
  }

  .input-group-text {
    border: none;
    background: #eee;
    border-right: 3px solid #ddd;
  }

  .input-group {
    margin: 0 auto 10px auto;
    width: 100%;

    input {
      border: none;
      background: #eee;

      &:focus {
        box-shadow: none;
      }
    }

    @media (min-width: 992px) {
      margin: 0 10px 0 0;
      width: auto;

      input {
        display: inline;
      }
    }
  }

  button {
    font-weight: 700;
    display: block;
    width: 100%;

    .icon {
      margin-left: 8px;
      margin-bottom: 1px;
    }

    @media (min-width: 992px) {
      display: inline-block;
      width: auto;
    }
  }
}
</style>
