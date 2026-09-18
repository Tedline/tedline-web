<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { BellIcon } from '@heroicons/vue/24/outline'
import { useNotificationStore } from '~/stores/notifications'
import NotificationDropdown from './NotificationDropdown.vue'

interface Props {
  mode?: 'hover' | 'click'
  placement?: 'sidebar' | 'header'
  customButtonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'hover',
  placement: 'sidebar',
  customButtonClass: '',
})

const { t } = useI18n()
const notificationStore = useNotificationStore()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

function clearHoverTimer() {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}

function handleMouseEnter() {
  if (props.mode !== 'hover') return
  clearHoverTimer()
  if (!isOpen.value) {
    isOpen.value = true
    if (notificationStore.recentNotifications.length === 0) {
      notificationStore.fetchRecent()
    }
  }
}

function handleMouseLeave() {
  if (props.mode !== 'hover') return
  clearHoverTimer()
  // 200ms grace period so mouse can transition to popover without abrupt closing
  hoverTimer = setTimeout(() => {
    isOpen.value = false
  }, 200)
}

function handleClick() {
  clearHoverTimer()
  isOpen.value = !isOpen.value
  if (isOpen.value && notificationStore.recentNotifications.length === 0) {
    notificationStore.fetchRecent()
  }
}

function closeDropdown() {
  clearHoverTimer()
  isOpen.value = false
}

function handleOutsideClick(event: MouseEvent) {
  if (!isOpen.value || !containerRef.value) return
  if (!containerRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeDropdown()
  }
}

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
  }
})

onBeforeUnmount(() => {
  clearHoverTimer()
  if (import.meta.client) {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative inline-block"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Bell Trigger Button -->
    <button
      type="button"
      :class="[
        customButtonClass
          ? customButtonClass
          : placement === 'sidebar'
          ? 'sidebar-nav-btn relative flex items-center justify-center rounded-xl p-3 text-gray-400 hover:text-white hover:bg-gray-500/50 transition-all duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer select-none'
          : 'relative inline-flex items-center justify-center rounded-xl p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors',
      ]"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      :aria-label="t('notifications.title')"
      @click="handleClick"
    >
      <BellIcon class="h-6 w-6 shrink-0 transition-transform duration-200 ease-out" aria-hidden="true" />
      <span class="sr-only">{{ t('notifications.title') }}</span>

      <!-- Unread Count Badge -->
      <span
        v-if="notificationStore.unreadCount > 0"
        class="absolute -top-1 ltr:-right-1 rtl:-left-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-stone-900 animate-pulse"
      >
        {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
      </span>
    </button>

    <!-- Floating Dropdown Popover -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        :class="[
          'z-[100]',
          placement === 'sidebar'
            ? 'absolute top-0 ltr:left-full ltr:ml-3 rtl:right-full rtl:mr-3'
            : 'fixed inset-x-4 top-16 max-w-sm mx-auto sm:absolute sm:inset-auto sm:top-full sm:mt-2 ltr:sm:right-0 rtl:sm:left-0 sm:mx-0',
        ]"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <NotificationDropdown @close="closeDropdown" />
      </div>
    </Transition>
  </div>
</template>
