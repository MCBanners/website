// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/seo', '@nuxt/image'],
  experimental: {
    viewTransition: true
  },
  ui: {
    icons: ['heroicons', 'simple-icons']
  },
  image: {
    format: ['webp']
  },
  site: {
    url: 'https://mcbanners.com',
    name: 'MCBanners - Minecraft Statistical Banners',
    description: 'We turn backend statistics into beautiful front-end images that can be displayed on forums and more.',
    defaultLocale: 'en'
  }
})
