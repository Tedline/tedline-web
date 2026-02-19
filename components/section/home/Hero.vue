<template>
  <div class="bg-white dark:bg-black">
    <div class="relative isolate overflow-hidden bg-gradient-to-b from-zinc-100/20 dark:from-zinc-900/20">
      <div class="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:pt-40 lg:pb-20">
        <div class="px-6 lg:px-0 lg:pt-4 rtl:float-left ltr:float-right">
          <div class="mx-auto max-w-2xl">
            <div class="max-w-lg">
              <div class="mt-24 sm:mt-32 lg:mt-10">
                <a href="#" class="inline-flex space-x-6 rtl:space-x-reverse">
                  <span
                    class="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20">What's
                    new</span>

                  <span
                    class="inline-flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">
                    <span>{{ $t('tagline') }}</span>
                  </span>
                </a>
              </div>
              <h1 class="text-4xl mt-9 font-bold text-blue-500 dark:text-blue-300">

                <span class="relative whitespace-nowrap text-black dark:text-white">
                  <svg aria-hidden="true" viewBox="0 0 418 42"
                    class="absolute left-0 rtl:left-0 ltr:right-0 top-2/3 h-[0.58em] w-full fill-gray-200/70 dark:fill-gray-700/70"
                    preserveAspectRatio="none">
                    <path
                      d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                  </svg>
                  <span class="relative">
                    {{ $t('title') }}
                  </span>
                </span>
                {{ $t('tedline_hero') }}
              </h1>
              <p class="mt-6 text-md leading-8 text-gray-600 dark:text-gray-300">{{ $t('description') }}</p>
              <div class="mt-10 ">

                <div class="max-w-md">
                  <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">{{
                    $t('search') }}</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 rtl:start-0 ltr:end-0 flex items-center pr-3 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input type="search" id="default-search" v-model="text"
                      v-on:keyup.enter="$router.push(localePath('/explore/?search=' + text));"
                      class="block w-full p-4 rtl:pr-10 ltr:pl-24  text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/60 dark:text-gray-100 dark:border-gray-800 focus:dark:ring-1 dark:focus:ring-blue-400 dark:focus:border-blue-400 focus:outline-none"
                      :placeholder="$t('searchPlaceholder')" required />
                    <button @click="$router.push(localePath('/explore/?search=' + text));"
                      class="text-white absolute rtl:end-2.5 ltr:start-2.5 bottom-2.5 bg-gradient-to-tl from-blue-600 to-blue-400 hover:bg-blue-800 focus:ring-4  focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 dark:from-blue-700 dark:to-blue-500 dark:hover:bg-blue-900 dark:focus:ring-blue-700 focus:outline-none">{{
                        $t('search') }}</button>
                  </div>
                </div>

                <div class="h-24 overflow-hidden">
                  <transition enter-active-class="transition duration-500 ease-out"
                    enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-4">
                    <div v-if="pending"></div>
                    <div v-else-if="error" class="max-w-md">
                      <UiError />
                    </div>
                    <div v-else class="flex flex-wrap mt-2">
                      <NuxtLinkLocale v-for="item in data" :key="item.id" :to="'/explore/?category=' + item.id"
                        class="rounded-full mx-1 bg-slate-400/10 px-3 py-1 text-xs leading-5 text-slate-600 ring-1 ring-inset ring-slate-600/10 dark:bg-slate-700/20 dark:text-slate-200 dark:ring-slate-400/20">
                        {{ item.title }}
                      </NuxtLinkLocale>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-20 sm:mt-24 md:mx-auto md:max-w-xl 2xl:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen rtl:float-left ltr:float-right">
          <div
            class="absolute inset-y-0 rtl:left-1/2 ltr:right-1/2 -z-10 rtl:-mr-10 ltr:-ml-10 w-[200%] skew-x-[30deg] bg-white/40 backdrop-blur-lg shadow-2xl shadow-gray-600/20 ring-1 ring-indigo-50/30 md:rtl:-ml-20 md:ltr:-mr-20 lg:rtl:-ml-36 lg:ltr:-mr-36 dark:bg-black/50 dark:shadow-zinc-700/30 dark:ring-zinc-900/20"
            aria-hidden="true" />

          <div class="relative inset-0 isolate h-[400px] -z-50  bg-blue-50 dark:bg-blue-900/40 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))] rounded-b-[80px] ">
             <div
                class="absolute z-10  shadow-2xl shadow-black -inset-y-px rtl:left-1/2 ltr:right-1/2  rtl:mr-10 ltr:ml-10 w-[200%] skew-x-[30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:rtl:mr-20 md:ltr:ml-20 lg:rtl:mr-36 lg:ltr:ml-36 dark:bg-zinc-900 dark:ring-zinc-800"
                aria-hidden="true" />
            <div
              class="absolute bg-blue-500 bottom-0   dark:bg-blue-700  rtl:rounded-tl-3xl ltr:rounded-tr-3xl rounded-bl-[80px] h-[300px] w-lg">
             

            </div>
            <div class="absolute z-10 ">
              <img src="/images/test3.png" class="h-[400px] transform  rtl:-scale-x-100" alt="">
            </div>
          </div>
          <div class="shadow-lg sr-only md:rounded-3xl dark:shadow-zinc-900/30 invisible">
            <div
              class="bg-indigo-500  [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))] dark:bg-indigo-700">
              <div
                class="absolute -inset-y-px rtl:right-1/2 ltr:left-1/2 -z-10 rtl:mr-10 ltr:ml-10 w-[200%] skew-x-[30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:rtl:mr-20 md:ltr:ml-20 lg:rtl:mr-36 lg:ltr:ml-36 dark:bg-zinc-900 dark:ring-zinc-800"
                aria-hidden="true" />
              <div class="relative px-6 pt-8 sm:pt-16 md:rtl:pr-16 md:rtl:pl-0 md:ltr:pl-16 md:ltr:pr-0">
                <div class="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                  <div class="w-screen overflow-hidden ltr:rounded-tl-4xl rtl:rounded-tr-4xl bg-white dark:bg-zinc-800">
                    <div class="">
                      <!-- Your code example -->
                    
                    </div>
                  </div>
                </div>
                <div
                  class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl dark:ring-white/10"
                  aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32 dark:from-black" />
    </div>
  </div>
</template>

<script setup>

const api = useApi(false)
const localePath = useLocalePath()
const text = ref('');
const { data, pending, error } = await useLazyAsyncData('getHeroCategoryData', async () => {
  const response = await api(
        `/course/CourseCategoryPopular/`
      )
  return response.slice(0, 4);
});
</script>
