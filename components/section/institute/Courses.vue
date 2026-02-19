<template>
  <div class="mt-8">
    <!-- Loading State -->
    <div v-if="pending" class="space-y-6">
      <USkeleton v-for="n in 3" :key="n" class="h-48 w-full rounded-2xl" />
    </div>
    

    <!-- Error State -->
    <UAlert
      v-else-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="error"
      variant="soft"
      class="my-10"
    >
      <template #title>
        <span class="font-semibold">خطا در بارگذاری دوره‌ها</span>
      </template>
      <template #description>
        مشکلی در بارگذاری دوره‌های این موسسه پیش آمده است.
      </template>
    </UAlert>
    <!-- Courses Grid -->
    <div v-else-if="data && data.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in data" :key="course.id" class="group cursor-pointer" @click="navigateToCourse(course)">
        <UCard class="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
          <!-- Course Image -->
          <div class="relative h-48 rounded-t-lg overflow-hidden">
            <img
              :src="course.image"
              :alt="course.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            <!-- Price Badge -->
            <div class="absolute top-3 left-3">
              <UBadge
                v-if="course.price === 0"
                color="secondary"
                variant="solid"
                class="text-xs"
              >
                رایگان
              </UBadge>
              <UBadge
                v-else-if="course.discount && course.discount > 0"
                color="primary"
                variant="solid"
                class="text-xs"
              >
                {{ course.discount }}% تخفیف
              </UBadge>
            </div>
          </div>
          
          <!-- Course Content -->
          <div class="p-4">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {{ course.title }}
            </h4>
            
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {{ course.description }}
            </p>
            
            <!-- Course Meta -->
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                <span>{{ formatDuration(course.duration) }}</span>
              </div>
              
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-users" class="w-4 h-4" />
                <span>{{ course.session?.length || 0 }} جلسه</span>
              </div>
            </div>
            
            <!-- Price -->
            <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div v-if="course.price !== 0" class="flex items-center justify-between">
                <div v-if="course.discount && course.discount > 0" class="text-xs text-gray-500 line-through">
                  {{ formatPrice(course.price) }} تومان
                </div>
                <div v-else class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatPrice(course.price) }} تومان
                </div>
                <div v-if="course.discount && course.discount > 0" class="text-sm font-semibold text-green-600">
                  {{ formatPrice(calculateFinalPrice(course)) }} تومان
                </div>
              </div>
              <div v-else class="text-sm font-semibold text-green-600">
                رایگان
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Empty State -->
    <UAlert
      v-else
      icon="i-heroicons-information-circle"
      color="primary"
      variant="soft"
      class="my-10"
    >
    
      <template #title>
        <span class="font-semibold">دوره‌ای یافت نشد</span>
      </template>
      <template #description>
        این موسسه هنوز دوره‌ای منتشر نکرده است.
      </template>
    </UAlert>
  </div>
</template>

<script setup lang="ts">
import type { CourseListItem } from '~/types/course'

interface Props {
  username: string
}

const props = defineProps<Props>()
const localePath = useLocalePath()
const api = useApi(false)

// Fetch institute courses
const { data, pending, error } = await useLazyAsyncData(
  `institute-courses-${props.username}`,
  () => api(`/course/institute-courses/${props.username}/`).then((res: any) => res.results || [])
)

// Helper functions
function formatPrice(amount: number) {
  if (amount === 0) return 'Free'
  return amount.toLocaleString('en-US')
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours} ساعت ${mins} دقیقه`
  }
  return `${mins} دقیقه`
}

function calculateFinalPrice(course: CourseListItem) {
  if (course.price === 0) return 0
  if (!course.discount) return course.price
  return course.price - (course.price * course.discount / 100)
}

function navigateToCourse(course: CourseListItem) {
  navigateTo(localePath(`/course/${course.id}`))
}
</script>
