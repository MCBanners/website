// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  routeRules: {
    '/servers': { redirect: { to: '/', statusCode: 301 } },
    '/authors': { redirect: { to: '/', statusCode: 301 } },
    '/resources': { redirect: { to: '/', statusCode: 301 } },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      mcbannersApiBase: 'https://api.mcbanners.com',
    },
  },

  experimental: {
    viewTransition: true,
  },

  // MCBanners is intentionally dark-only. Nuxt UI still reads color mode,
  // so keep it pinned rather than exposing a user-facing theme switch.
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  compatibilityDate: '2026-05-14',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/builder'],
    },
  },

  image: {
    format: ['webp'],
  },
})
