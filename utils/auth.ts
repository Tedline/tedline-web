export async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = useCookie('refresh_token')
  const token = useCookie('access_token')

  try {
    const response = await $fetch('/account/token/refresh/', {
      method: 'POST',
      baseURL:  process.env.API_URL || useRuntimeConfig().public.apiUrl + '/api/' ,
      body: { refresh: refreshToken.value },
    })

    token.value = response.access
    if (response.refresh) refreshToken.value = response.refresh
    return true
  } catch (err) {
    return false
  }
}
