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

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      mcbannersApiBase: 'https://api.mcbanners.com'
    }
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2026-05-14',

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/resources', '/authors', '/servers']
    }
  },

  image: {
    format: ['webp']
  },

  ogImage: {
    zeroRuntime: true
  },

  site: {
    url: 'https://mcbanners.com',
    name: 'MCBanners - Minecraft Statistical Banners',
    description:
      'We turn backend statistics into beautiful front-end images that can be displayed on forums and more.',
    defaultLocale: 'en'
  }
})
