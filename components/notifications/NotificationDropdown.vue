<script setup lang="ts">
import { computed } from 'vue'
import {
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  LifebuoyIcon,
  BellIcon,
  BellSlashIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'
import moment from 'moment-jalaali'
import { useNotificationStore, type NotificationItem, type NotificationType } from '~/stores/notifications'

// Configure moment-jalaali dialect
if (typeof moment.loadPersian === 'function') {
  moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t, locale } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const notificationStore = useNotificationStore()

const isRtl = computed(() => locale.value === 'fa')

// Map category notification types to icons and styling
const typeConfig: Record<
  NotificationType,
  { icon: any; bgClass: string; textClass: string }
> = {
  course: {
    icon: AcademicCapIcon,
    bgClass: 'bg-blue-50 dark:bg-blue-500/15',
    textClass: 'text-blue-600 dark:text-blue-400',
  },
  quiz: {
    icon: ClipboardDocumentCheckIcon,
    bgClass: 'bg-emerald-50 dark:bg-emerald-500/15',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
  comment: {
    icon: ChatBubbleLeftRightIcon,
    bgClass: 'bg-purple-50 dark:bg-purple-500/15',
    textClass: 'text-purple-600 dark:text-purple-400',
  },
  wallet: {
    icon: CreditCardIcon,
    bgClass: 'bg-amber-50 dark:bg-amber-500/15',
    textClass: 'text-amber-600 dark:text-amber-400',
  },
  ticket: {
    icon: LifebuoyIcon,
    bgClass: 'bg-rose-50 dark:bg-rose-500/15',
    textClass: 'text-rose-600 dark:text-rose-400',
  },
  system: {
    icon: BellIcon,
    bgClass: 'bg-sky-50 dark:bg-sky-500/15',
    textClass: 'text-sky-600 dark:text-sky-400',
  },
}

function getTypeIcon(type: NotificationType) {
  return typeConfig[type]?.icon || BellIcon
}

function getTypeStyles(type: NotificationType) {
  return (
    typeConfig[type] || {
      bgClass: 'bg-gray-100 dark:bg-white/10',
      textClass: 'text-gray-600 dark:text-gray-300',
    }
  )
}

function getItemTitle(item: NotificationItem): string {
  if (locale.value === 'fa' && item.title_fa) return item.title_fa
  if (locale.value === 'en' && item.title_en) return item.title_en
  return item.title || ''
}

function getItemMessage(item: NotificationItem): string {
  if (locale.value === 'fa' && item.message_fa) return item.message_fa
  if (locale.value === 'en' && item.message_en) return item.message_en
  return item.message || ''
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffSec = Math.max(0, Math.floor((now - then) / 1000))
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) {
    return t('notifications.time.justNow')
  }
  if (diffMin < 60) {
    return t('notifications.time.minutesAgo', { count: diffMin })
  }
  if (diffHour < 24) {
    return t('notifications.time.hoursAgo', { count: diffHour })
  }
  if (diffDay === 1) {
    return t('notifications.time.yesterday')
  }
  if (diffDay < 30) {
    return t('notifications.time.daysAgo', { count: diffDay })
  }

  // Older dates: format using moment
  if (locale.value === 'fa') {
    return moment(dateStr).format('jYYYY/jMM/jDD')
  }
  return moment(dateStr).format('YYYY/MM/DD')
}

async function handleItemClick(item: NotificationItem) {
  if (!item.is_read) {
    await notificationStore.markAsRead(item.id)
  }

  emit('close')

  if (item.action_url) {
    if (item.action_url.startsWith('http://') || item.action_url.startsWith('https://')) {
      window.open(item.action_url, '_blank')
    } else {
      router.push(localePath(item.action_url))
    }
  }
}
</script>

<template>
  <div
    class="w-80 sm:w-96 rounded-3xl border border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col dark:border-white/10 dark:bg-stone-900/95 transition-all"
    role="dialog"
    aria-modal="true"
    :aria-label="t('notifications.title')"
  >
    <!-- Header -->
    <div class="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/10">
      <div class="flex items-center gap-2.5">
        <h3 class="text-sm font-bold text-gray-900 dark:text-white">
          {{ t('notifications.title') }}
        </h3>
        <span
          v-if="notificationStore.unreadCount > 0"
          class="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
        >
          {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
        </span>
      </div>

      <button
        type="button"
        class="p-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-white/10 transition-colors"
        @click="$emit('close')"
      >
        <span class="sr-only">Close</span>
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Content / Notification List -->
    <div class="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
      <!-- Loading Skeletons -->
      <div
        v-if="notificationStore.isLoadingRecent && notificationStore.recentNotifications.length === 0"
        class="p-4 space-y-3"
      >
        <div v-for="n in 3" :key="n" class="flex items-start gap-3 animate-pulse">
          <div class="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-white/10 shrink-0" />
          <div class="flex-1 space-y-2 py-1">
            <div class="h-3.5 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
            <div class="h-2.5 bg-gray-200 dark:bg-white/10 rounded w-5/6" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!notificationStore.isLoadingRecent && notificationStore.recentNotifications.length === 0"
        class="py-10 px-6 text-center flex flex-col items-center justify-center"
      >
        <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-3">
          <BellSlashIcon class="w-6 h-6" />
        </div>
        <p class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          {{ t('notifications.empty.title') }}
        </p>
        <p class="text-[11px] text-gray-400 dark:text-gray-500 max-w-xs">
          {{ t('notifications.empty.description') }}
        </p>
      </div>

      <!-- List Items -->
      <div
        v-for="item in notificationStore.recentNotifications"
        :key="item.id"
        class="group p-3.5 flex items-start gap-3 cursor-pointer transition-colors duration-150"
        :class="[
          item.is_read
            ? 'bg-transparent hover:bg-gray-50/80 dark:hover:bg-white/5'
            : 'bg-blue-50/40 hover:bg-blue-50/70 dark:bg-blue-950/20 dark:hover:bg-blue-950/30',
        ]"
        @click="handleItemClick(item)"
      >
        <!-- Category Icon Badge -->
        <div
          class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          :class="[getTypeStyles(item.notification_type).bgClass, getTypeStyles(item.notification_type).textClass]"
        >
          <component :is="getTypeIcon(item.notification_type)" class="w-5 h-5" />
        </div>

        <!-- Text Details -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1">
            <h4
              class="text-xs font-semibold truncate"
              :class="item.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-bold'"
            >
              {{ getItemTitle(item) }}
            </h4>
            <span
              v-if="!item.is_read"
              class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"
              aria-label="Unread"
            />
          </div>

          <p class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {{ getItemMessage(item) }}
          </p>

          <div class="mt-1.5 flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500">
            <span>{{ formatRelativeTime(item.created_at) }}</span>
            <span v-if="item.action_url" class="opacity-0 group-hover:opacity-100 text-blue-600 dark:text-blue-400 transition-opacity flex items-center gap-0.5">
              {{ t('notifications.actions.viewDetails') }}
              <component :is="isRtl ? ChevronLeftIcon : ChevronRightIcon" class="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
      <NuxtLinkLocale
        to="/dashboard/notifications"
        class="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-2xl text-blue-600 hover:text-blue-700 hover:bg-blue-50/60 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-500/10 transition-colors"
        @click="$emit('close')"
      >
        <span>{{ t('notifications.actions.viewAll') }}</span>
        <component :is="isRtl ? ChevronLeftIcon : ChevronRightIcon" class="w-4 h-4" />
      </NuxtLinkLocale>
    </div>
  </div>
</template>
