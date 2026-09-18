<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  BellIcon,
  BellSlashIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  LifebuoyIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline'
import moment from 'moment-jalaali'
import {
  useNotificationStore,
  type NotificationItem,
  type NotificationType,
  type NotificationListResponse,
} from '~/stores/notifications'

definePageMeta({
  layout: 'dashboard',
})

// Configure moment-jalaali dialect
if (typeof moment.loadPersian === 'function') {
  moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })
}

const { t, locale } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const isRtl = computed(() => locale.value === 'fa')

// Filter tabs state
type TabType = 'all' | 'unread' | 'read'
const activeTab = ref<TabType>('all')
const currentPage = ref(1)
const pageSize = 10

// Data state
const notifications = ref<NotificationItem[]>([])
const totalCount = ref(0)
const totalPages = ref(1)
const unreadCount = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)
const markingReadIds = ref<Set<number>>(new Set())

// Category mapping
const typeConfig: Record<
  NotificationType,
  { icon: any; bgClass: string; textClass: string; badgeClass: string }
> = {
  course: {
    icon: AcademicCapIcon,
    bgClass: 'bg-blue-50 dark:bg-blue-500/15',
    textClass: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20',
  },
  quiz: {
    icon: ClipboardDocumentCheckIcon,
    bgClass: 'bg-emerald-50 dark:bg-emerald-500/15',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  },
  comment: {
    icon: ChatBubbleLeftRightIcon,
    bgClass: 'bg-purple-50 dark:bg-purple-500/15',
    textClass: 'text-purple-600 dark:text-purple-400',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20',
  },
  wallet: {
    icon: CreditCardIcon,
    bgClass: 'bg-amber-50 dark:bg-amber-500/15',
    textClass: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
  },
  ticket: {
    icon: LifebuoyIcon,
    bgClass: 'bg-rose-50 dark:bg-rose-500/15',
    textClass: 'text-rose-600 dark:text-rose-400',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20',
  },
  system: {
    icon: BellIcon,
    bgClass: 'bg-sky-50 dark:bg-sky-500/15',
    textClass: 'text-sky-600 dark:text-sky-400',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20',
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
      badgeClass: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/10',
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

function formatFullDate(dateStr: string): string {
  if (!dateStr) return ''
  if (locale.value === 'fa') {
    return moment(dateStr).format('jYYYY/jMM/jDD - HH:mm')
  }
  return moment(dateStr).format('YYYY-MM-DD HH:mm')
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffSec = Math.max(0, Math.floor((now - then) / 1000))
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return t('notifications.time.justNow')
  if (diffMin < 60) return t('notifications.time.minutesAgo', { count: diffMin })
  if (diffHour < 24) return t('notifications.time.hoursAgo', { count: diffHour })
  if (diffDay === 1) return t('notifications.time.yesterday')
  if (diffDay < 30) return t('notifications.time.daysAgo', { count: diffDay })

  return formatFullDate(dateStr)
}

async function fetchNotifications() {
  if (!userStore.isAuthenticated) {
    if (import.meta.client) {
      router.push(localePath(`/auth/signIn?redirect=/dashboard/notifications`))
    }
    return
  }

  loading.value = true
  error.value = null

  try {
    const api = useApi(true)
    const query: Record<string, any> = {
      page: currentPage.value,
      page_size: pageSize,
    }

    if (activeTab.value === 'unread') {
      query.is_read = 'false'
    } else if (activeTab.value === 'read') {
      query.is_read = 'true'
    }

    const res = (await api('notifications/', { query })) as NotificationListResponse

    notifications.value = Array.isArray(res?.results) ? res.results : []
    totalCount.value = typeof res?.count === 'number' ? res.count : 0
    totalPages.value = typeof res?.total_pages === 'number' ? res.total_pages : 1
    unreadCount.value = typeof res?.unread_count === 'number' ? res.unread_count : 0

    // Sync unread counter with central store
    if (typeof res?.unread_count === 'number') {
      notificationStore.unreadCount = res.unread_count
    }
  } catch (err: any) {
    console.error('Failed to load notifications:', err)
    error.value =
      err?.userMessage ||
      err?.data?.detail ||
      err?.data?.message ||
      err?.message ||
      t('notifications.empty.description')
  } finally {
    loading.value = false
  }
}

async function handleMarkAsRead(item: NotificationItem) {
  if (item.is_read || markingReadIds.value.has(item.id)) return

  markingReadIds.value.add(item.id)
  // Optimistic update
  item.is_read = true
  if (unreadCount.value > 0) unreadCount.value--

  try {
    await notificationStore.markAsRead(item.id)
  } catch (err) {
    console.warn('Failed to mark notification as read:', err)
  } finally {
    markingReadIds.value.delete(item.id)
  }
}

function handleCardClick(item: NotificationItem) {
  if (!item.is_read) {
    handleMarkAsRead(item)
  }
  if (item.action_url) {
    if (item.action_url.startsWith('http://') || item.action_url.startsWith('https://')) {
      window.open(item.action_url, '_blank')
    } else {
      router.push(localePath(item.action_url))
    }
  }
}

function setTab(tab: TabType) {
  if (activeTab.value === tab) return
  activeTab.value = tab
  currentPage.value = 1
  fetchNotifications()
}

function changePage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  fetchNotifications()
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

watch(
  () => userStore.isAuthenticated,
  (isAuth) => {
    if (!isAuth && import.meta.client) {
      router.push(localePath(`/auth/signIn?redirect=/dashboard/notifications`))
    }
  }
)

onMounted(() => {
  fetchNotifications()
})
</script>

<template>
  <div class="min-h-screen pb-16">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Hero / Header Card -->
      <div
        class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-6 dark:border-white/10 dark:bg-stone-900/50 sm:px-8 mb-6 shadow-sm"
      >
        <!-- Ambient Decorative Glows -->
        <div
          class="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/10 pointer-events-none"
        />
        <div
          class="absolute -right-12 -bottom-16 h-48 w-48 rounded-full bg-purple-400/15 blur-3xl dark:bg-purple-500/10 pointer-events-none"
        />

        <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <!-- Title & Badge -->
          <div>
            <div
              class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            >
              <BellIcon class="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
              {{ t('notifications.badge') }}
            </div>
            <h1 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {{ t('notifications.title') }}
            </h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              {{ t('notifications.subtitle') }}
            </p>
          </div>

          <!-- Filter Tabs -->
          <div class="flex items-center gap-1.5 p-1.5 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 shrink-0 self-start md:self-auto">
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              :class="[
                activeTab === 'all'
                  ? 'bg-white dark:bg-stone-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
              @click="setTab('all')"
            >
              {{ t('notifications.tabs.all') }}
            </button>
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              :class="[
                activeTab === 'unread'
                  ? 'bg-white dark:bg-stone-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
              @click="setTab('unread')"
            >
              <span>{{ t('notifications.tabs.unread') }}</span>
              <span
                v-if="unreadCount > 0"
                class="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
              >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </button>
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              :class="[
                activeTab === 'read'
                  ? 'bg-white dark:bg-stone-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              ]"
              @click="setTab('read')"
            >
              {{ t('notifications.tabs.read') }}
            </button>
          </div>
        </div>
      </div>

      <!-- State 1: Loading Skeleton -->
      <div v-if="loading" class="space-y-4">
        <div
          v-for="n in 5"
          :key="n"
          class="rounded-3xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-stone-900/50 shadow-sm animate-pulse flex items-start gap-4"
        >
          <div class="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/10 shrink-0" />
          <div class="flex-1 space-y-2.5 py-1">
            <div class="flex items-center justify-between">
              <div class="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
              <div class="h-3 bg-gray-200 dark:bg-white/10 rounded w-20" />
            </div>
            <div class="h-3 bg-gray-200 dark:bg-white/10 rounded w-4/5" />
            <div class="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
          </div>
        </div>
      </div>

      <!-- State 2: Error State -->
      <div
        v-else-if="error"
        class="rounded-3xl border border-rose-200 bg-rose-50/60 dark:border-rose-500/20 dark:bg-rose-500/10 p-8 sm:p-12 text-center"
      >
        <div
          class="mx-auto w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center mb-4"
        >
          <ExclamationCircleIcon class="w-8 h-8" aria-hidden="true" />
        </div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('notifications.title') }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
          {{ error }}
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          @click="fetchNotifications"
        >
          <ArrowPathIcon class="w-4 h-4" aria-hidden="true" />
          <span>{{ t('notifications.actions.viewAll') }}</span>
        </button>
      </div>

      <!-- State 3: Empty State -->
      <div
        v-else-if="notifications.length === 0"
        class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-8 sm:p-14 text-center shadow-sm"
      >
        <div
          class="mx-auto w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center mb-5"
        >
          <BellSlashIcon class="w-9 h-9" aria-hidden="true" />
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('notifications.empty.title') }}
        </h2>
        <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-6 leading-relaxed">
          {{ t('notifications.empty.description') }}
        </p>
      </div>

      <!-- State 4: Populated Notifications List -->
      <div v-else class="space-y-3">
        <div
          v-for="item in notifications"
          :key="item.id"
          class="group rounded-3xl border bg-white p-5 sm:p-6 dark:bg-stone-900/50 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          :class="[
            item.is_read
              ? 'border-gray-200 dark:border-white/10'
              : 'border-blue-300 dark:border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/10 ring-1 ring-blue-500/10',
          ]"
          @click="handleCardClick(item)"
        >
          <div class="flex items-start gap-4 flex-1 min-w-0">
            <!-- Icon Badge -->
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              :class="[getTypeStyles(item.notification_type).bgClass, getTypeStyles(item.notification_type).textClass]"
            >
              <component :is="getTypeIcon(item.notification_type)" class="w-6 h-6" />
            </div>

            <!-- Content Area -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <!-- Type Pill -->
                <span
                  class="px-2 py-0.5 text-[11px] font-semibold rounded-lg border"
                  :class="getTypeStyles(item.notification_type).badgeClass"
                >
                  {{ t('notifications.types.' + item.notification_type) }}
                </span>

                <!-- Unread Indicator -->
                <span
                  v-if="!item.is_read"
                  class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
                  aria-label="Unread"
                />

                <!-- Relative Time -->
                <span class="text-xs text-gray-400 dark:text-gray-500">
                  {{ formatRelativeTime(item.created_at) }}
                </span>
              </div>

              <h3
                class="text-sm sm:text-base font-semibold transition-colors"
                :class="item.is_read ? 'text-gray-900 dark:text-white' : 'text-blue-900 dark:text-blue-100 font-bold'"
              >
                {{ getItemTitle(item) }}
              </h3>

              <p class="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ getItemMessage(item) }}
              </p>
            </div>
          </div>

          <!-- Actions on the side -->
          <div class="flex items-center gap-2 self-end sm:self-center shrink-0" @click.stop>
            <button
              v-if="!item.is_read"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              :disabled="markingReadIds.has(item.id)"
              @click="handleMarkAsRead(item)"
            >
              <CheckIcon class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{{ t('notifications.actions.markAsRead') }}</span>
            </button>

            <a
              v-if="item.action_url"
              :href="item.action_url"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
              @click.prevent="handleCardClick(item)"
            >
              <span>{{ t('notifications.actions.viewDetails') }}</span>
              <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5 rtl:rotate-180" />
            </a>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div
          v-if="totalPages > 1"
          class="mt-8 flex items-center justify-center gap-2 pt-4 border-t border-gray-100 dark:border-white/10"
        >
          <button
            type="button"
            class="p-2 rounded-xl border border-gray-200 text-gray-600 dark:border-white/10 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            <span class="sr-only">Previous Page</span>
            <component :is="isRtl ? ChevronRightIcon : ChevronLeftIcon" class="w-5 h-5" />
          </button>

          <div class="flex items-center gap-1">
            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              class="w-9 h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              :class="[
                p === currentPage
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5',
              ]"
              @click="changePage(p)"
            >
              {{ p }}
            </button>
          </div>

          <button
            type="button"
            class="p-2 rounded-xl border border-gray-200 text-gray-600 dark:border-white/10 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            <span class="sr-only">Next Page</span>
            <component :is="isRtl ? ChevronLeftIcon : ChevronRightIcon" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
