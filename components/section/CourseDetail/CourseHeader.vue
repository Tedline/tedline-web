<template>
  <div class="relative">
    <!-- Hero Image with Space Theme -->
    <div class="relative h-80 md:h-96 lg:h-[390px]overflow-hidden ">
      <img 
        :src="course.image" 
        :alt="course.title"
        class="w-full h-full object-cover"
      />
      
      <!-- Space-themed gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t  backdrop-blur-lg from-white via-white/60 dark:from-black dark:via-black/60 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/40 dark:from-black/40 via-transparent to-white/20 dark:to-black/50"></div>
      <div class="absolute inset-0 bg-gradient-to-l from-white/40 dark:from-black/40 via-transparent to-white/20 dark:to-black/50"></div>
      

      
      <!-- Content Overlay -->
      <div class="max-w-7xl mx-auto absolute bottom-0 left-0 right-0 p-6 md:p-8 md:pb-15">
        <div class="max-w-7xl mx-auto">
          <!-- Main Content Grid -->
          <div class="grid lg:grid-cols-4 gap-6 items-end">
            <!-- Course Info (3 columns) -->
            <div class="lg:col-span-3 space-y-4">
              <!-- Course Title -->
              <div class="space-y-3">
                <h1 class="text-xl  lg:text-3xl font-bold text-black dark:text-white leading-tight">
                  {{ course.title }}
                </h1>
                <p v-if="course.description" class="text-sm  text-gray-700 dark:text-gray-200 max-w-2xl line-clamp-1 leading-relaxed">
                  {{ course.description }}
                </p>
              </div>

              <!-- Course Stats -->
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center gap-2 text-black/80 dark:text-white/80 ">
                  <UIcon name="i-heroicons-users" class="w-4 h-4 text-blue-400" />
                  <span class="text-xs font-medium">{{ course.session?.length || 0 }} {{ $t('courseDetail.session') }}</span>
                </div>
                <div class="flex items-center gap-2 text-black/80 dark:text-white/80">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4 text-green-400" />
                  <span class="text-xs font-medium">{{ course.duration || '0' }} {{ $t('courseDetail.hour') }}</span>
                </div>
                <div class="flex items-center gap-2 text-black/80 dark:text-white/80">
                  <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 text-indigo-400" />
                  <span class="text-xs font-medium">{{ course.skill?.length || 0 }} {{ $t('courseDetail.skill') }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-2">
                <!-- Register Button -->
                <UButton
                  v-if="!course.registered && course.session.length > 0"
                  :loading="loadingRegister"
                  :disabled="loadingRegister"
                  @click="handleRegister"
                  size="lg"
                  class="font-semibold rounded-xl shadow-lg "
                >
                  <UIcon name="i-heroicons-user-plus" class="w-5 h-5 me-2" />
                  {{ $t('courseDetail.registerInCourse') }}
                </UButton>

                <!-- View Lessons Button -->
                <UButton
                  v-if="course.registered && course.session.length > 0"
                  :to="`/course/learn/${course.id}/${course.session[0].id}`"
                  size="lg"
                  variant="solid"
                  class="font-semibold rounded-xl"
                >
                  <UIcon name="i-heroicons-play" class="w-5 h-5 me-2" />
                  {{ $t('courseDetail.viewLessons') }}
                </UButton>

                <!-- Share Button -->
                <UButton
                  @click="shareCourse"
                  size="lg"
                  variant="ghost"
                  class="rounded-xl"
                >
                  <UIcon name="i-heroicons-share" class="w-5 h-5 mr-2" />
                  {{ $t('courseDetail.share') }}
                </UButton>
              </div>

              <!-- Course Update Alert -->
              <UAlert
                v-if="course.session.length === 0"
                icon="i-heroicons-information-circle"
                variant="soft"
                class="bg-yellow-500/20 border-yellow-500/30 text-yellow-100 text-sm"
              >
                {{ $t('courseDetail.courseUpdating') }}
              </UAlert>

              <!-- Registration Success Alert -->
              <UAlert
                v-if="course.registered && course.session.length > 0"
                icon="i-heroicons-check-circle"
                color="success"
                variant="soft"
                class="bg-green-500/20 border-green-500/30 text-green-800 dark:text-green-100 text-sm"
              >
                <div class="flex items-center justify-between">
                  <span>{{ $t('courseDetail.alreadyRegistered') }}</span>
                  <UButton
                    :to="`/course/learn/${course.id}/${course.session[0].id}`"
                    size="sm"
                    color="success"
                    variant="solid"
                    class="rounded-xl"
                  >
                    {{ $t('courseDetail.view') }}
                  </UButton>
                </div>
              </UAlert>
            </div>

            <!-- Side Panel (1 column) -->
            <div class="space-y-2">
      
              <!-- Instructor/Institute Card -->
             <div class="flex justify-center">
               <div 
                 v-if="course.institute || course.teacher"
                 @click="navigateToInstructor"
                 class="  pe-5 px-3 border-black/10 dark:border-white/10 rounded-xl p-2 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 group"
               >
                 <div class="flex items-center gap-3">
                   <div class="relative">
                     <UAvatar
                       :src="getInstructorImage()"
                       :alt="getInstructorName()"
                       size="xl"
                       class="ring-2 ring-black/20 dark:ring-white/20 group-hover:ring-black/40 dark:group-hover:ring-white/40 transition-all duration-300"
                     />
                   </div>
                   <div class="flex-1 min-w-0">
                     <div class="font-semibold text-black dark:text-white text-sm truncate">
                       {{ getInstructorUsername() }}
                     </div>
                     <div class="text-xs text-gray-700 dark:text-gray-300 truncate">
                       {{ getInstructorName() }}
                     </div>
                   </div>
                 </div>
               </div>
             </div>

              <!-- Course Badges -->
              <div class="flex flex-wrap justify-center gap-2 ">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                  <UIcon name="i-heroicons-star" class="w-3 h-3 me-1" />
                  5
                </span>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30">
                  <UIcon name="i-heroicons-check-circle" class="w-3 h-3 me-1" />
                  گواهی
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseDetail } from '~/types/course'

interface Props {
  course: CourseDetail
  loadingRegister?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loadingRegister: false
})

const emit = defineEmits<{
  register: []
  share: []
}>()

function formatPrice(amount: number) {
    if (amount === 0) return 'Free'
    return amount.toLocaleString('en-US')
}

const calculateFinalPrice = () => {
  if (props.course.price === 0) return 0
  if (!props.course.discount) return props.course.price
  return Math.round(props.course.price - (props.course.price * props.course.discount / 100))
}

const getInstructorImage = () => {
  if (props.course.institute?.image) return props.course.institute.image
  if (props.course.teacher?.image) return props.course.teacher.image
  return `https://tedline.org/api/account/user_profile_image/${props.course.teacher?.username}`
}

const getInstructorUsername = () => {
  return props.course.institute?.username || props.course.teacher?.username || ''
}

const getInstructorName = () => {
  if (props.course.institute?.name) return props.course.institute.name
  if (props.course.teacher?.first_name && props.course.teacher?.last_name) {
    return `${props.course.teacher.first_name} ${props.course.teacher.last_name}`
  }
  return props.course.teacher?.username || ''
}

const navigateToInstructor = () => {
  if (props.course.institute) {
    navigateTo(`/i/${props.course.institute.username}`)
  } else if (props.course.teacher) {
    navigateTo(`/profile/${props.course.teacher.username}`)
  }
}

const handleRegister = () => {
  emit('register')
}

const shareCourse = () => {
  emit('share')
}
</script>