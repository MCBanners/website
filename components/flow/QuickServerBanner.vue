<script>
export default {
  name: 'QuickServerBanner',
  data() {
    return {
      ip: '',
      port: '',
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
    },
  },
}
</script>

<template>
  <div>
    <form class="quick-server-banner" @submit.prevent>
      <input v-model="ip" type="text" placeholder="Server IP" required />
      <input v-model="port" type="text" placeholder="Port (25565)" />
      <button type="submit" variant="primary" @click="openQuickServerBanner()">
        Create
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
div {
  background: #fff;
  border-radius: 50px;
  padding: 50px;
  position: relative;
  max-width: 660px;
  margin: -90px auto;

  @media (max-width: 767px) {
    padding: 40px 30px;
    border-radius: 30px;
  }
}

form {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}

input,
button {
  border: none;
  border-radius: 6px;
  outline: 0;
  width: 100%;
}

input {
  background: #eaf2f2;
  padding: 10px 20px;
  font-size: 16px;
}

button {
  background: linear-gradient(260.85deg, #19987a 11.02%, #21ba96 82.4%);
  color: #fff;
  font-weight: 700;
  padding: 10px 0;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
}
</style>
