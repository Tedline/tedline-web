<template>
  <div class="min-h-screen bg-gray-50 text-gray-950 dark:bg-black dark:text-white">
    <LayoutSlideshow />

    <div class="lg:rtl:pr-18 lg:ltr:pl-18">
      <main class="relative isolate min-h-screen overflow-hidden">
        <ClientOnly>
          <UiHeroPattern />
        </ClientOnly>

        <div class="absolute inset-x-0 top-0 -z-10 h-52 border-b border-gray-200/70 bg-white/70 backdrop-blur-2xl dark:border-neutral-800/80 dark:bg-neutral-950/60" />
        <div class="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(54,174,180,0.13),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(219,255,117,0.16),transparent_24%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(54,153,180,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(154,242,250,0.11),transparent_24%)]" />

        <div class="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div class="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_28rem]">
            <section class="hidden lg:block">
              <UBadge color="primary" variant="subtle" size="lg" class="mb-6 rounded-full px-4 py-2">
                {{ $t('tedline') }}
              </UBadge>
              <h1 class="max-w-xl text-4xl font-black leading-tight text-gray-950 dark:text-white">
                {{ $t('auth.layout.title') }}
              </h1>
              <p class="mt-5 max-w-lg text-sm leading-7 text-gray-600 dark:text-gray-300">
                {{ $t('auth.layout.description') }}
              </p>

              <div class="mt-10 grid max-w-xl grid-cols-3 gap-3">
                <div class="rounded-xl border border-gray-200/80 bg-white/60 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
                  <UIcon name="i-heroicons-play-circle" class="h-6 w-6 text-primary-500" />
                  <p class="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-200">{{ $t('auth.layout.courses') }}</p>
                </div>
                <div class="rounded-xl border border-gray-200/80 bg-white/60 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
                  <UIcon name="i-heroicons-calendar-days" class="h-6 w-6 text-primary-500" />
                  <p class="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-200">{{ $t('auth.layout.learningPlan') }}</p>
                </div>
                <div class="rounded-xl border border-gray-200/80 bg-white/60 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
                  <UIcon name="i-heroicons-chart-bar-square" class="h-6 w-6 text-primary-500" />
                  <p class="mt-3 text-xs font-semibold text-gray-700 dark:text-gray-200">{{ $t('auth.layout.progress') }}</p>
                </div>
              </div>
            </section>

            <UCard
              class="w-full rounded-2xl border border-gray-200/80 bg-white/80 shadow-xl shadow-gray-200/60 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/75 dark:shadow-black/30"
              :ui="{ body: 'p-6 sm:p-8' }"
            >
              <div class="mb-8 flex items-center justify-between">
                <NuxtLinkLocale to="/" class="inline-flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-sm font-black text-white dark:bg-white dark:text-gray-950">
                    T
                  </span>
                  <span class="text-base font-black text-gray-950 dark:text-white">{{ $t('tedline') }}</span>
                </NuxtLinkLocale>
                <div class="flex items-center gap-2">
                  <SharedLanguageToggle class="rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800" />
                  <SharedDarkMode class="rounded-xl border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800" />
                </div>
              </div>

              <slot />
            </UCard>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
