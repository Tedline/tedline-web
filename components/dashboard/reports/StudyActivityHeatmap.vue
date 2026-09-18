<template>
  <div class="rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-stone-900/50 p-6   flex flex-col justify-between">
    <!-- Card Header -->
    <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          {{ $t('reports.heatmap.title') }}
        </h3>
        <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ $t('reports.heatmap.subtitle') }}
        </p>
      </div>
      <div class="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
        <CalendarDaysIcon class="w-5 h-5" aria-hidden="true" />
      </div>
    </div>

    <!-- Heatmap Grid Container (Scrollable) -->
    <div
      ref="scrollContainerRef"
      class="overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10"
      @scroll.passive="onCellLeave"
    >
      <div class="inline-flex flex-col min-w-max select-none">
        <!-- Month Headers Row -->
        <div class="flex items-center gap-1 sm:gap-1.5 mb-1.5 h-5">
          <!-- Spacer matching weekday labels column width -->
          <div class="w-6 sm:w-7 shrink-0" aria-hidden="true" />
          <!-- Month label slots aligned with week columns -->
          <div class="flex items-center gap-1 sm:gap-1.5">
            <div
              v-for="(m, colIdx) in monthLabels"
              :key="colIdx"
              class="relative w-3 sm:w-3.5 shrink-0 h-4"
            >
              <span
                v-if="m.label"
                class="absolute start-0 top-0 text-[11px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap pointer-events-none"
              >
                {{ m.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Main Grid: Weekdays on the start side, then Week Columns -->
        <div class="flex items-start gap-1 sm:gap-1.5">
          <!-- Weekday Indicators Column (7 days) -->
          <div class="flex flex-col gap-1 sm:gap-1.5 w-6 sm:w-7 shrink-0 text-start" aria-hidden="true">
            <div
              v-for="(dayName, dIdx) in weekdayNames"
              :key="dIdx"
              class="h-3 sm:h-3.5 flex items-center justify-start text-[10px] sm:text-[11px] font-medium text-gray-400 dark:text-gray-500 leading-none"
            >
              {{ dayName }}
            </div>
          </div>

          <!-- Week Columns -->
          <div
            class="flex items-center gap-1 sm:gap-1.5"
            role="grid"
            :aria-label="$t('reports.heatmap.title')"
          >
            <div
              v-for="(week, weekIdx) in weeks"
              :key="weekIdx"
              class="flex flex-col gap-1 sm:gap-1.5 shrink-0"
              role="row"
            >
              <div
                v-for="(day, dayIdx) in week"
                :key="day.date || dayIdx"
                class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] transition-colors duration-150"
                :class="[
                  day.inRange ? dayColorClass(day.count) : 'opacity-0 pointer-events-none',
                  day.inRange ? 'cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:ring-offset-1 dark:hover:ring-offset-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500' : ''
                ]"
                :tabindex="day.inRange ? 0 : -1"
                :role="day.inRange ? 'gridcell' : 'presentation'"
                :aria-label="day.inRange ? $t('reports.heatmap.tooltip', { count: formatNumber(day.count), date: day.formattedDate }) : undefined"
                @mouseenter="onCellEnter($event, day)"
                @mouseleave="onCellLeave"
                @focus="onCellEnter($event, day)"
                @blur="onCellLeave"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer: Total Summary & Less-to-More Legend -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <span class="font-bold text-gray-900 dark:text-white">{{ formatNumber(totalActivities) }}</span>
        <span>{{ $t('reports.overall.completedBoxes') }}</span>
      </div>

      <!-- Less-to-More Legend -->
      <div class="flex items-center gap-2 select-none">
        <span>{{ $t('reports.heatmap.less') }}</span>
        <div class="flex items-center gap-1" aria-hidden="true">
          <div class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-gray-100 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.05]" />
          <div class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-emerald-200 dark:bg-emerald-900/60" />
          <div class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-emerald-400 dark:bg-emerald-600" />
          <div class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[3px] bg-emerald-600 dark:bg-emerald-400" />
        </div>
        <span>{{ $t('reports.heatmap.more') }}</span>
      </div>
    </div>

    <!-- Floating Hover/Focus Tooltip -->
    <ClientOnly>
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isMounted && hoveredCell && tooltipCoords"
            role="tooltip"
            aria-hidden="true"
            :style="tooltipStyle"
            class="pointer-events-none fixed z-[9999] px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900/95 dark:bg-stone-800/95 dark:text-gray-100 rounded-lg shadow-lg border border-white/10 backdrop-blur-sm whitespace-nowrap"
          >
            {{ $t('reports.heatmap.tooltip', { count: formatNumber(hoveredCell.count), date: hoveredCell.formattedDate }) }}
            <!-- Tooltip pointer arrow -->
            <div
              class="absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900/95 dark:bg-stone-800/95"
              :class="[
                isNearTop
                  ? '-top-1 border-s border-t border-white/10'
                  : '-bottom-1 border-e border-b border-white/10'
              ]"
            />
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import moment from 'moment-jalaali'

// Initialize Persian modern dialect for moment-jalaali
if (typeof moment.loadPersian === 'function') {
  moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })
}

interface Props {
  activityHeatmap?: Record<string, number>
  days?: number
}

const props = withDefaults(defineProps<Props>(), {
  activityHeatmap: () => ({}),
  days: 365
})

const { locale } = useI18n()
const isFa = computed(() => locale.value === 'fa')

const isMounted = ref(false)
const scrollContainerRef = ref<HTMLElement | null>(null)

// Format numbers according to active locale
const formatNumber = (val: number): string => {
  if (!Number.isFinite(val) || Number.isNaN(val)) return '0'
  return new Intl.NumberFormat(locale.value || 'fa').format(val)
}

// Format date for tooltip: Jalali when 'fa', Gregorian YYYY/MM/DD when 'en'
const formatTooltipDate = (dateStr: string): string => {
  if (!dateStr) return ''
  if (isFa.value) {
    return moment(dateStr).format('jYYYY/jMM/jDD')
  }
  return moment(dateStr).locale('en').format('YYYY/MM/DD')
}

// Intensity level colors
const dayColorClass = (count: number): string => {
  if (!count || count <= 0) {
    return 'bg-gray-100 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.05]'
  }
  if (count <= 2) {
    return 'bg-emerald-200 dark:bg-emerald-900/60'
  }
  if (count <= 5) {
    return 'bg-emerald-400 dark:bg-emerald-600'
  }
  return 'bg-emerald-600 dark:bg-emerald-400'
}

// Weekday row indicators (ش, ی, د, س, چ, پ, ج in fa / S, M, T, W, T, F, S in en)
const weekdayNames = computed(() => {
  if (isFa.value) {
    return ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
  }
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S']
})

interface DayCell {
  date: string
  count: number
  formattedDate: string
  inRange: boolean
  dayOfWeek: number
  monthKey: number
  monthName: string
}

// Convert Date object to local YYYY-MM-DD string
const toDateKey = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Day of week index:
// fa: Saturday (0) .. Friday (6)
// en: Sunday (0) .. Saturday (6)
const getDayIndex = (d: Date, fa: boolean): number => {
  const jsDay = d.getDay()
  return fa ? (jsDay + 1) % 7 : jsDay
}

// Generate calendar columns of 7 days
const weeks = computed<DayCell[][]>(() => {
  const count = Math.max(1, props.days || 365)
  const heatmap = props.activityHeatmap || {}
  const fa = isFa.value

  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const todayKey = toDateKey(today)

  const startDate = new Date(today)
  startDate.setDate(today.getDate() - (count - 1))
  const startDateKey = toDateKey(startDate)

  // Align start date to start of week (day 0)
  const startDayOfWeek = getDayIndex(startDate, fa)
  const firstGridDate = new Date(startDate)
  firstGridDate.setDate(startDate.getDate() - startDayOfWeek)

  // Align end date to end of week (day 6)
  const endDayOfWeek = getDayIndex(today, fa)
  const lastGridDate = new Date(today)
  lastGridDate.setDate(today.getDate() + (6 - endDayOfWeek))

  const result: DayCell[][] = []
  let curr = new Date(firstGridDate)
  let currentWeek: DayCell[] = []

  while (curr <= lastGridDate) {
    const dStr = toDateKey(curr)
    const inRange = dStr >= startDateKey && dStr <= todayKey
    const cellCount = inRange ? (heatmap[dStr] ?? 0) : 0
    const m = moment(curr)

    const monthKey = fa ? m.jMonth() : m.month()
    const monthName = fa ? m.format('jMMMM') : m.locale('en').format('MMM')

    currentWeek.push({
      date: dStr,
      count: cellCount,
      formattedDate: inRange ? formatTooltipDate(dStr) : '',
      inRange,
      dayOfWeek: getDayIndex(curr, fa),
      monthKey,
      monthName
    })

    if (currentWeek.length === 7) {
      result.push(currentWeek)
      currentWeek = []
    }

    curr.setDate(curr.getDate() + 1)
  }

  return result
})

// Calculate month headers above week columns
const monthLabels = computed(() => {
  const list: { col: number; label: string }[] = []
  const weekList = weeks.value
  let lastMonthKey = -1
  let lastCol = -99

  for (let c = 0; c < weekList.length; c++) {
    const week = weekList[c]
    const validDays = week.filter((d) => d.inRange)
    const repDay = validDays.length > 0 ? validDays[0] : week[0]

    if (!repDay) {
      list.push({ col: c, label: '' })
      continue
    }

    const isLastCol = c === weekList.length - 1
    // Show month label on month change, spacing at least 2 columns apart to avoid collision
    if (repDay.monthKey !== lastMonthKey && (c - lastCol >= 2) && (!isLastCol || weekList.length <= 2)) {
      list.push({ col: c, label: repDay.monthName })
      lastMonthKey = repDay.monthKey
      lastCol = c
    } else {
      list.push({ col: c, label: '' })
    }
  }

  return list
})

// Total activities in the active range
const totalActivities = computed(() => {
  return weeks.value.flat().filter((d) => d.inRange).reduce((sum, d) => sum + d.count, 0)
})

// Floating tooltip state
interface HoveredCellInfo {
  count: number
  date: string
  formattedDate: string
}

interface TooltipCoords {
  x: number
  y: number
  bottom: number
}

const hoveredCell = ref<HoveredCellInfo | null>(null)
const tooltipCoords = ref<TooltipCoords | null>(null)

const isNearTop = computed(() => {
  return (tooltipCoords.value?.y ?? 100) < 50
})

const tooltipStyle = computed(() => {
  if (!tooltipCoords.value) return {}
  const nearTop = isNearTop.value
  return {
    left: `${tooltipCoords.value.x}px`,
    top: nearTop ? `${tooltipCoords.value.bottom + 8}px` : `${tooltipCoords.value.y}px`,
    transform: nearTop ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
  }
})

const onCellEnter = (event: MouseEvent | FocusEvent, day: DayCell) => {
  if (!day.inRange) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  tooltipCoords.value = {
    x: rect.left + rect.width / 2,
    y: rect.top - 8,
    bottom: rect.bottom
  }
  hoveredCell.value = {
    count: day.count,
    date: day.date,
    formattedDate: day.formattedDate
  }
}

const onCellLeave = () => {
  hoveredCell.value = null
}

onMounted(() => {
  isMounted.value = true
  window.addEventListener('scroll', onCellLeave, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onCellLeave)
})
</script>
