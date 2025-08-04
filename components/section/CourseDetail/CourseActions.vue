<template>
  <div class="space-y-4">
    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3">
      <!-- Register Button -->
      <UButton
        v-if="!course.registered && course.session.length > 0"
        :loading="loadingRegister"
        :disabled="loadingRegister"
        @click="handleRegister"
        class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg"
      >
        <UIcon name="i-heroicons-user-plus" class="w-5 h-5 mr-2" />
        {{ $t('courseDetail.registerInCourse') }}
      </UButton>

      <!-- View Lessons Button -->
      <UButton
        v-if="course.registered && course.session.length > 0"
        :to="`/course/learn/${course.id}/${course.session[0].id}`"
        variant="solid"
        class="flex-1 font-semibold py-3 px-6 rounded-xl"
      >
        <UIcon name="i-heroicons-eye" class="w-5 h-5 mr-2" />
        {{ $t('courseDetail.viewLessons') }}
      </UButton>

      <!-- Share Button -->
      <UButton
        @click="shareCourse"
        variant="outline"
        color="secondary"
        class="px-6 py-3 rounded-xl"
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
      class="text-sm"
    >
      {{ $t('courseDetail.courseUpdating') }}
    </UAlert>

    <!-- Registration Success Alert -->
    <UAlert
      v-if="course.registered && course.session.length > 0"
      icon="i-heroicons-check-circle"
      color="success"
      variant="soft"
      class="text-sm"
    >
      <div class="flex items-center justify-between">
        <span>{{ $t('courseDetail.alreadyRegistered') }}</span>
        <UButton
          :to="`/course/learn/${course.id}/${course.session[0].id}`"
          size="sm"
          color="success"
          variant="solid"
        >
          {{ $t('courseDetail.view') }}
        </UButton>
      </div>
    </UAlert>
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

const handleRegister = () => {
  emit('register')
}

const shareCourse = () => {
  emit('share')
}
</script>