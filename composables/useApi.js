// /composables/useApi.ts

/**
 * Extracts or generates a user-friendly, localized error message from API and network errors.
 * Guarantees that internal URLs, [GET]/[POST] method traces, and raw fetch failures
 * are never shown directly to end users.
 */
export function formatApiErrorMessage(error, locale = 'fa') {
  const isFa = locale === 'fa'

  // 1. Backend-provided explicit messages (detail, message, error string)
  if (error?.data) {
    if (typeof error.data === 'string' && error.data.trim() && !error.data.includes('Traceback') && !error.data.includes('<html')) {
      return error.data.trim()
    }
    if (typeof error.data?.detail === 'string' && error.data.detail.trim()) {
      return error.data.detail.trim()
    }
    if (typeof error.data?.message === 'string' && error.data.message.trim()) {
      return error.data.message.trim()
    }
    if (typeof error.data?.error === 'string' && error.data.error.trim()) {
      return error.data.error.trim()
    }
    // Validation dictionary like { username: ['این نام قبلاً انتخاب شده است'] }
    if (typeof error.data === 'object' && !Array.isArray(error.data)) {
      const messages = Object.values(error.data)
        .flat()
        .filter((m) => typeof m === 'string' && m.trim() && !m.includes('Traceback'))
      if (messages.length > 0) {
        return messages.join(' ')
      }
    }
  }

  // 2. HTTP Status code based messages
  const status = error?.response?.status || error?.status || error?.statusCode
  if (status === 400) {
    return isFa ? 'درخواست نامعتبر است.' : 'Invalid request.'
  }
  if (status === 401) {
    return isFa ? 'لطفاً ابتدا وارد حساب کاربری خود شوید.' : 'Please log in to continue.'
  }
  if (status === 403) {
    return isFa ? 'شما اجازه دسترسی به این بخش را ندارید.' : 'You do not have permission to access this resource.'
  }
  if (status === 404) {
    return isFa ? 'اطلاعات مورد نظر یافت نشد.' : 'The requested resource was not found.'
  }
  if (status >= 500) {
    return isFa ? 'خطایی در سرور رخ داده است. لطفاً بعداً تلاش کنید.' : 'A server error occurred. Please try again later.'
  }

  // 3. Network or connection errors (server offline, no response, Failed to fetch)
  const isNetwork = !error?.response || (typeof error?.message === 'string' && (
    error.message.includes('Failed to fetch') ||
    error.message.includes('<no response>') ||
    error.message.includes('NetworkError') ||
    error.message.includes('fetch failed') ||
    error.message.includes('ECONNREFUSED')
  ))

  if (isNetwork) {
    return isFa
      ? 'خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.'
      : 'Unable to connect to the server. Please check your internet connection.'
  }

  return isFa ? 'خطایی رخ داد. لطفاً دوباره تلاش کنید.' : 'An error occurred. Please try again.'
}

function sanitizeApiError(error, locale) {
  if (!error) return error
  const friendly = formatApiErrorMessage(error, locale)
  if (!error.rawMessage) {
    error.rawMessage = error.message
  }
  error.message = friendly
  error.userMessage = friendly
  error.toString = function () {
    return this.message
  }
  return error
}

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
          try {
            const userStore = useUserStore()
            userStore.accessToken = response.access
          } catch (_) {}
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
      if (error?.response?.status === 401) {
        const refreshed = await tryRefreshToken()
        if (refreshed) {
          try {
            return await apiClient(request, options)
          } catch (retryError) {
            throw sanitizeApiError(retryError, getLocale())
          }
        }

        token.value = null
        refreshToken.value = null
        try {
          const userStore = useUserStore()
          userStore.accessToken = null
        } catch (_) {}
        if (requireAuth && import.meta.client) {
          const localePath = useLocalePath()
          await router.push(localePath(`/auth/signIn?redirect=${router.currentRoute.value.fullPath}`))
        }
      }

      throw sanitizeApiError(error, getLocale())
    }
  }

  return api
}

