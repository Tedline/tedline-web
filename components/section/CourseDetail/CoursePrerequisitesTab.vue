<template>
  <div class="max-w-7xl mx-auto space-y-8 mt-5">
    <!-- Prerequisites Section -->
    <SharedSectionCard
      :title="$t('courseDetail.prerequisitesTitle')"
      :description="$t('courseDetail.prerequisitesDesc')"
      icon="i-heroicons-check-circle"
      color="green"
      :full-height="true"
    >
      <!-- No Prerequisites Alert -->
      <div v-if="!course.prerequisite || course.prerequisite.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-information-circle" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <div class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('courseDetail.noPrerequisitesTitle') }}</div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('courseDetail.noPrerequisitesDesc') }}</p>
      </div>

      <!-- Prerequisites Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SharedCourseCard
          v-for="prereq in course.prerequisite"
          :key="prereq.id"
          :course="prereq"
        />
      </div>
    </SharedSectionCard>

    <!-- Prerequisites Info Section -->
    <SharedSectionCard
      :title="$t('courseDetail.whyPrerequisitesTitle')"
      :description="$t('courseDetail.whyPrerequisitesDesc')"
      icon="i-heroicons-light-bulb"
      color="amber"
    >
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700/50">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-start gap-2">
            <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span class="text-gray-700 dark:text-gray-300">{{ $t('courseDetail.betterUnderstanding') }}</span>
          </div>
          <div class="flex items-start gap-2">
            <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span class="text-gray-700 dark:text-gray-300">{{ $t('courseDetail.fullPreparation') }}</span>
          </div>
          <div class="flex items-start gap-2">
            <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span class="text-gray-700 dark:text-gray-300">{{ $t('courseDetail.fasterProgress') }}</span>
          </div>
          <div class="flex items-start gap-2">
            <UIcon name="i-heroicons-check" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span class="text-gray-700 dark:text-gray-300">{{ $t('courseDetail.reducedLearningIssues') }}</span>
          </div>
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
</script>