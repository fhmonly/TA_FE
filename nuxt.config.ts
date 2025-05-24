// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public, max-age=31536000, immutable',
          'content-encoding': 'br'
        }
      }
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/image', '@nuxt/ui', 'dayjs-nuxt'],
  ui: {
    prefix: 'NuxtUi'
  },
  runtimeConfig: {
    public: {
      HOST: process.env.HOST,
      API_HOST: process.env.API_HOST,
      PYTHON_API_HOST: process.env.PYTHON_API_HOST,
    }
  },
  image: {
    format: ['webp'],
    quality: 80,
  },
  css: [
    '@/assets/css/main.tw.css',
    '~/assets/css/sidebar.tw.css'
  ]
})
