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
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/ui', 'shadcn-nuxt', 'dayjs-nuxt'],
  ui: {
    prefix: 'NuxtUi'
  },
  runtimeConfig: {
    public: {
      HOST: process.env.HOST,
      API_HOST: process.env.API_HOST
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: 'Shad',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  image: {
    format: ['webp'],
    quality: 80,
  },
  css: [
    '@/assets/css/main.tw.css'
  ]
})
