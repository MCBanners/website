export default {
  target: 'server',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  /*
   ** Global CSS
   */
  css: ['~/assets/global.scss', '~/assets/fonts.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-form-wizard.js',
    '~/plugins/vue-notification.client.js',
    '~/plugins/vue-clipboard.js',
    '~/plugins/requests.js',
    '~/plugins/sessions.js',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    [
      '@nuxtjs/eslint-module',
      {
        fix: true,
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas'],
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab'],
          },
        ],
      },
    ],
    'cookie-universal-nuxt',
    'nuxt-seo',
    '@nuxtjs/pwa',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // baseURL: "https://api.mcbanners.com/"
    baseURL: 'http://localhost:8100/'
  },
  /*
   ** Bootstrap Vue configuration
   ** We disable automatic injection so that we
   ** can inject it in our global SCSS file. This
   ** allows us to create our own color scheme vars.
   */
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },
  /*
   ** Build configuration
   */
  build: {
    // Extend the webpack config
    extend(config, { isClient, isDev }) {
      if (isDev) {
        config.devtool = isClient ? 'eval-source-map' : 'inline-source-map'
      }
    },
  },
  /*
   ** Server confiuration
   */
  server: {
    host: '0.0.0.0',
  },
}
