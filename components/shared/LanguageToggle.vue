<script setup>
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale } = useI18n()

const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
)

const toggleLanguage = () => {
  const next = locale.value === 'fa' ? 'en' : 'fa'
  setLocale(next)

  // Optional: set lang/dir in <html>
  const selected = locales.value.find((l) => l.code === next)
  useHead({
    htmlAttrs: {
      lang: selected?.code || 'en',
      dir: selected?.dir || 'ltr',
    }
  })
}
</script>

<template>
  <button
    @click="toggleLanguage"
    
  >
    {{ currentLocale?.code === 'fa' ? 'EN' : 'فا' }}
  </button>
</template>
