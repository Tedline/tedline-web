
<template>
  <div class="lg:hidden block fixed bottom-0 left-0 right-0 z-50 bg-transparent pb-2 px-4 select-none">
    <div class="bg-white/90 dark:bg-stone-900/70 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-stone-700/50 rounded-full mx-auto max-w-xs">
      <div class="p-2">
        
        <nav class="flex items-center justify-around space-x-1">
          <NuxtLinkLocale
            v-for="(item, index) in menuDown"
            :key="`nav-${index}`"
            :to="item.login && !isAuthenticated ? '/auth/signIn' : (index === 2 && username ? `${item.to}/${username}` : item.to)"
            @click="vibrateOnButtonClick"
            class="bottom-nav-item relative flex flex-col items-center justify-center rounded-full p-3 group"
            :class="[
              currentRouteCheck(item.to) 
                ? 'is-active text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
            ]"
          >
            <!-- Background for active state -->
            <div 
              v-if="currentRouteCheck(item.to)"
              class="absolute inset-0 rounded-full bg-gray-100/80 dark:bg-white/10 shadow-sm transition-all duration-300 ease-out"
            />
            
            <!-- Icon container -->
            <div class="relative z-10 flex flex-col items-center">
              <!-- Icon with smooth transition -->
              <div class="transition-transform duration-200 ease-out">
                <component 
                  :is="currentRouteCheck(item.to) ? item.iconSolid : item.icon" 
                  class="nav-icon transition-all duration-200 ease-out"
                  :class="currentRouteCheck(item.to) ? 'text-black dark:text-white w-5 h-5' : 'text-gray-500 dark:text-gray-400 w-6 h-6'"
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
              class="absolute inset-0 rounded-full bg-white/10 pointer-events-none"
            />
          </NuxtLinkLocale>
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
    to: '/',
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
  const target = url.split('/')[1]
  const routeSegments = route.name ? String(route.name).split('__')[0].split('-') : []

  if (!target) {
    return routeSegments.includes('index') || route.path === '/' || route.path === '/en' || route.path === '/en/'
  }

  return routeSegments.includes(target) || route.path.startsWith(`/${target}`) || route.path.startsWith(`/en/${target}`)
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
.bottom-nav-item {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.2s ease,
              background-color 0.2s ease,
              opacity 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  cursor: pointer;
  touch-action: manipulation;
}

/* Active tab default scale */
.bottom-nav-item.is-active {
  transform: scale(1.05);
}

/* Click animation: instant tactile press feedback on tap/click across all devices */
.bottom-nav-item:active {
  transform: scale(0.92) !important;
  opacity: 0.8;
  transition-duration: 0.08s;
}

/* Hover animation: strictly restricted to devices that support true pointer hover (mouse / desktop).
   On phones and touch screens, this media query does NOT match, ensuring no sticky hover! */
@media (hover: hover) and (pointer: fine) {
  .bottom-nav-item:not(.is-active):hover {
    transform: scale(1.06);
    background-color: rgba(0, 0, 0, 0.04);
  }

  .bottom-nav-item:not(.is-active):hover .nav-icon {
    color: rgb(55 65 81); /* text-gray-700 */
  }

  :global(.dark .bottom-nav-item:not(.is-active):hover) {
    background-color: rgba(255, 255, 255, 0.06);
  }

  :global(.dark .bottom-nav-item:not(.is-active):hover .nav-icon) {
    color: rgb(209 213 219); /* text-gray-300 */
  }

  .bottom-nav-item.is-active:hover {
    transform: scale(1.08);
  }
}
</style>
  