<template>
  <div class="max-w-7xl mx-auto space-y-8 mt-5">
    <!-- Syllabus Header Section -->
    <SharedSectionCard
      :title="$t('courseDetail.syllabusTitle')"
      :description="$t('courseDetail.syllabusDesc')"
      icon="i-heroicons-list-bullet"
      color="green"
    >
      <!-- No Sessions Alert -->
      <div v-if="course.session.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-information-circle" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('courseDetail.noSyllabusMessage') }}</p>
        <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">{{ $t('courseDetail.syllabusPreparingMessage') }}</p>
      </div>

      <!-- Sessions Timeline -->
      <div v-else class="relative">
        <!-- Timeline Line -->
        <div class="absolute start-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        <!-- Sessions -->
        <div class="space-y-6">
          <div
            v-for="(session, index) in course.session"
            :key="session.id"
            class="relative flex items-start gap-4"
          >
            <!-- Timeline Dot -->
            <div class="relative z-10 flex-shrink-0">
              <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-white text-sm font-semibold">{{ index + 1 }}</span>
              </div>
            </div>
            
            <!-- Session Content -->
            <div class="flex-1 bg-gray-50/50 dark:bg-stone-800/70 rounded-xl p-4 border border-gray-100 dark:border-stone-800/10 hover:bg-gray-100/50 dark:hover:bg-gray-800/60 transition-colors duration-200">
              <div class="flex items-start justify-between mb-2">
                <h4 class="text-md font-semibold text-gray-900 dark:text-white">{{ session.title }}</h4>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-700/50">
                  {{ $t('courseDetail.chapter') }} {{ index + 1 }}
                </span>
              </div>
              
              <p v-if="session.description" class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {{ session.description }}
              </p>
              
              <div class="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                  <span>{{ $t('courseDetail.time') }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-video-camera" class="w-4 h-4" />
                  <span>{{ $t('courseDetail.video') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SharedSectionCard>

    <!-- Course Summary Section -->
    <SharedSectionCard
      :title="$t('courseDetail.courseSummary')"
      :description="$t('courseDetail.courseSummaryDesc')"
      icon="i-heroicons-chart-bar"
      color="indigo"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
          <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ course.session.length }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ $t('courseDetail.chaptersCount') }}</div>
        </div>
        <div class="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200/50 dark:border-green-700/50">
          <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ formatDuration(course.duration) }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ $t('courseDetail.totalDuration') }}</div>
        </div>
        <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
          <div class="text-lg font-bold text-purple-600 dark:text-purple-400">{{ course.skill?.length || 0 }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ $t('courseDetail.skillsCount') }}</div>
        </div>
      </div>
    </SharedSectionCard>
  </div>
</template>

<script setup lang="ts">
import type { CourseDetail } from '~/types/course'

interface Props {
  course: CourseDetail
}

const props = defineProps<Props>()

// Get i18n instance
const { t } = useI18n()

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours} ${t('courseDetail.hour')} ${t('and')} ${mins} ${t('minute')}`
  }
  return `${mins} ${t('minute')}`
}
</script>