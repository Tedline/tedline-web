<template>
  <div class="max-w-7xl mx-auto space-y-8 mt-5">
    <!-- Skills Section -->
    <SharedSectionCard
      :title="$t('courseDetail.skillsTitle')"
      :description="$t('courseDetail.skillsDesc')"
      icon="i-heroicons-academic-cap"
      color="blue"
      :full-height="true"
    >
      <div v-if="course.skill && course.skill.length > 0" class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <span
            v-for="skill in course.skill"
            :key="skill.id"
            class="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
          >
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            {{ skill.title }}
          </span>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <UIcon name="i-heroicons-information-circle" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ $t('courseDetail.noSkillsMessage') }}</p>
      </div>
    </SharedSectionCard>

    <!-- Teachers Section -->
    <SharedSectionCard
      v-if="course.teacher || (course.teachers && course.teachers.length > 0)"
      :title="$t('courseDetail.teachersTitle')"
      :description="$t('courseDetail.teachersDesc')"
      icon="i-heroicons-users"
      color="purple"
    >
      <div class="space-y-6">
        <div
          v-if="course.teachers && course.teachers.length > 0"
          v-for="teacher in course.teachers"
          :key="teacher.username"
          @click="navigateToTeacher(teacher)"
          class="group cursor-pointer"
        >
          <SharedTeacher :teacher="teacher" />
        </div>
        
        <div
          v-else-if="course.teacher"
          @click="navigateToTeacher(course.teacher)"
          class="group cursor-pointer"
        >
          <SharedTeacher :teacher="course.teacher" />
        </div>
      </div>
    </SharedSectionCard>

    <!-- Description Section -->
    <SharedSectionCard
      v-if="course.description"
      :title="$t('courseDetail.descriptionTitle')"
      :description="$t('courseDetail.descriptionDesc')"
      icon="i-heroicons-document-text"
      color="amber"
    >
      <div class="prose prose-gray max-w-none">
        <div class="bg-gray-50/50 rounded-xl p-6 border border-gray-100 dark:bg-stone-800/70 dark:border-stone-800 dark:hover:bg-gray-800/60 dark:hover:border-gray-800">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">
            {{ course.description }}
          </p>
        </div>
      </div>
    </SharedSectionCard>
  </div>
</template>

<script setup lang="ts">
import type { CourseDetail } from '~/types/course'
import type { Teacher } from '~/types/teacher'

interface Props {
  course: CourseDetail
}

const props = defineProps<Props>()



const navigateToTeacher = (teacher: Teacher) => {
  navigateTo(`/profile/${teacher.username}`)
}
</script>