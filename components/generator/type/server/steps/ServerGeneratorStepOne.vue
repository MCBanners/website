<template>
  <b-row>
    <b-col cols="12">
      <p>
        Enter the IP of your server in the "Server IP" box. If you are
        <b>not</b> using the default port (25565) you can leave the "Server
        Port" box blank.
      </p>
    </b-col>
    <b-col cols="12">
      <b-form>
        <b-input-group prepend="Server IP" class="mb-2 mr-sm-2">
          <b-form-input
            id="inline-form-input-ip"
            v-model="tempIP"
            @change="$emit('update', { tempIP })"
          ></b-form-input>
        </b-input-group>
        <b-input-group prepend="Server Port" class="mb-2 mr-sm-2">
          <b-form-input
            id="inline-form-input-port"
            v-model="tempPort"
            @change="$emit('update', { tempPort })"
          ></b-form-input>
        </b-input-group>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'ServerGeneratorStepOne',
  data() {
    return {
      tempIP: undefined,
      tempPort: undefined
    }
  },
  mounted() {
    const obj = this.$route.query
    if (Object.keys(obj).length) {
      const event = {}

      if (obj.ip) {
        this.tempIP = obj.ip
        event.tempIP = this.tempIP
      }

      if (obj.port && !isNaN(obj.port)) {
        this.tempPort = obj.port
        event.tempPort = this.tempPort
      }

      this.update(event)
    }
  },
  methods: {
    update(payload) {
      this.$emit('update', payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.input-group {
  > .input-group-prepend {
    flex: 0 0 20%;
  }

  .input-group-text {
    width: 100%;
  }
}
</style>
