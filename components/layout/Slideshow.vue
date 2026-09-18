<script setup>
import { ref, onMounted, watch } from 'vue'
import {
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ArrowLeftStartOnRectangleIcon
} from '@heroicons/vue/24/outline'
import NotificationBell from '~/components/notifications/NotificationBell.vue'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
    { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon, current: false },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon, current: false },
    { name: 'Help desk', href: '/helpdesk', icon: DocumentDuplicateIcon, current: false },
    { name: 'Reports', href: '/dashboard/reports', icon: ChartPieIcon, current: false },
]

onMounted(() => {
    if (userStore.isAuthenticated) {
        notificationStore.startPolling()
    }
})

watch(() => userStore.isAuthenticated, (isAuth) => {
    if (isAuth) {
        notificationStore.startPolling()
    } else {
        notificationStore.stopPolling()
    }
})

function handleLogout() {
    notificationStore.stopPolling()
    userStore.logout();
    navigateTo('/');
}

const sidebarOpen = ref(false)
</script>

<template>
<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:block lg:w-18 lg:overflow-visible lg:bg-gray-900 dark:bg-gradient-to-t dark:from-[#110c2c] dark:from-70% dark:to-[#141651] lg:pb-4 ltr:left-0 rtl:right-0 select-none">
  <div class="flex h-full flex-col justify-between">
    
    <!-- Top section (nav buttons) -->
    <nav class="mt-8">
      <ul role="list" class="flex flex-col items-center space-y-1">
        <li v-for="item in navigation" :key="item.name">
          <NuxtLinkLocale
            :to="item.href"
            active-class="bg-gray-500/20 text-white shadow-inner is-active"
            class="sidebar-nav-btn text-gray-400 group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold ltr:float-left rtl:float-right cursor-pointer select-none"
          >
            <component :is="item.icon" class="h-6 w-6 shrink-0 transition-transform duration-200 ease-out" aria-hidden="true" />
            <span class="sr-only">{{ item.name }}</span>
          </NuxtLinkLocale>
        </li>

        <!-- Desktop Hover Notification Bell -->
        <li v-if="userStore.isAuthenticated" class="pt-1">
          <NotificationBell
            mode="hover"
            placement="sidebar"
            custom-button-class="sidebar-nav-btn relative flex items-center justify-center rounded-xl p-3 text-gray-400 cursor-pointer select-none"
          />
        </li>
      </ul>
    </nav>

    <!-- Bottom button -->
    <div class="flex flex-col items-center pb-4 ltr:float-left rtl:float-right space-y-3">
      <SharedLanguageToggle class="sidebar-action-btn rounded-xl w-12 h-12 flex items-center justify-center bg-gray-700/30 text-white text-sm cursor-pointer select-none" />
      <button v-if="userStore.isAuthenticated" class="sidebar-action-btn rounded-xl w-12 h-12 flex items-center justify-center bg-gray-700/30 text-white text-sm cursor-pointer select-none" @click="handleLogout">
       <ArrowLeftStartOnRectangleIcon class="h-6 w-6 shrink-0 transition-transform duration-200 ease-out"/>
      </button>
      <SharedDarkMode class="sidebar-action-btn rounded-xl w-12 h-12 flex items-center justify-center bg-gray-700/30 text-white text-sm cursor-pointer select-none" />
    </div>

  </div>
</div>
</template>

<style scoped>
/* Top navigation buttons & notification bell */
.sidebar-nav-btn,
:deep(.sidebar-nav-btn) {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.2s ease,
              color 0.2s ease,
              box-shadow 0.2s ease,
              opacity 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Click animation for sidebar nav buttons */
.sidebar-nav-btn:active,
:deep(.sidebar-nav-btn:active) {
  transform: scale(0.9) !important;
  opacity: 0.85;
  transition-duration: 0.08s;
}

/* Desktop hover animation for sidebar nav buttons */
@media (hover: hover) and (pointer: fine) {
  .sidebar-nav-btn:hover,
  :deep(.sidebar-nav-btn:hover) {
    transform: scale(0.95);
    background-color: rgba(107, 114, 128, 0.4);
    color: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  .sidebar-nav-btn:hover :deep(svg) {
    transform: scale(0.9);
  }
}

/* Bottom utility buttons (Language, Logout, Dark Mode) */
.sidebar-action-btn,
:deep(.sidebar-action-btn) {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              background-color 0.2s ease,
              color 0.2s ease,
              box-shadow 0.2s ease,
              opacity 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Click animation for bottom buttons */
.sidebar-action-btn:active,
:deep(.sidebar-action-btn:active) {
  transform: scale(0.9) !important;
  opacity: 0.85;
  transition-duration: 0.08s;
}

/* Desktop hover animation for bottom buttons */
@media (hover: hover) and (pointer: fine) {
  .sidebar-action-btn:hover,
  :deep(.sidebar-action-btn:hover) {
    transform: scale(0.95);
    background-color: rgb(75 85 99);
    color: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  .sidebar-action-btn:hover :deep(svg) {
    transform: scale(0.95);
  }
}
</style>
