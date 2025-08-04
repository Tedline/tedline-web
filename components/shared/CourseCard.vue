<template>
  <div class="group cursor-pointer" @click="navigateToCourse">
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
        <h4 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {{ course.title }}
        </h4>
        
        <p class="text-sm text-gray-600 mb-3 line-clamp-2">
          {{ course.description }}
        </p>
        
        <!-- Course Meta -->
        <div class="flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-clock" class="w-4 h-4" />
            <span>{{ formatDuration(course.duration) }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-user" class="w-4 h-4" />
            <span>{{ course.teacher?.username || course.institute?.username }}</span>
          </div>
        </div>
        
        <!-- Price -->
        <div class="mt-3 pt-3 border-t border-gray-100">
          <div v-if="course.price !== 0" class="flex items-center justify-between">
            <div v-if="course.discount && course.discount > 0" class="text-xs text-gray-500 line-through">
              {{ formatPrice(course.price) }}
            </div>
            <div v-else class="text-sm font-semibold text-gray-900">
              {{ formatPrice(course.price) }}
            </div>
            <div v-if="course.discount && course.discount > 0" class="text-sm font-semibold text-green-600">
              {{ formatPrice(calculateFinalPrice()) }}
            </div>
          </div>
          <div v-else class="text-sm font-semibold text-green-600">
            رایگان
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { CourseListItem } from '~/types/course'
interface Props {
  course: CourseListItem
}

const localeRoute = useLocaleRoute()
const props = defineProps<Props>()

function formatPrice(amount: number) {
    if (amount === 0) return 'Free'
    return amount.toLocaleString('en-US')
}

const calculateFinalPrice = () => {
  if (props.course.price === 0) return 0
  if (!props.course.discount) return props.course.price
  return Math.round(props.course.price - (props.course.price * props.course.discount / 100))
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours} ساعت و ${mins} دقیقه`
  }
  return `${mins} دقیقه`
}

const navigateToCourse = () => {
  const route = localeRoute({ name: 'course',  })
  navigateTo(route!.fullPath)
}
</script> 