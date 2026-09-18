<template>
  <div class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6  ">
    <!-- Card Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {{ $t('reports.overall.title') }}
        </h3>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ $t('reports.overall.subtitle') }}
        </p>
      </div>
      <div class="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shrink-0">
        <ChartPieIcon class="w-5 h-5" aria-hidden="true" />
      </div>
    </div>

    <!-- Radial Bar / Semi-Circle Gauge -->
    <div class="flex flex-col items-center justify-center pt-2 pb-1">
      <div class="w-full max-w-[280px] sm:max-w-xs -mb-6 flex justify-center">
        <ClientOnly>
          <apexchart
            type="radialBar"
            height="230"
            :options="chartOptions"
            :series="chartSeries"
          />
          <template #fallback>
            <div class="h-[230px] flex flex-col items-center justify-center gap-2">
              <div class="w-28 h-14 border-4 border-blue-500/20 border-t-blue-500 rounded-t-full animate-pulse" />
              <div class="h-4 w-12 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- KPI Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
      <!-- 1. Finished Courses -->
      <div class="rounded-2xl p-4 bg-gray-50/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex flex-col justify-between transition-colors">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ $t('reports.overall.finishedCourses') }}
          </span>
          <div class="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
            <AcademicCapIcon class="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        <div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {{ formatNumber(completedCourses) }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500">
              / {{ formatNumber(totalEnrolledCourses) }}
            </span>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {{ $t('reports.overall.coursesRatio', { completed: formatNumber(completedCourses), total: formatNumber(totalEnrolledCourses) }) }}
          </p>

          <div class="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              class="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              :style="{ width: `${courseCompletionRate}%` }"
            />
          </div>
        </div>
      </div>

      <!-- 2. In-Progress Courses -->
      <div class="rounded-2xl p-4 bg-gray-50/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex flex-col justify-between transition-colors">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ $t('reports.overall.inProgressCourses') }}
          </span>
          <div class="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 shrink-0">
            <ClockIcon class="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        <div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {{ formatNumber(inProgressCourses) }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500">
              / {{ formatNumber(totalEnrolledCourses) }}
            </span>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {{ totalEnrolledCourses > 0 ? formatPercent(inProgressRate) : formatPercent(0) }}
          </p>

          <div class="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              class="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              :style="{ width: `${inProgressRate}%` }"
            />
          </div>
        </div>
      </div>

      <!-- 3. Lessons Completed -->
      <div class="rounded-2xl p-4 bg-gray-50/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex flex-col justify-between transition-colors">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ $t('reports.overall.completedBoxes') }}
          </span>
          <div class="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shrink-0">
            <BookOpenIcon class="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        <div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {{ formatNumber(completedBoxes) }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500">
              / {{ formatNumber(totalBoxes) }}
            </span>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {{ $t('reports.overall.boxesRatio', { completed: formatNumber(completedBoxes), total: formatNumber(totalBoxes) }) }}
          </p>

          <div class="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              class="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              :style="{ width: `${boxCompletionRate}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartPieIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

export interface OverallCompletion {
  total_enrolled_courses: number
  completed_courses: number
  in_progress_courses: number
  total_boxes: number
  completed_boxes: number
  overall_percentage: number
}

interface Props {
  data?: OverallCompletion
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    total_enrolled_courses: 0,
    completed_courses: 0,
    in_progress_courses: 0,
    total_boxes: 0,
    completed_boxes: 0,
    overall_percentage: 0
  })
})

const { locale } = useI18n()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

// Safe KPI computations avoiding division by zero
const totalEnrolledCourses = computed(() => props.data?.total_enrolled_courses ?? 0)
const completedCourses = computed(() => props.data?.completed_courses ?? 0)
const inProgressCourses = computed(() => props.data?.in_progress_courses ?? 0)
const totalBoxes = computed(() => props.data?.total_boxes ?? 0)
const completedBoxes = computed(() => props.data?.completed_boxes ?? 0)

const overallPercentage = computed(() => {
  const p = props.data?.overall_percentage ?? 0
  if (!Number.isFinite(p) || Number.isNaN(p)) return 0
  return Math.min(100, Math.max(0, p))
})

const courseCompletionRate = computed(() => {
  if (totalEnrolledCourses.value <= 0) return 0
  return Math.min(100, Math.max(0, (completedCourses.value / totalEnrolledCourses.value) * 100))
})

const inProgressRate = computed(() => {
  if (totalEnrolledCourses.value <= 0) return 0
  return Math.min(100, Math.max(0, (inProgressCourses.value / totalEnrolledCourses.value) * 100))
})

const boxCompletionRate = computed(() => {
  if (totalBoxes.value <= 0) return 0
  return Math.min(100, Math.max(0, (completedBoxes.value / totalBoxes.value) * 100))
})

// Number and percentage formatters using active locale
const formatNumber = (val: number): string => {
  if (!Number.isFinite(val) || Number.isNaN(val)) return '0'
  return new Intl.NumberFormat(locale.value || 'fa').format(val)
}

const formatPercent = (val: number): string => {
  if (!Number.isFinite(val) || Number.isNaN(val)) return '0%'
  return new Intl.NumberFormat(locale.value || 'fa', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(val / 100)
}

// Chart series and responsive options
const chartSeries = computed(() => [
  Number(overallPercentage.value.toFixed(1))
])

const chartOptions = computed(() => ({
  chart: {
    type: 'radialBar' as const,
    background: 'transparent',
    offsetY: -10,
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: true,
      speed: 800
    }
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: {
        margin: 0,
        size: '68%'
      },
      track: {
        background: isDark.value ? '#262626' : '#f1f5f9',
        strokeWidth: '100%',
        margin: 0,
        dropShadow: {
          enabled: false
        }
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          offsetY: -10,
          fontSize: '28px',
          fontWeight: '700',
          fontFamily: 'inherit',
          color: isDark.value ? '#ffffff' : '#0f172a',
          formatter: (val: number) => formatPercent(Number(val))
        }
      }
    }
  },
  grid: {
    padding: {
      top: -10,
      bottom: -15
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#10b981'],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  colors: ['#3b82f6'],
  stroke: {
    lineCap: 'round' as const
  },
  tooltip: {
    enabled: false
  },
  theme: {
    mode: isDark.value ? ('dark' as const) : ('light' as const)
  }
}))
</script>
