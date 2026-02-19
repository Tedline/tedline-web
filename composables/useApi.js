// /composables/useApi.ts
export const useApi = (requireAuth = true,suffixUrl = '/api/') => {
  const token = useCookie('access_token') // SSR-safe
  const refreshToken = useCookie('refresh_token')
  const router = useRouter()

  const tryRefreshToken = async () => {
    if (!refreshToken.value) return false
    try {
      const { access_token } = await $fetch('/auth/refresh', {
        baseURL: useRuntimeConfig().public.apiUrl + suffixUrl,
        method: 'POST',
        body: { refresh_token: refreshToken.value },
      })
      token.value = access_token
      return true
    } catch {
      return false
    }
  }

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiUrl + suffixUrl,

    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        }
      } else if (requireAuth) {
        // No token at all for a required-auth API → redirect immediately
        const localePath = useLocalePath()
        router.push(localePath(`/auth/signIn?redirect=${router.currentRoute.value.fullPath}`))
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const refreshed = await tryRefreshToken()
        if (refreshed) return // retry logic could go here

        token.value = null
        refreshToken.value = null
        const localePath = useLocalePath()
        if (requireAuth) router.push(localePath(`/auth/signIn?redirect=${router.currentRoute.value.fullPath}`))
      }
    },
  })

  return api
}
