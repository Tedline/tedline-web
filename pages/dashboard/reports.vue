<template>
  <div class="min-h-screen pb-16">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Top Hero / Header Card -->
      <div class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-6 dark:border-white/10 dark:bg-stone-900/50 sm:px-8 mb-6  ">
        <!-- Ambient Decorative Glows -->
        <div class="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10 pointer-events-none" />
        <div class="absolute -right-12 -bottom-16 h-48 w-48 rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/10 pointer-events-none" />

        <div class="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <!-- Title & Badge Section -->
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
              <ChartPieIcon class="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
              {{ $t('reports.badge') }}
            </div>
            <h1 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {{ $t('reports.title') }}
            </h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              {{ $t('reports.subtitle') }}
            </p>
          </div>

          <!-- Timeframe Filter Component -->
          <div v-if="!loading && !error && !isEmpty" class="shrink-0">
            <TimeframeFilter
              v-model="selectedDays"
              :loading="isTimeframeLoading"
            />
          </div>
        </div>
      </div>

      <!-- State 1: Loading Skeleton -->
      <ReportsSkeleton v-if="loading" />

      <!-- State 2: Error State -->
      <div
        v-else-if="error"
        class="rounded-3xl border border-rose-200 bg-rose-50/60 dark:border-rose-500/20 dark:bg-rose-500/10 p-8 sm:p-12 text-center"
      >
        <div class="mx-auto w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center mb-4">
          <ExclamationCircleIcon class="w-8 h-8" aria-hidden="true" />
        </div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.error.title') }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
          {{ error || $t('reports.error.description') }}
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          @click="fetchStats(false)"
        >
          <ArrowPathIcon class="w-4 h-4" aria-hidden="true" />
          {{ $t('reports.error.retry') }}
        </button>
      </div>

      <!-- State 3: Empty State -->
      <div
        v-else-if="isEmpty"
        class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-8 sm:p-14 text-center  "
      >
        <div class="mx-auto w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center mb-5">
          <AcademicCapIcon class="w-9 h-9" aria-hidden="true" />
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('reports.empty.title') }}
        </h2>
        <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
          {{ $t('reports.empty.description') }}
        </p>
        <NuxtLinkLocale
          to="/explore"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold text-sm transition-colors   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>{{ $t('reports.empty.cta') }}</span>
          <ArrowTopRightOnSquareIcon class="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
        </NuxtLinkLocale>
      </div>

      <!-- State 4: Ready / Populated Dashboard Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Card 1: Overall Completion -->
        <OverallCompletionCard :data="stats?.overall_completion" />

        <!-- Card 2: Content-Type Distribution -->
        <ContentTypeDistributionCard :data="stats?.content_type_distribution" />

        <!-- Card 3: Study Activity Heatmap -->
        <StudyActivityHeatmap
          :activity-heatmap="stats?.activity_heatmap"
          :days="selectedDays"
        />

        <!-- Card 4: Learning Velocity -->
        <LearningVelocityCard :velocity="stats?.learning_velocity" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChartPieIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline'

// Explicit component imports
import TimeframeFilter from '~/components/dashboard/reports/TimeframeFilter.vue'
import OverallCompletionCard from '~/components/dashboard/reports/OverallCompletionCard.vue'
import ContentTypeDistributionCard from '~/components/dashboard/reports/ContentTypeDistributionCard.vue'
import StudyActivityHeatmap from '~/components/dashboard/reports/StudyActivityHeatmap.vue'
import LearningVelocityCard from '~/components/dashboard/reports/LearningVelocityCard.vue'
import ReportsSkeleton from '~/components/dashboard/reports/ReportsSkeleton.vue'

definePageMeta({
  layout: 'dashboard'
})

export interface OverallCompletion {
  total_enrolled_courses: number
  completed_boxes: number
  total_boxes: number
  overall_progress_percent: number
  finished_courses_count: number
  in_progress_courses_count: number
}

export interface ContentTypeDistribution {
  video: { completed: number; total: number }
  audio: { completed: number; total: number }
  file: { completed: number; total: number }
  quiz: { completed: number; total: number }
}

export interface LearningVelocityItem {
  date: string
  daily_completed: number
  cumulative_completed: number
}

export interface LearningDashboardStatsResponse {
  overall_completion: OverallCompletion
  content_type_distribution: ContentTypeDistribution
  activity_heatmap: Record<string, number>
  learning_velocity: LearningVelocityItem[]
}

const userStore = useUserStore()
const router = useRouter()

const selectedDays = ref(365)
const loading = ref(true)
const isTimeframeLoading = ref(false)
const error = ref<string | null>(null)
const stats = ref<LearningDashboardStatsResponse | null>(null)

// Empty state check
const isEmpty = computed(() => {
  if (!stats.value || !stats.value.overall_completion) return false
  const oc = stats.value.overall_completion
  return oc.total_enrolled_courses === 0 || oc.completed_boxes === 0
})

const fetchStats = async (isTimeframeChange = false) => {
  if (isTimeframeChange) {
    isTimeframeLoading.value = true
  } else {
    loading.value = true
  }
  error.value = null

  try {
    const api = useApi(true)
    const response = await api(`course/dashboard/learning-stats/?days=${selectedDays.value}`)
    stats.value = response as LearningDashboardStatsResponse
  } catch (err: any) {
    console.error('Failed to load learning stats:', err)
    error.value = err?.userMessage || err?.data?.detail || err?.data?.message || err?.message || ''
  } finally {
    loading.value = false
    isTimeframeLoading.value = false
  }
}

// Watch timeframe filter changes
watch(selectedDays, (newVal, oldVal) => {
  if (newVal !== oldVal && userStore.isAuthenticated) {
    fetchStats(true)
  }
})

onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.replace('/auth/signIn?redirect=/dashboard/reports')
    return
  }
  fetchStats(false)
})
</script>
