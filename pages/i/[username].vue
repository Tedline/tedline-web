<template>
  <div>
    <!-- Navigation -->
    <LayoutHeader :shadow="true" />

    <!-- Page Head -->
    <Head>
      <Title v-if="!loading">{{ data.name }} | موسسه</Title>
      <Title v-else>{{ $route.params.username }} | موسسه</Title>
    </Head>

    <!-- Success Toast -->
    <UNotification v-model="showToast" title="کپی شد" color="green" icon="i-heroicons-check-circle"
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
            <!-- Institute Avatar -->
            <div class="flex-shrink-0">
              <div class="relative">
                <UAvatar
                  :src="data?.image || `https://tedline.org/api/company/institute_image/${$route.params.username}`"
                  :alt="data?.name || $route.params.username"
                  size="3xl"
                  class="w-30 h-30 ring-5 ring-white/20 dark:ring-gray-800/50 object-cover rounded-xl"
                />
                <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                <!-- Verified Badge -->
                <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <!-- Institute Info -->
            <div class="flex-1 text-center md:text-right">
              <div v-if="loading" class="space-y-4">
                <USkeleton class="h-8 w-48 mx-auto md:mx-0" />
                <USkeleton class="h-6 w-32 mx-auto md:mx-0" />
              </div>
              <div v-else class="space-y-2">
                <h1 class="text-3xl md:text-4xl font-bold dark:text-white">
                  {{ data.name }}
                </h1>
                <p class="text-lg text-gray-800 dark:text-blue-200">
                  {{ data.username }}
                </p>
              </div>
            </div>
            <!-- Action Buttons -->
            <div v-if="data" class="flex items-center gap-4">
              <UButton icon="i-heroicons-share" color="white" variant="soft" @click="shareInstitute"
                :aria-label="'اشتراک‌گذاری موسسه'" />
              <!-- Institute Badge -->
              <UBadge color="blue" variant="soft"
                class="flex items-center rounded-full gap-2 px-4 py-2">
                <UIcon name="i-heroicons-building-office" class="w-4 h-4" />
                <span class="font-medium">موسسه</span>
              </UBadge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="container mx-auto px-4 py-8">
      <div class="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-10">
        <div class="lg:col-span-1">
          <div class="sticky top-20 flex flex-col gap-5 mt-10">
            <!-- Teachers Section -->
            <SharedSectionCard 
              title="مدرسان مجموعه" 
              description="مدرسان و اساتید این موسسه" 
              class="mt-4"
              icon="i-heroicons-academic-cap" 
              color="blue"
            >
              <div v-if="data?.teachers && data.teachers.length > 0" class="space-y-3">
                <SharedTeacher 
                  v-for="(teacher, index) in data.teachers" 
                  :key="index" 
                  :teacher="teacher" 
                />
              </div>
              <UAlert v-else icon="i-heroicons-information-circle" color="blue" variant="soft">
                <template #title>
                  <span class="font-semibold">مدرسی ثبت نشده</span>
                </template>
                <template #description>
                  مدرسی برای این موسسه ثبت نشده است
                </template>
              </UAlert>
            </SharedSectionCard>

            <!-- Bio Section -->
            <SharedSectionCard 
              v-if="data?.bio"
              title="درباره موسسه" 
              description="اطلاعات بیشتر درباره این موسسه" 
              class="mt-4"
              icon="i-heroicons-information-circle" 
              color="green"
            >
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ data.bio }}
              </div>
            </SharedSectionCard>
          </div>
        </div>
        
        <div class="lg:col-span-3">
          <!-- Loading Skeleton -->
          <div v-if="loading" class="space-y-6">
            <USkeleton v-for="n in 3" :key="n" class="h-48 w-full rounded-2xl" />
          </div>

          <!-- Courses Content -->
          <div v-else>
            <SectionInstituteCourses :username="$route.params.username" />
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

// Fetch institute data
const { data, pending: loading } = await useAsyncData(
  `institute-${route.params.username}`,
  () => api(`/company/retrieve-institute/${route.params.username}/`)
)

// Methods
const shareInstitute = async () => {
  const instituteUrl = `https://tedline.org/i/${route.params.username}/`

  try {
    if (navigator.share) {
      await navigator.share({
        title: data.value?.name || route.params.username,
        url: instituteUrl
      })
    } else {
      await navigator.clipboard.writeText(instituteUrl)
      showToast.value = true
    }
  } catch (error) {
    console.error('Error sharing institute:', error)
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(instituteUrl)
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
    background-color: #1372ccf9;
    background-image: radial-gradient(ellipse 50% 200% at 80% 0%, #2b4968 89.9%, #00000000 90%), radial-gradient(ellipse 20% 100% at 30% -10%, #1451a08c 89.9%, #045ce900 90%);
  }
}
</style>