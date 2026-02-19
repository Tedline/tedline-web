
<template>
    <div>
          <!-- Mobile drawer -->
    <div class="bg-black/30 z-90 fixed h-full w-screen" @click="drawerOpen = false" v-if="drawerOpen"></div>
           
        <UDrawer v-model:open="drawerOpen" :modal="false" class="lg:hidden">
          <template #content>
            <div class="p-4">
            <SectionCourseDetailLearnSessions />
          </div>
            </template>
        </UDrawer>
      <TransitionRoot as="template" :show="sidebarOpen">
        <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
          <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>
  
          <div class="fixed inset-0 flex">
            <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="rtl:-translate-x-full ltr:translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="rtl:-translate-x-full ltr:translate-x-full">
              <DialogPanel class="relative rtl:ml-16 ltr:mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                  <div class="absolute ltr:left-full rtl:right-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                      <span class="sr-only">Close sidebar</span>
                      <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Static sidebar for desktop -->
      <LayoutSlideshow />
  
      <div class="lg:rtl:pr-18 lg:ltr:pl-18">

        <!-- Desktop sidebar -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-stone-900/60  pb-4 shadow-lg">
            <nav class="flex flex-1 flex-col mt-5">
              <SectionCourseDetailLearnSessions />
            </nav>
          </div>
        </div>

        <!-- Mobile sticky header with sessions tabs -->
        <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-3 border-b border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            class="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            @click="drawerOpen = true"
          >
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Horizontal sessions tabs (act as navigation) -->
          <div v-if="isLearnPage && sessions.length" class="flex-1 overflow-x-auto bg-gray-100 dark:bg-stone-800 p-2 rounded-xl">
            <nav class="flex items-center gap-2 min-w-max ">
              <NuxtLinkLocale
                v-for="sessionItem in sessions"
                :key="sessionItem.id"
                :to="`/course/learn/${courseId}/${sessionItem.id}`"
                class="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors"
                :class="[
                  route.params.session === String(sessionItem.id)
                    ? 'bg-blue-600 text-white dark:bg-gray-100/80 dark:text-stone-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-stone-800  dark:text-gray-200 dark:hover:bg-stone-700'
                ]"
              >
                {{ sessionItem.title }}
              </NuxtLinkLocale>
            </nav>
          </div>
        </div>

        <main class="lg:ps-72">
          <div class=" md:px-4 py-6 sm:px-6 lg:px-8 pb-20">
            <slot/>
          </div>
        </main>
        <LayoutBottomNavigation />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  import {
    XMarkIcon,
    Bars3Icon,
  } from '@heroicons/vue/24/outline'
  const route = useRoute()
  const api = useApi(false)
  
  
  const sidebarOpen = ref(false)
  const drawerOpen = ref(false)

  // Sessions data for mobile top tabs on learn pages
  const sessions = ref([])
  const isLearnPage = computed(() => route.path.startsWith('/course/learn/'))
  const courseId = computed(() => route.params.id)

  const fetchCourseSessions = async () => {
    if (!isLearnPage.value || !courseId.value) {
      sessions.value = []
      return
    }
    try {
      const response = await api(`course/RetrieveCourses/${courseId.value}/`)
      sessions.value = Array.isArray(response?.session) ? response.session : []
    } catch (error) {
      console.error('Failed to load course sessions for tabs:', error)
      sessions.value = []
    }
  }

  onMounted(fetchCourseSessions)
  watch(() => route.fullPath, () => {
    fetchCourseSessions()
  })
  </script>