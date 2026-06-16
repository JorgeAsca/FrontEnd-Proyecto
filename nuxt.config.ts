export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-11-01',
  vite: {
    server: {
      allowedHosts: 'all',
    },
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      title: 'InventoryPro - Sistema de Gestion de Inventarios',
      meta: [
        { name: 'description', content: 'Sistema ERP para gestion de inventarios y almacen' },
      ],
    },
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || 'http://localhost:3000/api',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  routeRules: {
    '/api/**': { proxy: process.env.NUXT_API_BASE ? `${process.env.NUXT_API_BASE}/**` : 'http://localhost:3000/api/**' }
  }
})
