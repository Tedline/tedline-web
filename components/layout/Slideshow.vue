<template>
<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4 ltr:left-0 rtl:right-0">
  <div class="flex h-full flex-col justify-between">
    
    <!-- Top section (nav buttons) -->
    <nav class="mt-8">
      <ul role="list" class="flex flex-col items-center space-y-1">
        <li v-for="item in navigation" :key="item.name">
          <a
            :href="item.href"
            :class="[
              item.current
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800',
              'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold ltr:float-left rtl:float-right'
            ]"
          >
            <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
            <span class="sr-only">{{ item.name }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- Bottom button -->
    <div class="flex flex-col items-center pb-4 ltr:float-left rtl:float-right">
      <SharedLanguageToggle class="rounded-md w-12 h-12 bg-gray-700/30 p-3 text-white hover:bg-gray-600 text-sm my-3" />
      <SharedDarkMode class="rounded-md bg-gray-700/30 p-3 text-white hover:bg-gray-600 text-sm" />
    </div>

  </div>
</div>
</template>
<script setup>
import { ref } from 'vue'
import {
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
} from '@heroicons/vue/24/outline'

const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Team', href: '#', icon: UsersIcon, current: false },
    { name: 'Projects', href: '#', icon: FolderIcon, current: false },
    { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
    { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
    { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]

const sidebarOpen = ref(false)
</script>