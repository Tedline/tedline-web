<template>
  <div class="container mx-auto px-4">
    <!-- Image Section -->
    <div v-if="question.image_url" class="p-8 border rounded-xl mx-5 bg-gray-50 dark:bg-gray-800 mt-8 rtl">
      <p class="text-sm mb-5 text-gray-700 dark:text-gray-300">
        تصویر پیوست شده
      </p>
      <img
        class="mb-2 w-full rounded-xl object-cover"
        :src="question.image_url"
        :alt="question.title"
      />
    </div>

    <!-- Question Card -->
    <UCard class="mt-8" dir="rtl">
      <div class="p-5">
        <!-- Question Header -->
        <div class="flex items-start gap-4 mb-6">
          <UAvatar size="xl" color="primary" variant="soft">
            <UIcon name="i-heroicons-question-mark-circle" class="w-6 h-6" />
          </UAvatar>
          <div v-if="!isFillInTheBlank" class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ question.text || question.title }}
          </div>
          <div v-else class="flex flex-wrap items-center gap-2 text-lg leading-10 text-gray-900 dark:text-gray-100">
            <template v-for="(segment, index) in questionSegments" :key="index">
              <span v-if="segment.type === 'text'">{{ segment.value }}</span>
              <input
                v-else
                v-model="blankValues[segment.position]"
                :aria-label="`پاسخ جای خالی ${segment.position + 1}`"
                class="min-w-32 max-w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                type="text"
              />
            </template>
          </div>
        </div>

        <!-- Options -->
        <div v-if="!isFillInTheBlank" class="mt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(item, index) in question.options"
              :key="item.id"
              @click="selectedId(item.id)"
              :class="[
                'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                selectedOption === item.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    selectedOption === item.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                >
                  <div
                    v-if="selectedOption === item.id"
                    class="w-2 h-2 rounded-full bg-white"
                  ></div>
                </div>
                <span class="text-sm font-medium">{{ item.text || item.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 mt-8">
          <UButton
            @click="plusCurrentQuestion"
            :loading="loading"
            color="primary"
            size="lg"
            class="px-10"
          >
            ثبت پاسخ
          </UButton>
          
          <UButton
            @click="minusCurrentQuestion"
            color="primary"
            variant="outline"
            size="lg"
            class="px-6"
          >
            سوال قبل
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  quizReportId: {
    type: [Number, String],
    required: true
  },
  savedOptionId: {
    type: [Number, String],
    default: null
  },
  savedBlankAnswers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['currentQuestionPlusOne', 'currentQuestionMinusOne', 'selectedId'])

const selectedOptionId = ref(null)
const selectedOption = ref(null)
const loading = ref(false)
const blankValues = reactive({})

const api = useApi()

const isFillInTheBlank = computed(() => props.question.question_type === 'FLB')
const questionSegments = computed(() => {
  const parts = String(props.question.text || '').split('[[blank]]')
  const segments = []
  parts.forEach((value, index) => {
    if (value) segments.push({ type: 'text', value })
    if (index < parts.length - 1) {
      const position = props.question.blanks?.[index]?.position ?? index
      segments.push({ type: 'blank', position })
    }
  })
  return segments
})

const restoreAnswers = () => {
  selectedOptionId.value = props.savedOptionId ?? null
  selectedOption.value = props.savedOptionId ?? null
  for (const blank of props.question.blanks || []) blankValues[blank.position] = ''
  for (const answer of props.savedBlankAnswers) blankValues[answer.position] = answer.text || ''
}

const sendUserAnswer = async () => {
  try {
    const response = await api(`quiz/answer/${props.quizReportId}/${props.question.id}/${selectedOptionId.value}/`, {
      method: 'POST'
    })
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

const sendBlankAnswer = async () => {
  try {
    const answers = (props.question.blanks || []).map(({ position }) => ({
      position,
      text: blankValues[position] || ''
    }))
    const response = await api(`quiz/blank-answer/${props.quizReportId}/${props.question.id}/`, {
      method: 'PUT',
      body: { answers }
    })
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

const clearMcqAnswer = () => api(`quiz/answer/${props.quizReportId}/${props.question.id}/`, {
  method: 'DELETE'
})

const plusCurrentQuestion = async () => {
  loading.value = true
  try {
    let response

    if (isFillInTheBlank.value) {
      response = await sendBlankAnswer()
    } else if (selectedOption.value !== null) {
      response = await sendUserAnswer()
    } else {
      response = await clearMcqAnswer()
    }
    
    if (response) {
      console.log("Answer submitted successfully")
      loading.value = false
      emit("currentQuestionPlusOne")
    }
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}

const minusCurrentQuestion = () => {
  emit("currentQuestionMinusOne")
}

const selectedId = (id) => {
  selectedOption.value = id
  selectedOptionId.value = id
  emit("selectedId", id)
}

// Watch for changes in selectedOptionId
watch(selectedOptionId, (newVal) => {
  selectedOption.value = newVal || null
})

watch(() => [props.question.id, props.savedOptionId, props.savedBlankAnswers], restoreAnswers, { immediate: true, deep: true })

defineExpose({
  isFillInTheBlank,
  selectedOption,
  sendUserAnswer,
  sendBlankAnswer,
  clearMcqAnswer,
  saveAnswer: async () => isFillInTheBlank.value
    ? sendBlankAnswer()
    : selectedOption.value !== null
      ? sendUserAnswer()
      : clearMcqAnswer()
})
</script>
