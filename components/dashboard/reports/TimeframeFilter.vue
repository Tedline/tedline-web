<template>
  <div
    role="group"
    aria-label="Timeframe Filter"
    class="inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 gap-1 transition-opacity"
    :class="{ 'opacity-60 cursor-not-allowed': loading }"
  >
    <button
      v-for="timeframe in timeframes"
      :key="timeframe.value"
      type="button"
      :disabled="loading"
      :aria-pressed="modelValue === timeframe.value"
      @click="selectTimeframe(timeframe.value)"
      class="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      :class="[
        modelValue === timeframe.value
          ? 'bg-blue-600 text-white shadow-sm font-semibold'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5'
      ]"
    >
      {{ $t(timeframe.labelKey) }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

interface TimeframeOption {
  value: number
  labelKey: string
}

const timeframes: TimeframeOption[] = [
  { value: 30, labelKey: 'reports.timeframes.days30' },
  { value: 90, labelKey: 'reports.timeframes.days90' },
  { value: 180, labelKey: 'reports.timeframes.days180' },
  { value: 365, labelKey: 'reports.timeframes.days365' }
]

const selectTimeframe = (value: number) => {
  if (props.loading) return
  emit('update:modelValue', value)
}
</script>
