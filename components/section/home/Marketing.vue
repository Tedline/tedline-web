<template>
  <div class=" pb-24 sm:pb-24 ">
    <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8 ">
      <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-2 lg:grid-rows-2">
        <div class="relative min-w-0">
          <div class="absolute inset-px rounded-lg  bg-white max-lg:rounded-t-4xl lg:rounded-ss-4xl dark:bg-stone-900/50 " />
          <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-ss-[calc(2rem+1px)] card-hover-layout group">
            <div class="px-5 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <UIcon name="i-heroicons-play-circle" class="h-6 w-6 text-white" />
                </div>
                <h3 class="min-w-0 text-md font-bold text-gray-900 dark:text-white">{{ $t('marketing.mobileTitle') }}</h3>
              </div>
              <p class="mt-4 max-w-xl text-sm/7 text-gray-600 dark:text-gray-400">{{ $t('marketing.mobileDesc') }}</p>
            </div>
            <div class="flex min-w-0 flex-1 items-center justify-center px-5 pt-6 pb-8 sm:px-3 lg:pb-6">
             
                <div class="w-full max-w-md min-w-0 rounded-lg bg-gray-950 p-3 text-white group-hover:bg-gray-950/90 dark:bg-stone-900">
                  <div class="mb-4 flex h-28 items-end rounded-md bg-gray-800 px-3 py-2 dark:bg-stone-800">
                    <p class="w-full rounded bg-black/45 px-3 py-2 text-center text-xs/5 text-gray-100">
                      {{ $t('marketing.playerCaption') }}
                    </p>
                  </div>
                  <div class="mb-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <div class="h-full w-2/5 rounded-full bg-sky-400" />
                  </div>
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex min-w-0 items-center gap-2">
                      <button type="button" class="inline-flex size-9 items-center justify-center rounded-full bg-white text-gray-950 transition hover:bg-gray-200" :aria-label="$t('marketing.playVideo')">
                        <svg class="ms-0.5 size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="M4 2.7c0-.8.9-1.2 1.6-.8l8 5.3c.6.4.6 1.3 0 1.7l-8 5.3c-.7.4-1.6 0-1.6-.8V2.7Z" />
                        </svg>
                      </button>
                      <span class="text-xs font-medium text-gray-300">{{ $t('marketing.videoTime') }}</span>
                    </div>
                    <button type="button" class="inline-flex max-w-full items-center gap-2 rounded-full bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-400" :aria-label="$t('marketing.askAi')">
                      <svg class="size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M8 1.5 9.3 5 13 6.2 9.3 7.5 8 11 6.7 7.5 3 6.2 6.7 5 8 1.5ZM3.5 9.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Zm9.2 1 .5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" />
                      </svg>
                       {{ $t('marketing.askAi') }}
                    </button>
                  </div>
                  
                </div>
          
            </div>

          </div>
          <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl lg:rounded-ss-4xl dark:outline-white/15" />
        </div>
        <div class="relative min-w-0">
          <div class="absolute inset-px rounded-lg bg-white lg:rounded-se-4xl dark:bg-stone-900/50" />
          <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-se-[calc(2rem+1px)] card-hover-layout group">
            <div class="px-5 pt-8 sm:px-10 sm:pt-10">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
                  <UIcon name="i-heroicons-chat-bubble-left-right" class="h-6 w-6 text-white" />
                </div>
                <h3 class="min-w-0 text-md font-bold text-gray-900 dark:text-white">{{ $t('marketing.performanceTitle') }}</h3>
              </div>
              <p class="mt-4 max-w-xl text-sm/7 text-gray-600 dark:text-gray-400">{{ $t('marketing.performanceDesc') }}</p>
            </div>
            <div class="flex min-w-0 flex-1 items-center justify-center px-5 pt-8 pb-10 sm:px-10 lg:pb-8">
              <div class="w-full max-w-md min-w-0 rounded-lg border border-gray-200 p-4 light:group-hover:bg-gray-50/50 dark:border-white/10 dark:bg-stone-950/40">
                <div class="flex items-start gap-3">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                    {{ $t('marketing.questionInitial') }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="rounded-lg bg-white px-4 py-3 text-sm/6 text-gray-700 shadow-sm ring-1 ring-gray-200 dark:bg-stone-900 dark:text-gray-200 dark:ring-white/10">
                      {{ $t('marketing.videoQuestion') }}
                    </div>
                    <div class="mt-3 flex min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-stone-900">
                      <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ $t('marketing.questionMoment') }}</span>
                      <button type="button" class="inline-flex size-9 items-center justify-center rounded-full bg-gray-950 text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200" :aria-label="$t('marketing.playQuestionMoment')">
                        <svg class="ms-0.5 size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="M4 2.7c0-.8.9-1.2 1.6-.8l8 5.3c.6.4.6 1.3 0 1.7l-8 5.3c-.7.4-1.6 0-1.6-.8V2.7Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-se-4xl dark:outline-white/15" />
        </div>
        <div class="relative min-w-0">
          <div class="absolute inset-px rounded-lg bg-white lg:rounded-es-4xl dark:bg-stone-900/50" />
          <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-es-[calc(2rem+1px)] card-hover-layout group">
            <div class="px-5 pt-8 sm:px-10 sm:pt-10">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                  <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-white" />
                </div>
                <h3 class="min-w-0 text-md font-bold text-gray-900 dark:text-white">{{ $t('marketing.securityTitle') }}</h3>
              </div>
              <p class="mt-4 max-w-xl text-sm/7 text-gray-600 dark:text-gray-400">{{ $t('marketing.securityDesc') }}</p>
            </div>
            <div class="flex min-w-0 flex-1 items-center justify-center px-5 pt-6 pb-8 sm:px-10 lg:pb-6">
              <div class="w-full max-w-md min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-4 light:group-hover:bg-gray-50/50 dark:border-white/10 dark:bg-stone-950/40">
                <div class="mb-3 flex items-center justify-between gap-3">
                  <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ $t('marketing.quizTitle') }}</span>
                  <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">{{ $t('marketing.quizScore') }}</span>
                </div>
                <p class="text-sm/6 font-medium text-gray-900 dark:text-white">{{ $t('marketing.quizQuestion') }}</p>
                <div class="mt-3 space-y-2">
                  <div class="flex items-center justify-between rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-emerald-500/30 dark:bg-stone-900 dark:text-gray-100">
                    <span>{{ $t('marketing.answerForce') }}</span>
                    <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-300">{{ $t('marketing.correct') }}</span>
                  </div>
                  <div class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 dark:border-white/10 dark:bg-stone-900 dark:text-gray-400">{{ $t('marketing.answerEnergy') }}</div>
                  <div class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 dark:border-white/10 dark:bg-stone-900 dark:text-gray-400">{{ $t('marketing.answerPower') }}</div>
                </div>
                <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3 text-xs font-medium text-gray-500 dark:border-white/10 dark:text-gray-400">
                  <span>{{ $t('marketing.todayRank') }}</span>
                  <span>{{ $t('marketing.totalScore') }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-es-4xl dark:outline-white/15" />
        </div>
        <div class="relative min-w-0">
          <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-ee-4xl dark:bg-stone-900/50" />
          <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-ee-[calc(2rem+1px)] card-hover-layout group">
            <div class="px-5 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
              <div class="flex min-w-0 items-center gap-3">
                <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                  <UIcon name="i-heroicons-rectangle-stack" class="h-6 w-6 text-white" />
                </div>
                <h3 class="min-w-0 text-md font-bold text-gray-900 dark:text-white">{{ $t('marketing.apiTitle') }}</h3>
              </div>
              <p class="mt-4 max-w-xl text-sm/7 text-gray-600 dark:text-gray-400">{{ $t('marketing.apiDesc') }}</p>
            </div>
            <div class="flex min-w-0 w-full grow items-center justify-center px-5 py-10 pb-15 sm:px-10">
              <div class="relative w-full max-w-sm min-w-0">
                <div class="absolute inset-x-6 top-5 h-full rounded-lg border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-stone-800/70" />
                <div class="absolute inset-x-3 top-2 h-full rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-stone-900" />
                <div class="relative rounded-lg border border-gray-200  light:group-hover:bg-indigo-50/50 light:group-hover:backdrop-blur-sm bg-white p-5 shadow-sm dark:border-white/10 dark:bg-stone-950">
                  <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">{{ $t('marketing.physicsLesson') }}</span>
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ $t('marketing.flashcardProgress') }}</span>
                  </div>
                  <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ $t('marketing.flashcardLabel') }}</p>
                  <p class="mt-3 text-lg/7 font-semibold text-gray-950 dark:text-white">{{ $t('marketing.flashcardQuestion') }}</p>
                  <p class="mt-4 rounded-lg  px-4 py-3 text-sm/6 text-gray-600 dark:bg-stone-900 dark:text-gray-300">
                    {{ $t('marketing.flashcardAnswer') }}
                  </p>
                  <div class="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                    <div class="h-full w-1/4 rounded-full bg-sky-500" />
                  </div>
                  <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <button type="button" class="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5">
                      {{ $t('marketing.nextCard') }}
                    </button>
                    <button type="button" class="rounded-full bg-gray-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200">
                      {{ $t('marketing.reviewed') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-ee-4xl dark:outline-white/15" />
        </div>
      </div>
    </div>
  </div>
</template>
