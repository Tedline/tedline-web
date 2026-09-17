export async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = useCookie('refresh_token')
  const token = useCookie('access_token')

  try {
    const config = useRuntimeConfig()
    const baseURL = (config.public?.apiUrl || '') + '/api/'
    const response = await $fetch<{ access: string; refresh?: string }>('/account/token/refresh/', {
      method: 'POST',
      baseURL,
      body: { refresh: refreshToken.value },
    })

    token.value = response.access
    if (response.refresh) refreshToken.value = response.refresh
    try {
      const userStore = useUserStore()
      userStore.accessToken = response.access
    } catch (_) {}
    return true
  } catch (err) {
    return false
  }
}
