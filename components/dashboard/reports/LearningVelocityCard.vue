<template>
  <div class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6 shadow-sm flex flex-col justify-between">
    <!-- Card Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {{ $t('reports.velocity.title') }}
        </h3>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ $t('reports.velocity.subtitle') }}
        </p>
      </div>
      <div class="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shrink-0">
        <ArrowTrendingUpIcon class="w-5 h-5" aria-hidden="true" />
      </div>
    </div>

    <!-- Stat Summary Pills / Counters -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-4 pb-2">
      <!-- Total Completed Pill -->
      <div class="flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2 rounded-2xl bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 transition-colors">
        <div class="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-500" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ totalCompletedLabel }}
          </p>
          <p class="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
            {{ formatNumber(totalCompleted) }}
          </p>
        </div>
      </div>

      <!-- Peak Daily Pill -->
      <div class="flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2 rounded-2xl bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 transition-colors">
        <div class="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 flex items-center justify-center shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-sky-500" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ peakDailyLabel }}
          </p>
          <p class="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
            {{ formatNumber(peakDaily) }}
          </p>
        </div>
      </div>

      <!-- Daily Average Pill -->
      <div class="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-2.5 sm:px-3 sm:py-2 rounded-2xl bg-gray-50/80 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 transition-colors">
        <div class="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ dailyAverageLabel }}
          </p>
          <p class="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
            {{ formatAverage(dailyAverage) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative w-full min-h-[280px] pt-2">
      <ClientOnly>
        <apexchart
          type="line"
          height="280"
          :options="chartOptions"
          :series="chartSeries"
        />
        <template #fallback>
          <div class="h-[280px] w-full flex flex-col justify-between p-2">
            <!-- Skeleton Legend / Header -->
            <div class="flex items-center justify-end gap-3 pb-2">
              <div class="flex items-center gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-indigo-500/30 animate-pulse" />
                <div class="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-sky-500/30 animate-pulse" />
                <div class="h-3 w-14 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              </div>
            </div>

            <!-- Skeleton Chart Area with Fake Area & Bars -->
            <div class="flex-1 w-full flex items-end gap-2 px-2 pb-3 border-b border-gray-100 dark:border-white/5 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-t from-indigo-500/5 dark:from-indigo-500/10 to-transparent pointer-events-none" />

              <div
                v-for="i in 14"
                :key="i"
                class="flex-1 flex flex-col justify-end items-center h-full z-10"
              >
                <div
                  class="w-full max-w-[14px] bg-gray-200 dark:bg-white/10 rounded-t animate-pulse"
                  :style="{ height: `${Math.max(15, (i * 19) % 80 + 10)}%` }"
                />
              </div>
            </div>

            <!-- Skeleton X-Axis Ticks -->
            <div class="flex justify-between items-center px-2 pt-2">
              <div
                v-for="i in 7"
                :key="i"
                class="h-2.5 w-7 bg-gray-200 dark:bg-white/10 rounded animate-pulse"
              />
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowTrendingUpIcon } from '@heroicons/vue/24/outline'
import moment from 'moment-jalaali'

// Initialize Persian modern dialect for moment-jalaali
if (typeof moment.loadPersian === 'function') {
  moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })
}

export interface LearningVelocityItem {
  date: string // ISO date format "YYYY-MM-DD"
  daily_completed: number
  cumulative_completed: number
}

interface Props {
  velocity?: LearningVelocityItem[]
}

const props = withDefaults(defineProps<Props>(), {
  velocity: () => []
})

const { t, locale } = useI18n()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
const isFa = computed(() => locale.value === 'fa')

// Normalize and sort items safely
const safeVelocity = computed<LearningVelocityItem[]>(() => {
  const items = props.velocity
  if (!items || items.length === 0) {
    // Graceful fallback for empty data: past 7 days ending today with 0 values
    const today = new Date()
    const fallback: LearningVelocityItem[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      fallback.push({
        date: `${y}-${m}-${day}`,
        daily_completed: 0,
        cumulative_completed: 0
      })
    }
    return fallback
  }

  return [...items]
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .map((item) => ({
      date: item.date || '',
      daily_completed: Math.max(0, Number(item.daily_completed) || 0),
      cumulative_completed: Math.max(0, Number(item.cumulative_completed) || 0)
    }))
})

// KPI Metrics
const totalCompleted = computed(() => {
  if (!safeVelocity.value.length) return 0
  return Math.max(...safeVelocity.value.map((v) => v.cumulative_completed), 0)
})

const peakDaily = computed(() => {
  if (!safeVelocity.value.length) return 0
  return Math.max(...safeVelocity.value.map((v) => v.daily_completed), 0)
})

const dailyAverage = computed(() => {
  if (!props.velocity || props.velocity.length === 0) return 0
  const sum = safeVelocity.value.reduce((acc, v) => acc + v.daily_completed, 0)
  return sum / safeVelocity.value.length
})

const isAllZero = computed(() => totalCompleted.value === 0 && peakDaily.value === 0)

// Stat Labels
const totalCompletedLabel = computed(() => t('reports.velocity.totalCompleted'))
const peakDailyLabel = computed(() => t('reports.velocity.peakDaily'))
const dailyAverageLabel = computed(() => t('reports.velocity.dailyAverage'))

// Series names
const cumulativeSeriesName = computed(() => t('reports.velocity.cumulative'))
const dailySeriesName = computed(() => t('reports.velocity.daily'))

// Formatters
const formatNumber = (val: number): string => {
  if (!Number.isFinite(val) || Number.isNaN(val)) return '0'
  return new Intl.NumberFormat(locale.value || 'fa').format(val)
}

const formatAverage = (val: number): string => {
  if (!Number.isFinite(val) || Number.isNaN(val)) return '0'
  return new Intl.NumberFormat(locale.value || 'fa', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(val)
}

const formatXAxisDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const m = moment(dateStr)
    if (!m.isValid()) return dateStr
    if (isFa.value) {
      return m.format('jMM/jDD')
    }
    return m.locale('en').format('MM/DD')
  } catch {
    return dateStr
  }
}

const formatTooltipDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const m = moment(dateStr)
    if (!m.isValid()) return dateStr
    if (isFa.value) {
      return m.format('jYYYY/jMM/jDD')
    }
    return m.locale('en').format('YYYY/MM/DD')
  } catch {
    return dateStr
  }
}

// Chart series types: column for <= 45 days, line for larger datasets (e.g. 90/180/365 days)
const dailyChartType = computed<'column' | 'line'>(() => {
  return safeVelocity.value.length > 45 ? 'line' : 'column'
})

const categories = computed(() => safeVelocity.value.map((item) => formatXAxisDate(item.date)))


const tickAmount = computed(() => {
  const len = safeVelocity.value.length
  if (len <= 7) return len
  if (len <= 14) return 7
  if (len <= 31) return 10
  return 8
})

// ApexCharts Series
const chartSeries = computed(() => [
  {
    name: cumulativeSeriesName.value,
    type: 'area',
    data: safeVelocity.value.map((item) => item.cumulative_completed)
  },
  {
    name: dailySeriesName.value,
    type: dailyChartType.value,
    data: safeVelocity.value.map((item) => item.daily_completed)
  }
])

// ApexCharts Configuration
const chartOptions = computed(() => ({
  chart: {
    type: 'line' as const,
    height: 280,
    fontFamily: 'inherit',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    animations: {
      enabled: !isAllZero.value,
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  colors: ['#6366f1', '#0ea5e9'],
  stroke: {
    curve: 'smooth' as const,
    width: dailyChartType.value === 'column' ? [3, 0] : [3, 2],
    dashArray: dailyChartType.value === 'column' ? [0, 0] : [0, 4]
  },
  fill: {
    type: ['gradient', 'solid'],
    gradient: {
      shade: isDark.value ? 'dark' : 'light',
      type: 'vertical',
      shadeIntensity: 0.5,
      inverseColors: false,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    },
    opacity: [0.35, dailyChartType.value === 'column' ? 0.85 : 1]
  },
  plotOptions: {
    bar: {
      columnWidth:
        safeVelocity.value.length <= 14
          ? '28%'
          : safeVelocity.value.length <= 31
            ? '48%'
            : '70%',
      borderRadius: 4,
      borderRadiusApplication: 'end' as const
    }
  },
  markers: {
    size: safeVelocity.value.length <= 31 ? [3, 0] : [0, 0],
    strokeWidth: 2,
    strokeColors: isDark.value ? '#1c1917' : '#ffffff',
    hover: {
      size: 5
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: true,
    position: 'top' as const,
    horizontalAlign: 'right' as const,
    fontFamily: 'inherit',
    fontSize: '12px',
    fontWeight: 500,
    labels: {
      colors: isDark.value ? '#9ca3af' : '#64748b'
    },
    markers: {
      size: 5,
      strokeWidth: 0,
      radius: 12
    },
    itemMargin: {
      horizontal: 10,
      vertical: 0
    }
  },
  grid: {
    borderColor: isDark.value ? '#262626' : '#f1f5f9',
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      top: 0,
      right: 12,
      bottom: 0,
      left: 12
    }
  },
  xaxis: {
    type: 'category' as const,
    categories: categories.value,
    tickAmount: tickAmount.value,
    labels: {
      rotate: -45,
      rotateAlways: false,
      hideOverlappingLabels: true,
      style: {
        colors: isDark.value ? '#9ca3af' : '#64748b',
        fontFamily: 'inherit',
        fontSize: '11px'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: [
    {
      seriesName: cumulativeSeriesName.value,
      show: true,
      min: 0,
      max: totalCompleted.value > 0 ? undefined : 5,
      forceNiceScale: true,
      labels: {
        formatter: (val: number) => {
          if (!Number.isFinite(val) || Number.isNaN(val)) return '0'
          return formatNumber(Math.round(val))
        },
        style: {
          colors: isDark.value ? '#9ca3af' : '#64748b',
          fontFamily: 'inherit',
          fontSize: '11px'
        }
      }
    },
    {
      opposite: true,
      seriesName: dailySeriesName.value,
      show: true,
      min: 0,
      max: peakDaily.value > 0 ? undefined : 5,
      forceNiceScale: true,
      labels: {
        formatter: (val: number) => {
          if (!Number.isFinite(val) || Number.isNaN(val)) return '0'
          return formatNumber(Math.round(val))
        },
        style: {
          colors: isDark.value ? '#9ca3af' : '#64748b',
          fontFamily: 'inherit',
          fontSize: '11px'
        }
      }
    }
  ],
  tooltip: {
    enabled: true,
    shared: true,
    intersect: false,
    theme: isDark.value ? 'dark' : 'light',
    x: {
      formatter: (_val: any, opts?: { dataPointIndex?: number }) => {
        const idx = opts?.dataPointIndex
        if (typeof idx === 'number' && idx >= 0 && idx < safeVelocity.value.length) {
          const item = safeVelocity.value[idx]
          if (item?.date) {
            return formatTooltipDate(item.date)
          }
        }
        return String(_val ?? '')
      }
    },
    y: {
      formatter: (val: number) => {
        if (!Number.isFinite(val) || Number.isNaN(val)) return '0'
        return formatNumber(val)
      }
    }
  },
  theme: {
    mode: isDark.value ? ('dark' as const) : ('light' as const)
  }
}))
</script>
