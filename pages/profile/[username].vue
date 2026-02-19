<template>
  <div>
    <!-- Navigation -->
    <LayoutHeader :shadow="true" />

    <!-- Page Head -->

    <Head>
      <Title v-if="!loading">{{ data.get_full_name }} | {{ $t('profile.title') }}</Title>
      <Title v-else>{{ $route.params.username }} | {{ $t('profile.title') }}</Title>
    </Head>

    <!-- Success Toast -->
    <UNotification v-model="showToast" :title="$t('profile.copied')" color="green" icon="i-heroicons-check-circle"
      timeout="2000" />

    <!-- Hero Section -->
    <div class="relative isolated pt-15 curved h-80 md:h-60 overflow-hidden ">
      <!-- Loading Progress -->
      <div
        class="absolute inset-0 bg-gradient-to-t  dark:backdrop-blur-lg from-white via-white/60 dark:from-black dark:via-black/60 to-transparent">
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-r from-white/40 dark:from-black/40 via-transparent to-white/20 dark:to-black/50">
      </div>
      <div
        class="absolute inset-0 bg-gradient-to-l from-white/40 dark:from-black/40 via-transparent to-white/20 dark:to-black/50">
      </div>

      <div v-if="loading" class="absolute top-0 left-0 right-0 h-1 bg-blue-400">
        <div class="h-full bg-white animate-pulse"></div>
      </div>

      <div class=" absolute container md:ms-10 ">
        <div class="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <div class="flex flex-col md:flex-row items-center gap-8">
            <!-- Profile Avatar -->
            <div class="flex-shrink-0">
              <div class="relative">
                <NuxtImg
                  :src="`https://tedline.org/api/account/user_profile_image/${$route.params.username}`"
                  :alt="data?.get_full_name || $route.params.username"
                  preset="avatar_large"
                  class="w-30 h-30 ring-5 ring-white/20 dark:ring-gray-800/50 object-cover rounded-full"
                />
                <div class="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-transparent"></div>
              </div>
            </div>
            <!-- Profile Info -->
            <div class="flex-1 text-center md:text-right">
              <div v-if="loading" class="space-y-4">
                <USkeleton class="h-8 w-48 mx-auto md:mx-0" />
                <USkeleton class="h-6 w-32 mx-auto md:mx-0" />
              </div>
              <div v-else class="space-y-2">
                <h1 class="text-3xl md:text-4xl font-bold dark:text-white">
                  {{ $route.params.username }}
                </h1>
                <p class="text-lg text-gray-800 dark:text-blue-200">
                  {{ data.get_full_name }}
                </p>
              </div>
            </div>
            <!-- Action Buttons -->
            <div v-if="data" class="flex items-center gap-4">
              <UButton icon="i-heroicons-share" color="white" variant="soft" @click="shareProfile"
                :aria-label="$t('profile.shareProfile')" />
              <!-- Teacher Badge -->
              <UBadge v-if="data.status === 't'" color="neutral" variant="soft"
                class="flex items-center rounded-full gap-2 px-4 py-2">
                <UIcon name="i-heroicons-user" class="w-4 h-4" />
                <span class="font-medium">{{ $t('profile.teacher') }}</span>
              </UBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Stats Cards -->
    <div v-if="!loading && data?.status === 's'" class="mb-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Unfinished Courses -->
        <UCard class="text-center">
          <div class="flex items-center justify-center gap-3">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <UIcon name="i-heroicons-list-bullet" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ $t('profile.ongoingCoursesCount') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ data.unfinished_course }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Finished Courses -->
        <UCard class="text-center">
          <div class="flex items-center justify-center gap-3">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ $t('profile.finishedCoursesCount') }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ data.finished_course }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Content Section -->
    <div class="container mx-auto px-4 py-8">
      <div class="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-10">
          <div class="lg:col-span-1">
          <div class="sticky top-20 flex flex-col gap-5 mt-10">
            <!-- Bio Section -->

            <SharedSectionCard title="بیوگرافی" description="خلاصه ای از بیوگرافی کاربر" class="mt-4"
              icon="i-heroicons-academic-cap" color="blue">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ data.bio }}
              </div>
              <UAlert v-if="!data.bio" icon="i-heroicons-information-circle" color="blue" variant="soft"
                class="">
                <template #title>
                  <span class="font-semibold">{{ $t('profile.noBiography') }}</span>
                </template>

              </UAlert>
            </SharedSectionCard>


          </div>
        </div>
        <div class="lg:col-span-3">
          <!-- Loading Skeleton -->
          <div v-if="loading" class="space-y-6">
            <USkeleton v-for="n in 3" :key="n" class="h-48 w-full rounded-2xl" />
          </div>

          <!-- Course Content -->
          <div v-else>
            <!-- Student Courses -->
            <SharedCourseHorizontalCard v-if="data?.status === 's'" :progress="false" variant="flat"
              :username="$route.params.username" />

            <!-- Teacher Courses -->
            <SectionProfileTab v-if="data?.status === 't'" :username="$route.params.username" />
          </div>
        </div>
      
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Page meta
definePageMeta({
  layout: 'dashboard'
})

// Route
const route = useRoute()

// Reactive data
const showToast = ref(false)

const api = useApi(false)

// Fetch user data
const { data, pending: loading } = await useAsyncData(
  `user-${route.params.username}`,
  () => api(`/account/RetrieveUser/${route.params.username}/`)
)

// Methods
const shareProfile = async () => {
  const profileUrl = `https://tedline.org/profile/${route.params.username}/`

  try {
    if (navigator.share) {
      await navigator.share({
        title: data.value?.get_full_name || route.params.username,
        url: profileUrl
      })
    } else {
      await navigator.clipboard.writeText(profileUrl)
      showToast.value = true
    }
  } catch (error) {
    console.error('Error sharing profile:', error)
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(profileUrl)
      showToast.value = true
    } catch (clipboardError) {
      console.error('Error copying to clipboard:', clipboardError)
    }
  }
}
</script>

<style scoped>
@media (max-width: 767px) {
  .curved {
    background-color: #5ba7ee42;

    background-image: radial-gradient(ellipse 100% 140% at -10% 20%, #2b4968 89.9%, #00000000 90%), radial-gradient(ellipse 100% 100% at 30% 100%, #54a1e98c 89.9%, #045ce900 90%);

  }
}

@media (min-width: 767px) {

  .curved {
    background-color: #5ba7ee42;

    background-image: radial-gradient(ellipse 50% 200% at 80% 0%, #2b4968 89.9%, #00000000 90%), radial-gradient(ellipse 30% 100% at 30% -10%, #54a1e98c 89.9%, #045ce900 90%);

  }
}
</style>