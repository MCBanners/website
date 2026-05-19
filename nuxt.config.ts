// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/seo',
    '@nuxt/image'
  ],

  routeRules: {
    '/servers': { redirect: { to: '/', statusCode: 301 } },
    '/authors': { redirect: { to: '/', statusCode: 301 } },
    '/resources': { redirect: { to: '/', statusCode: 301 } },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      mcbannersApiBase: 'http://localhost:3000'
    }
  },

  experimental: {
    viewTransition: true
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  compatibilityDate: '2026-05-14',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/builder']
    }
  },

  image: {
    format: ['webp']
  },

  ogImage: {
    zeroRuntime: true,
  },

  sitemap: {
    zeroRuntime: true,
  },

  site: {
    url: 'https://mcbanners.com',
    name: 'MCBanners - Minecraft Statistical Banners',
    description:
      'We turn backend statistics into beautiful front-end images that can be displayed on forums and more.',
    defaultLocale: 'en'
  }
})
