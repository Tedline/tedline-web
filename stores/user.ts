import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: null as string | null,
    status: null as string | null,
    accessToken: null as string | null,
  }),

  getters: {
    isAuthenticated(state) {
      return !!state.accessToken
    },
  },

  actions: {
    initialize() {
      this.accessToken = useCookie('access_token').value || null
      this.username = useCookie('username').value || null
      this.status = useCookie('status').value || null
    },

    setToken(access_token: string, refresh_token: string, username: string, status: string) {
      this.accessToken = access_token
      this.username = username
      this.status = status

      useCookie('access_token').value = access_token
      useCookie('refresh_token').value = refresh_token
      useCookie('username').value = username
      useCookie('status').value = status
    },

    logout() {
      this.accessToken = null
      this.username = null
      this.status = null

      useCookie('access_token').value = null
      useCookie('refresh_token').value = null
      useCookie('username').value = null
      useCookie('status').value = null
    },
  },
})
