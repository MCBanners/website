// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/require-default-prop': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
})
