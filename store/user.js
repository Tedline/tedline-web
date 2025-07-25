// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: null,
    status: null,
  }),

  actions: {
    setToken(access_token, refresh_token, username, status) {
      this.username = username
      this.status = status
      this.saveToCookies(access_token, refresh_token, username, status)
    },

    saveToCookies(access_token, refresh_token, username, status) {
      document.cookie = `access_token=${access_token}; path=/; max-age=${60 * 60 * 24 * 100}`
      document.cookie = `refresh_token=${refresh_token}; path=/; max-age=${60 * 60 * 24 * 100}`
      document.cookie = `username=${username}; path=/; max-age=${60 * 60 * 24 * 100}`
      document.cookie = `status=${status}; path=/; max-age=${60 * 60 * 24 * 100}`
    },

    loadFromCookies() {
      const cookies = Object.fromEntries(
        document.cookie.split('; ').map(cookie => cookie.split('='))
      )

      this.username = cookies.username || null
      this.status = cookies.status || null
    },

    isAuthenticated() {
      return document.cookie.includes('access_token=')
    },

    logout() {
      this.username = null
      this.status = null
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'status=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    },
  },
})
