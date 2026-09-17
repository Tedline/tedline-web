<script setup lang="ts">
import {
  PlayCircleIcon,
  VideoCameraSlashIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'home',
})

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => `${t('webinarsPage.metaTitle')} | ${t('tedline')}`,
  description: () => t('webinarsPage.subtitle'),
})

// Prepared state for upcoming webinars API integration
const webinars = ref<any[]>([])
const loading = ref(false)

// Placeholder for future API call:
// const api = useApi(false)
// const { data: webinarsData, pending } = await useLazyAsyncData('getWebinars', () => api('/webinar/list/'))
</script>

<template>
  <main class="relative isolate min-h-screen overflow-hidden bg-white pt-24 dark:bg-black sm:pt-28">
    <!-- Ambient Background Gradients -->
    <div class="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-gradient-to-b from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-black dark:to-black" />
    <div class="absolute -top-24 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />

    <section class="mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-8 lg:pb-28">
      <!-- Header Section -->
      <div class="mx-auto max-w-3xl text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0379e7] text-white shadow-lg shadow-blue-500/20">
          <PlayCircleIcon class="h-7 w-7" aria-hidden="true" />
        </div>
        <p class="mt-6 text-sm font-semibold text-[#0379e7] dark:text-blue-400">
          {{ t('webinarsPage.eyebrow') }}
        </p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          {{ t('webinarsPage.title') }}
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
          {{ t('webinarsPage.subtitle') }}
        </p>
      </div>

      <!-- Main Content Area -->
      <div class="mx-auto mt-12 max-w-4xl">
        <!-- Future Webinars Grid (when data exists) -->
        <div v-if="webinars.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="webinar in webinars"
            :key="webinar.id"
            class="rounded-3xl border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 p-6"
          >
            <h3 class="font-bold text-gray-900 dark:text-white">{{ webinar.title }}</h3>
          </div>
        </div>

        <!-- Empty State (No Webinars) -->
        <div
          v-else
          class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl shadow-gray-900/5 dark:border-stone-800 dark:bg-stone-900/60 sm:p-14"
        >
          <!-- Subtle Glow inside Card -->
          <div class="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div class="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

          <div class="relative z-10 flex flex-col items-center">
            <!-- Empty State Icon -->
            <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-[#0379e7] dark:bg-blue-950/50 dark:text-blue-400">
              <VideoCameraSlashIcon class="h-10 w-10" aria-hidden="true" />
            </div>

            <!-- Empty State Text -->
            <h2 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {{ t('webinarsPage.noWebinarsTitle') }}
            </h2>
            <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
              {{ t('webinarsPage.noWebinarsDesc') }}
            </p>

            <!-- Action Buttons -->
            <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
              <UButton
                :to="localePath('/explore?tab=courses')"
                size="lg"
                class="rounded-full px-6 font-semibold shadow-lg shadow-blue-500/15"
              >
                <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 me-2" />
                {{ t('webinarsPage.exploreCourses') }}
              </UButton>

              <UButton
                :to="localePath('/')"
                variant="ghost"
                size="lg"
                class="rounded-full px-6"
              >
                <UIcon name="i-heroicons-home" class="w-5 h-5 me-2" />
                {{ t('webinarsPage.backHome') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
