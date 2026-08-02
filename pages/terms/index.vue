<script setup>
import {
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'home',
})

const { t } = useI18n()
const api = useApi(false)

useSeoMeta({
  title: () => t('termsPage.metaTitle'),
  description: () => t('termsPage.subtitle'),
})

const {
  data: terms,
  pending: loading,
  error,
  refresh,
} = await useLazyAsyncData('getTermsList', () =>
  api('account/TermsListApi/').then((res) => res)
)
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
          <DocumentCheckIcon class="h-7 w-7" aria-hidden="true" />
        </div>
        <p class="mt-6 text-sm font-semibold text-[#0379e7] dark:text-blue-400">
          {{ $t('tedline') }}
        </p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          {{ t('termsPage.title') }}
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
          {{ t('termsPage.subtitle') }}
        </p>
      </div>

      <!-- Content Container -->
      <div class="mx-auto mt-12 max-w-4xl">
        <!-- Loading Skeleton -->
        <div v-if="loading" class="space-y-6">
          <div
            v-for="n in 3"
            :key="n"
            class="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8"
          >
            <div class="flex items-center gap-4">
              <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-stone-800" />
              <div class="h-6 w-1/3 rounded-lg bg-gray-200 dark:bg-stone-800" />
            </div>
            <div class="mt-6 space-y-3">
              <div class="h-4 w-full rounded bg-gray-200 dark:bg-stone-800" />
              <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-stone-800" />
              <div class="h-4 w-2/3 rounded bg-gray-200 dark:bg-stone-800" />
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20 sm:p-12"
        >
          <ExclamationTriangleIcon class="h-12 w-12 text-red-500 dark:text-red-400" aria-hidden="true" />
          <h2 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('termsPage.error') }}
          </h2>
          <button
            type="button"
            @click="refresh()"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0379e7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <ArrowPathIcon class="h-4 w-4" aria-hidden="true" />
            <span>{{ t('termsPage.retry') }}</span>
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!terms || terms.length === 0"
          class="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900 sm:p-12"
        >
          <CheckCircleIcon class="h-12 w-12 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <p class="mt-4 text-base text-gray-600 dark:text-gray-400">
            {{ t('termsPage.empty') }}
          </p>
        </div>

        <!-- Terms List -->
        <div v-else class="space-y-6">
          <article
            v-for="(item, index) in terms"
            :key="item.id || index"
            class="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-900/5 transition-all duration-300 hover:border-blue-300 hover:shadow-blue-500/5 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 sm:p-8"
          >
            <div class="flex items-start gap-4">
              <!-- Item Index Badge -->
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-[#0379e7] transition group-hover:bg-[#0379e7] group-hover:text-white dark:bg-blue-950/50 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>

              <div class="flex-1 min-w-0">
                <h2 class="text-xl font-bold text-gray-950 dark:text-white">
                  {{ item.title }}
                </h2>

                <div
                  class="prose dark:prose-invert mt-4 max-w-none text-base leading-7 text-gray-600 dark:text-gray-300 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:ps-5 [&>ol]:list-decimal [&>ol]:ps-5"
                  v-html="item.body"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
