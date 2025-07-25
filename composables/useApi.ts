// composables/useApi.ts
export const useApi = () => {
  const token = useCookie('access_token') // SSR-safe
  const refreshToken = useCookie('refresh_token')
  const router = useRouter()

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiUrl,
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        }
      }
    },
    onResponseError({ response, request, options }) {
      if (response.status === 401) {
        return tryRefreshToken().then((success) => {
          if (!success) {
            token.value = null
            refreshToken.value = null
            router.push('/login')
          }
        })
      }
    },
  })

  return api
}
