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

      <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-stone-900/50">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
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
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth',
  },
  locale: isFa.value ? faLocale : 'en',
  direction: currentLocale.value?.dir || 'rtl',
  titleFormat: isFa.value ? 'jYYYY jMMMM' : 'MMMM YYYY',
  fixedWeekCount: false,
  showNonCurrentDates: true,

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
