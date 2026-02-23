<template>
  <div
    class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer dark:bg-stone-800/70 dark:border-stone-800 dark:hover:bg-gray-800/60 dark:hover:border-gray-800">
    <UAvatar :src="teacher.image || `https://tedline.org/api/account/user_profile_image/${teacher.username}`"
      :alt="teacher.username" size="lg" />
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-sm text-gray-900 dark:text-gray-200 truncate">{{ teacher.username }}</div>
      <div class="text-xs text-gray-600 dark:text-gray-300">
        {{ teacher.first_name && teacher.last_name ? `${teacher.first_name} ${teacher.last_name}` : teacher.username }}
      </div>
    </div>
    <UIcon name="i-heroicons-arrow-left" class="w-4 h-4 text-gray-400" />
  </div>
</template>

<script setup lang="ts">
import type { Teacher } from '~/types/teacher'

interface Props {
  teacher: Teacher
}

defineProps<Props>()
</script>
