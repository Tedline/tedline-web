// /composables/useApi.ts
export const useApi = (requireAuth = true,suffixUrl = '/api/') => {
  const token = useCookie('access_token') // SSR-safe
  const refreshToken = useCookie('refresh_token')
  const router = useRouter()
  const nuxtApp = useNuxtApp()
  let refreshPromise = null

  const getLocale = () => {
    const locale = nuxtApp.$i18n?.locale
    return (locale && typeof locale === 'object' ? locale.value : locale) || 'fa'
  }

  const applyHeaders = (options = {}) => {
    options.headers = {
      ...options.headers,
      'Accept-Language': getLocale(),
    }

    if (token.value) {
      options.headers.Authorization = `Bearer ${token.value}`
    }

    return options
  }

  const tryRefreshToken = async () => {
    if (!refreshToken.value) return false
    if (!refreshPromise) {
      refreshPromise = $fetch('/account/token/refresh/', {
          baseURL: useRuntimeConfig().public.apiUrl + suffixUrl,
          method: 'POST',
          headers: {
            'Accept-Language': getLocale(),
          },
          body: { refresh: refreshToken.value },
        })
        .then((response) => {
          token.value = response.access
          if (response.refresh) refreshToken.value = response.refresh
          return true
        })
        .catch(() => false)
        .finally(() => {
          refreshPromise = null
        })
    }

    return refreshPromise
  }

  const apiClient = $fetch.create({
    baseURL: useRuntimeConfig().public.apiUrl + suffixUrl,

    onRequest({ options }) {
      applyHeaders(options)

      if (!token.value && requireAuth) {
        // No token at all for a required-auth API → redirect immediately
        const localePath = useLocalePath()
        router.push(localePath(`/auth/signIn?redirect=${router.currentRoute.value.fullPath}`))
      }
    },

  })

  const api = async (request, options = {}) => {
    try {
      return await apiClient(request, options)
    } catch (error) {
      if (error?.response?.status !== 401) throw error

      const refreshed = await tryRefreshToken()
      if (refreshed) return apiClient(request, options)

      token.value = null
      refreshToken.value = null
      if (requireAuth && import.meta.client) {
        const localePath = useLocalePath()
        await router.push(localePath(`/auth/signIn?redirect=${router.currentRoute.value.fullPath}`))
      }
      throw error
    }
  }

  return api
}
