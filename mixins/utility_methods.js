export default {
  methods: {
    makeSelectable(obj) {
      return Object.keys(obj).map((key) => ({
        value: key,
        text: obj[key]
      }))
    }
  }
}
