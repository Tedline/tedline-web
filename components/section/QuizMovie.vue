<template>
  <div dir="rtl" class="space-y-6">
    <!-- Question Title -->
    <div class="flex items-start gap-3">
      <UAvatar size="md" color="primary" variant="soft" class="shrink-0 mt-0.5">
        <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5" />
      </UAvatar>
      <h4 class="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-relaxed">
        {{ data.text_question || data.text || data.title }}
      </h4>
    </div>

    <!-- Options List -->
    <div class="space-y-3">
      <div
        v-for="item in data.options"
        :key="item.id"
        @click="selectOption(item.id)"
        :class="[
          'p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 select-none',
          selectedAnswer === item.id
            ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 hover:border-gray-300 dark:hover:border-gray-700 text-gray-800 dark:text-gray-200'
        ]"
      >
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
              selectedAnswer === item.id
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300 dark:border-gray-600'
            ]"
          >
            <div
              v-if="selectedAnswer === item.id"
              class="w-2 h-2 rounded-full bg-white"
            />
          </div>
          <span class="text-sm font-medium leading-normal">{{ item.text || item.title }}</span>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="flex items-center gap-3 pt-2">
      <UButton
        @click="submitAnswer"
        :loading="loading"
        :disabled="!selectedAnswer || loading"
        color="primary"
        size="md"
        class="px-8 font-medium"
      >
        ثبت پاسخ
      </UButton>
    </div>

    <!-- Result Feedback -->
    <div v-if="result" class="pt-2 transition-all duration-300">
      <!-- Correct Answer -->
      <div
        v-if="result.result === 'correct'"
        class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3"
      >
        <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h5 class="text-sm font-bold text-emerald-900 dark:text-emerald-200">
            پاسخ شما صحیح است
          </h5>
          <p class="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
            آفرین! می‌توانید ویدئو را ادامه دهید.
          </p>
        </div>
      </div>

      <!-- Incorrect Answer -->
      <div
        v-else-if="result.result === 'incorrect'"
        class="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 space-y-3"
      >
        <div class="flex items-start gap-3">
          <UIcon name="i-heroicons-x-circle" class="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <h5 class="text-sm font-bold text-red-900 dark:text-red-200">
              پاسخ شما صحیح نیست
            </h5>
          </div>
        </div>

        <!-- Correct Answer Display -->
        <div
          v-if="result.answer"
          class="bg-white/80 dark:bg-gray-900/80 p-3 rounded-lg border border-red-100 dark:border-red-900/50 mr-9"
        >
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
            پاسخ صحیح:
          </span>
          <span class="text-sm font-bold text-gray-900 dark:text-gray-100">
            {{ result.answer }}
          </span>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div
      v-if="errorMessage"
      class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-sm"
    >
      <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0" />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      text_question: '',
      options: []
    })
  },
  idVideo: {
    type: [Number, String],
    required: true
  }
})

const api = useApi()

const selectedAnswer = ref(null)
const loading = ref(false)
const result = ref(null)
const errorMessage = ref('')

const selectOption = (id) => {
  selectedAnswer.value = id
  result.value = null
  errorMessage.value = ''
}

const submitAnswer = async () => {
  if (!selectedAnswer.value || loading.value) return

  loading.value = true
  errorMessage.value = ''
  result.value = null

  try {
    const response = await api(
      `box/video/check_answer/${selectedAnswer.value}/${props.idVideo}/${props.data.id}/`
    )
    result.value = response
  } catch (error) {
    console.error('Error checking quiz answer:', error)
    errorMessage.value = error?.data?.detail || 'بررسی پاسخ با خطا مواجه شد. لطفاً مجدداً تلاش کنید.'
  } finally {
    loading.value = false
  }
}

// Reset state when data changes (e.g. next quiz popup in video/audio)
watch(() => props.data?.id, () => {
  selectedAnswer.value = null
  result.value = null
  errorMessage.value = ''
})
</script>
