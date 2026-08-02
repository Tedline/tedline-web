export default defineNuxtRouteMiddleware((to) => {
  const accessToken = useCookie('access_token')
  const localePath = useLocalePath()

  if (!accessToken.value) {
    return navigateTo({
      path: localePath('/auth/signIn'),
      query: { redirect: to.fullPath },
    })
  }
})
