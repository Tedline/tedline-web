export async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = useCookie('refresh_token')
  const token = useCookie('access_token')

  try {
    const response = await $fetch('/auth/refresh', {
      method: 'POST',
      baseURL:  process.env.API_URL ,
      body: { refresh_token: refreshToken.value },
    })

    token.value = response.access_token
    refreshToken.value = response.refresh_token
    return true
  } catch (err) {
    return false
  }
}