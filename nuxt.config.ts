// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css','~/assets/css/fonts.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-headlessui',
    'nuxt-swiper',
    '@nuxtjs/color-mode',
    'nuxt-marquee'
  ],
  i18n: {
    locales: [
      {
        code: 'fa',
        iso: 'fa-IR',
        name: 'فارسی',
        file: 'fa.json',
        dir: 'rtl',
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
        dir: 'ltr', // Left-to-right for English
      },
    ],
  
    defaultLocale: 'fa', // Set Persian as default
    langDir: '../locales/', // Directory for translation files
    strategy: 'prefix_except_default', // URLs will have /en for English, but no prefix for Persian
    detectBrowserLanguage: false,
    
  },
  headlessui: {
        prefix: 'Headless'
  },
  colorMode: {
    classSuffix: '', 
    preference: 'light', // default theme (light/dark/system)
    storageKey: 'nuxt-color-mode',
  },
  runtimeConfig: {
    public: {
      debug: process.env.DEBUG === 'true',
      apiUrl: process.env.API_URL
    }
  }
})