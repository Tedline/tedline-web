import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'
import { useApi } from '~/composables/useApi'

export type NotificationType = 'course' | 'quiz' | 'wallet' | 'ticket' | 'comment' | 'system'

export interface NotificationItem {
  id: number
  title: string
  title_fa: string
  title_en: string
  message: string
  message_fa: string
  message_en: string
  notification_type: NotificationType
  action_url: string | null
  is_read: boolean
  created_at: string
}

export interface NotificationListResponse {
  count: number
  unread_count: number
  total_pages: number
  results: NotificationItem[]
}

export interface UnreadCountResponse {
  unread_count: number
}

export const useNotificationStore = defineStore('notifications', () => {
  const userStore = useUserStore()

  const unreadCount = ref<number>(0)
  const recentNotifications = ref<NotificationItem[]>([])
  const isLoadingRecent = ref<boolean>(false)
  const isPolling = ref<boolean>(false)

  let pollIntervalId: ReturnType<typeof setInterval> | null = null

  /**
   * Fetches the current count of unread notifications.
   */
  async function fetchUnreadCount(): Promise<number> {
    if (!userStore.isAuthenticated) {
      unreadCount.value = 0
      return 0
    }

    try {
      const api = useApi(true)
      const res = (await api('notifications/unread-count/')) as UnreadCountResponse
      unreadCount.value = typeof res?.unread_count === 'number' ? res.unread_count : 0
      return unreadCount.value
    } catch (err) {
      // Gracefully capture error without crashing polling loop
      console.warn('Failed to fetch unread notification count:', err)
      return unreadCount.value
    }
  }

  /**
   * Fetches the latest notifications (defaults to 8 items for popover).
   */
  async function fetchRecent(pageSize = 8): Promise<void> {
    if (!userStore.isAuthenticated) {
      recentNotifications.value = []
      unreadCount.value = 0
      return
    }

    isLoadingRecent.value = true
    try {
      const api = useApi(true)
      const res = (await api('notifications/', {
        query: {
          page: 1,
          page_size: pageSize,
        },
      })) as NotificationListResponse

      recentNotifications.value = Array.isArray(res?.results) ? res.results : []
      if (typeof res?.unread_count === 'number') {
        unreadCount.value = res.unread_count
      }
    } catch (err) {
      console.warn('Failed to fetch recent notifications:', err)
    } finally {
      isLoadingRecent.value = false
    }
  }

  /**
   * Optimistically marks a notification as read and notifies the server.
   */
  async function markAsRead(id: number): Promise<void> {
    // Optimistic local update
    const target = recentNotifications.value.find((item) => item.id === id)
    if (target && !target.is_read) {
      target.is_read = true
      if (unreadCount.value > 0) {
        unreadCount.value--
      }
    }

    try {
      const api = useApi(true)
      await api(`notifications/${id}/mark-read/`, {
        method: 'POST',
      })
    } catch (err) {
      console.warn(`Failed to mark notification ${id} as read on server:`, err)
    }
  }

  /**
   * Starts 60-second periodic polling of unread notification counter.
   * Only executes client-side and when user is authenticated.
   */
  function startPolling(): void {
    if (!import.meta.client) return
    if (pollIntervalId) return

    isPolling.value = true

    // Immediate initial fetch
    if (userStore.isAuthenticated) {
      fetchUnreadCount()
    }

    // Set 60-second polling interval
    pollIntervalId = setInterval(() => {
      if (userStore.isAuthenticated) {
        // Only fetch if document is active / visible to save bandwidth
        if (typeof document !== 'undefined' && document.hidden) {
          return
        }
        fetchUnreadCount()
      } else {
        stopPolling()
      }
    }, 60000)
  }

  /**
   * Stops periodic polling and clears the interval timer.
   */
  function stopPolling(): void {
    if (pollIntervalId) {
      clearInterval(pollIntervalId)
      pollIntervalId = null
    }
    isPolling.value = false
  }

  return {
    unreadCount,
    recentNotifications,
    isLoadingRecent,
    isPolling,
    fetchUnreadCount,
    fetchRecent,
    markAsRead,
    startPolling,
    stopPolling,
  }
})
