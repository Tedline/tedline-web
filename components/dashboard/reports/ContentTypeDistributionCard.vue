<template>
  <div class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6 shadow-sm flex flex-col justify-between">
    <!-- Card Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {{ $t('reports.contentType.title') }}
        </h3>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ $t('reports.contentType.subtitle') }}
        </p>
      </div>
      <div class="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 shrink-0">
        <RectangleGroupIcon class="w-5 h-5" aria-hidden="true" />
      </div>
    </div>

    <!-- Donut Chart Section -->
    <div class="relative flex flex-col items-center justify-center py-3">
      <div class="w-full max-w-[280px] sm:max-w-xs flex justify-center relative min-h-[240px] items-center">
        <!-- Subtle empty track visible when completions are all zero -->
        <div
          v-if="isAllZero"
          aria-hidden="true"
          class="absolute inset-0 m-auto w-44 h-44 rounded-full border-[18px] border-gray-100 dark:border-white/[0.04] pointer-events-none"
        />

        <ClientOnly>
          <apexchart
            type="donut"
            height="240"
            :options="chartOptions"
            :series="chartSeries"
          />
          <template #fallback>
            <div class="h-[240px] flex items-center justify-center">
              <div class="w-36 h-36 rounded-full border-8 border-gray-200 dark:border-white/10 border-t-blue-500 animate-pulse flex items-center justify-center">
                <div class="w-20 h-20 rounded-full bg-white dark:bg-stone-900" />
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Detailed Media List / Progress Bars -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
      <div
        v-for="item in mediaList"
        :key="item.key"
        class="rounded-2xl p-3.5 sm:p-4 bg-gray-50/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex flex-col justify-between transition-colors"
      >
        <!-- Top: Icon/Emoji + Title and Percentage -->
        <div class="flex items-center justify-between gap-2 mb-2.5">
          <div class="flex items-center gap-2.5 min-w-0">
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              :class="item.badgeClass"
            >
              <component :is="item.icon" class="w-4 h-4" aria-hidden="true" />
            </div>
            <div class="min-w-0 flex items-center gap-1.5">
              <span class="text-sm select-none" aria-hidden="true">{{ item.emoji }}</span>
              <span class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                {{ item.title }}
              </span>
            </div>
          </div>
          <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white shrink-0">
            {{ formatPercent(item.percent) }}
          </span>
        </div>

        <!-- Bottom: Ratio and Progress Bar -->
        <div>
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span class="truncate">
              {{ $t('reports.contentType.completedRatio', { completed: formatNumber(item.completed), total: formatNumber(item.total) }) }}
            </span>
            <span class="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 ms-2">
              {{ formatNumber(item.completed) }} / {{ formatNumber(item.total) }}
            </span>
          </div>

          <!-- Mini Progress Bar -->
          <div class="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              class="h-1.5 rounded-full transition-all duration-500"
              :class="item.barClass"
              :style="{ width: `${item.percent}%` }"
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
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  RectangleGroupIcon,
  VideoCameraIcon
} from '@heroicons/vue/24/outline'

export interface ContentTypeStat {
  completed: number
  total: number
  percent: number // e.g. 75.0
}

export interface ContentTypeDistribution {
  video: ContentTypeStat
  audio: ContentTypeStat
  file: ContentTypeStat
  quiz: ContentTypeStat
}

interface Props {
  data?: ContentTypeDistribution
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    video: { completed: 0, total: 0, percent: 0 },
    audio: { completed: 0, total: 0, percent: 0 },
    file: { completed: 0, total: 0, percent: 0 },
    quiz: { completed: 0, total: 0, percent: 0 }
  })
})

const { t, locale } = useI18n()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

// Safe helper for media stats avoiding division by zero or NaN
const getStat = (stat?: Partial<ContentTypeStat>): { completed: number; total: number; percent: number } => {
  const completed = Math.max(0, stat?.completed ?? 0)
  const total = Math.max(0, stat?.total ?? 0)
  let percent = stat?.percent ?? (total > 0 ? (completed / total) * 100 : 0)
  if (!Number.isFinite(percent) || Number.isNaN(percent)) {
    percent = total > 0 ? (completed / total) * 100 : 0
  }
  percent = Math.min(100, Math.max(0, percent))
  return { completed, total, percent }
}

const videoStat = computed(() => getStat(props.data?.video))
const audioStat = computed(() => getStat(props.data?.audio))
const fileStat = computed(() => getStat(props.data?.file))
const quizStat = computed(() => getStat(props.data?.quiz))

const totalCompleted = computed(() =>
  videoStat.value.completed +
  audioStat.value.completed +
  fileStat.value.completed +
  quizStat.value.completed
)

const isAllZero = computed(() => totalCompleted.value === 0)

// Localized number formatters
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

// Donut chart series: [video.completed, audio.completed, file.completed, quiz.completed]
const chartSeries = computed(() => [
  videoStat.value.completed,
  audioStat.value.completed,
  fileStat.value.completed,
  quizStat.value.completed
])

// Donut chart responsive configuration
const chartOptions = computed(() => ({
  chart: {
    type: 'donut' as const,
    fontFamily: 'inherit',
    animations: {
      enabled: !isAllZero.value,
      speed: 600
    }
  },
  colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
  labels: [
    t('reports.contentType.video'),
    t('reports.contentType.audio'),
    t('reports.contentType.file'),
    t('reports.contentType.quiz')
  ],
  stroke: {
    show: !isAllZero.value,
    width: 2,
    colors: [isDark.value ? '#1c1917' : '#ffffff']
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  tooltip: {
    enabled: !isAllZero.value,
    theme: isDark.value ? 'dark' : 'light',
    y: {
      formatter: (val: number) => {
        if (!Number.isFinite(val) || Number.isNaN(val)) return '0'
        return formatNumber(val)
      }
    }
  },
  plotOptions: {
    pie: {
      expandOnClick: !isAllZero.value,
      donut: {
        size: '72%',
        background: 'transparent',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '13px',
            fontFamily: 'inherit',
            fontWeight: 500,
            color: isDark.value ? '#9ca3af' : '#64748b',
            offsetY: -4
          },
          value: {
            show: true,
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'inherit',
            color: isDark.value ? '#ffffff' : '#0f172a',
            offsetY: 6,
            formatter: (val: string | number) => {
              const n = Number(val)
              return Number.isFinite(n) ? formatNumber(n) : '0'
            }
          },
          total: {
            show: true,
            showAlways: true,
            label: t('reports.overall.completedBoxes'),
            fontSize: '11px',
            fontWeight: 500,
            fontFamily: 'inherit',
            color: isDark.value ? '#9ca3af' : '#64748b',
            formatter: () => formatNumber(totalCompleted.value)
          }
        }
      }
    }
  },
  noData: {
    text: '',
    align: 'center' as const,
    verticalAlign: 'middle' as const
  },
  theme: {
    mode: isDark.value ? ('dark' as const) : ('light' as const)
  }
}))

// Media breakdown list items
const mediaList = computed(() => [
  {
    key: 'video',
    emoji: '🎥',
    icon: VideoCameraIcon,
    title: t('reports.contentType.video'),
    completed: videoStat.value.completed,
    total: videoStat.value.total,
    percent: videoStat.value.percent,
    badgeClass: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    barClass: 'bg-blue-500'
  },
  {
    key: 'audio',
    emoji: '🎧',
    icon: MusicalNoteIcon,
    title: t('reports.contentType.audio'),
    completed: audioStat.value.completed,
    total: audioStat.value.total,
    percent: audioStat.value.percent,
    badgeClass: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
    barClass: 'bg-purple-500'
  },
  {
    key: 'file',
    emoji: '📄',
    icon: DocumentTextIcon,
    title: t('reports.contentType.file'),
    completed: fileStat.value.completed,
    total: fileStat.value.total,
    percent: fileStat.value.percent,
    badgeClass: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    barClass: 'bg-amber-500'
  },
  {
    key: 'quiz',
    emoji: '📝',
    icon: ClipboardDocumentCheckIcon,
    title: t('reports.contentType.quiz'),
    completed: quizStat.value.completed,
    total: quizStat.value.total,
    percent: quizStat.value.percent,
    badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    barClass: 'bg-emerald-500'
  }
])
</script>
