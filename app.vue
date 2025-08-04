<template>
 
    <!-- Fullscreen loading until app is ready -->
    <div v-if="!appLoaded" class="progress-bar-container">
      <div class="loader"></div>
    </div>

    <!-- Nuxt system components -->
    <NuxtLoadingIndicator />
    <VitePwaManifest />

    <!-- App Head -->
    <Head>
      <Title>{{ $t('tedline') }}</Title>
    </Head>

    <!-- App layout -->
  <UApp >
    <NuxtLayout class="dark:bg-black">
      <NuxtPage />
    </NuxtLayout>
  </UApp>

</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const config = useRuntimeConfig()

// only on debug mode, we show the loading screen
const appLoaded = ref(config.public.debug ? true : false)
const { locale, locales } = useI18n()

const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
)

useHead({
  htmlAttrs: {
    lang: currentLocale.value?.code || 'fa',
    dir: currentLocale.value?.dir || 'rtl',
  }
})

onMounted(() => {
  // Delay simulates app setup/loading
  setTimeout(() => {
    appLoaded.value = true
  }, 2000)
})
</script>

<style scoped>
.progress-bar-container {
  position: fixed;
  inset: 0;
  background-color: #1455fa;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999999;
}

.loader {
  width: 100px;
  height: 40px;
  --g: radial-gradient(farthest-side, #0000 calc(95% - 3px), #fff calc(100% - 3px) 98%, #0000 101%) no-repeat;
  background: var(--g), var(--g), var(--g);
  background-size: 30px 30px;
  animation: l9 1s infinite alternate;
}

@keyframes l9 {
  0%   { background-position: 0 50%, 50% 50%, 100% 50%; }
  20%  { background-position: 0 0, 50% 50%, 100% 50%; }
  40%  { background-position: 0 100%, 50% 0, 100% 50%; }
  60%  { background-position: 0 50%, 50% 100%, 100% 0; }
  80%  { background-position: 0 50%, 50% 50%, 100% 100%; }
  100% { background-position: 0 50%, 50% 50%, 100% 50%; }
}
</style>
