<template>
  <div class="min-h-screen  ">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-6 dark:border-white/10 dark:bg-stone-900/50 sm:px-8">
        <div class="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-400/10" />
        <div class="absolute -right-12 -bottom-16 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />

        <div class="relative flex flex-col gap-6">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
              {{ $t('calendar.badge') }}
            </div>
            <h1 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {{ $t('calendar.title') }}
            </h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {{ $t('calendar.subtitle') }}
            </p>
          </div>

     
        </div>
      </div>

      <div class="calendar-wrapper mt-6 rounded-2xl border border-gray-200 bg-white p-2 sm:p-4 dark:border-white/10 dark:bg-stone-900/50">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import momentPlugin from '@fullcalendar/moment'
import faLocale from '@fullcalendar/core/locales/fa'
import { useI18n } from 'vue-i18n'
import moment from 'moment-jalaali'


definePageMeta({
  layout: 'dashboard',
})

const { locale, locales } = useI18n()
const currentLocale = computed(() => locales.value.find((l) => l.code === locale.value))
const isFa = computed(() => locale.value === 'fa')

const isMobile = ref(false)

const updateIsMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 640
  }
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

const remainingDays = ref(18)
const progress = ref(0.66)

const formattedDays = computed(() =>
  new Intl.NumberFormat(locale.value).format(remainingDays.value)
)
const formattedPercent = computed(() =>
  new Intl.NumberFormat(locale.value, { style: 'percent', maximumFractionDigits: 0 }).format(progress.value)
)
const progressPercent = computed(() => `${Math.round(progress.value * 100)}%`)

moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' })

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, momentPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: isMobile.value
    ? {
        left: 'prev,next',
        center: 'title',
        right: 'today',
      }
    : {
        left: 'prev,next today',
        center: 'title',
        right: '',
      },
  dayHeaderFormat: isMobile.value ? { weekday: 'narrow' } : { weekday: 'short' },
  locale: isFa.value ? faLocale : 'en',
  direction: currentLocale.value?.dir || 'rtl',
  titleFormat: isFa.value ? 'jYYYY jMMMM' : 'MMMM YYYY',
  fixedWeekCount: false,
  showNonCurrentDates: true,
  contentHeight: 'auto',
  handleWindowResize: true,

  // Read-only: no adding or editing events
  editable: false,
  selectable: false,
  eventStartEditable: false,
  eventDurationEditable: false,
  eventResizableFromStart: false,
  droppable: false,
  eventAllow: () => false,

  // Placeholder for backend events
  events: [],
}))
</script>

<style scoped>
/* Only target borders within FullCalendar */
.calendar-wrapper :deep(.fc) {
  --fc-border-color: #e5e7eb;
}

.calendar-wrapper :deep(.fc) {
  --fc-border-color: rgba(255, 255, 255, 0.1);
}

.calendar-wrapper :deep(.fc-theme-standard td),
.calendar-wrapper :deep(.fc-theme-standard th),
.calendar-wrapper :deep(.fc-theme-standard .fc-scrollgrid) {
  border-color: rgba(255, 255, 255, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .calendar-wrapper :deep(.fc .fc-toolbar) {
    gap: 0.5rem;
    align-items: center;
  }

  .calendar-wrapper :deep(.fc .fc-toolbar-title) {
    font-size: 1.1rem;
  }

  .calendar-wrapper :deep(.fc .fc-button) {
    padding: 0.35rem 0.6rem;
    font-size: 0.8rem;
  }

  .calendar-wrapper :deep(.fc .fc-col-header-cell-cushion) {
    padding: 4px 2px;
    font-size: 0.85rem;
  }

  .calendar-wrapper :deep(.fc .fc-daygrid-day-number) {
    padding: 4px;
    font-size: 0.85rem;
  }
}
</style>
