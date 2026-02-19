
<template>
  <div class="lg:hidden block fixed bottom-0 left-0 right-0 z-50 bg-transparent pb-2 px-4 ">
    <div class="bg-white/90 dark:bg-stone-900/70 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-stone-700/50 rounded-full mx-auto max-w-xs">
      <div class=" p-2">
        
        <nav class="flex items-center justify-around space-x-1">
          <NuxtLink
            v-for="(item, index) in menuDown"
            :key="`nav-${index}`"
            :to="item.login && !isAuthenticated ? '/auth/signIn' : item.to + `${index === 2 ? '/' + username : ''}`"
            @click="vibrateOnButtonClick;console.log(route)"
            class="relative flex flex-col items-center justify-center  rounded-full transition-all  group"
            :class="[
              currentRouteCheck(item.to) 
                ? 'text-blue-600 dark:text-blue-400 scale-105 p-3' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 p-3 dark:hover:text-gray-300 hover:scale-102'
            ]"
          >
            <!-- Background for active state -->
            <div 
              v-if="currentRouteCheck(item.to)"
              class="absolute inset-0  rounded-full shadow-lg transform transition-all duration-300 ease-out "
            />
            
            <!-- Icon container -->
            <div class="relative z-10 flex flex-col items-center ">
              <!-- Icon with smooth transition -->
              <div class="transition-all duration-300 ease-out">
                <component 
                  :is="currentRouteCheck(item.to) ? item.iconSolid : item.icon" 
                  class=" transition-all duration-300 ease-out"
                  :class="currentRouteCheck(item.to) ? 'text-black dark:text-white w-5 h-5' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 w-6 h-6'"
                />
              </div>
              
              <!-- Label with smooth animation -->
              <div
            class="sr-only"
              >
                <span 
                  v-if="currentRouteCheck(item.to)"
                  class="text-[9px] font-semibold text-black dark:text-white whitespace-nowrap"
                >
                  {{ t(item.titleKey) }}
                </span>
              </div>
            </div>
            
            <!-- Ripple effect on click -->
            <div 
              v-if="currentRouteCheck(item.to)"
              class="absolute inset-0 rounded-full bg-white/10"
            />
          </NuxtLink>
        </nav>
      </div>
    </div>
  </div>
</template>
  
  
<script setup>
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

import HomeIconSolid from '@heroicons/vue/24/solid/HomeIcon'
import MagnifyingGlassIconSolid from '@heroicons/vue/24/solid/MagnifyingGlassIcon'
import UserIconSolid from '@heroicons/vue/24/solid/UserIcon'

// Composables
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()

// Reactive data
const menuDown = ref([
  {
    titleKey: 'navigation.home',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    to: '/home',
    login: false,
  },
  {
    titleKey: 'navigation.explore',
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
    to: '/explore',
    login: false,
  },
  {
    titleKey: 'navigation.profile',
    icon: UserIcon,
    iconSolid: UserIconSolid,
    to: '/profile',
    login: true,
  },
])

// Computed properties
const isAuthenticated = computed(() => userStore.isAuthenticated)
const username = computed(() => userStore.username)

// Methods
const currentRouteCheck = (url) => { 
  return route.name?.split("__")[0].split("-").includes(url.split('/')[1]) || false
}

const vibrateOnButtonClick = () => {
  // Check if the Vibration API is supported
  if (navigator.vibrate) {
    // Vibrate for 200 milliseconds
    navigator.vibrate(1)
  } else {
    console.log("Vibration API is not supported by this browser.")
  }
}
</script>
  
<style scoped>

</style>
  