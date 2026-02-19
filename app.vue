<template>

    <!-- Nuxt system components -->
    <NuxtLoadingIndicator />
    <!-- <VitePwaManifest /> -->
    <!-- App Head -->
    <Head>
      <Title>{{ $t('tedline') }}</Title>
    </Head>

    <!-- App layout -->
  <UApp >
    <NuxtLayout class="">
      <NuxtPage />
    </NuxtLayout>
  </UApp>

</template>

<script setup>
import { useI18n } from 'vue-i18n'
// only on debug mode, we show the loading screen
const { locale, locales } = useI18n()

const userStore = useUserStore()
userStore.initialize()

const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
)

useHead({
  htmlAttrs: {
    lang: currentLocale.value?.code || 'fa',
    dir: currentLocale.value?.dir || 'rtl',
  }
})


</script>
