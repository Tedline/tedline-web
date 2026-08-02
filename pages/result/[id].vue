<template>
  <div dir="rtl" class="mx-auto max-w-5xl px-4 py-8">
    <div v-if="loading" class="flex min-h-72 items-center justify-center">
      <UButton loading variant="ghost">در حال دریافت نتیجه</UButton>
    </div>

    <UCard v-else-if="errorMessage">
      <div class="text-center text-red-600">{{ errorMessage }}</div>
    </UCard>

    <template v-else>
      <UCard>
        <div class="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p class="text-sm text-gray-500">نتیجه آزمون</p>
            <h1 class="mt-1 text-2xl font-bold">{{ report.quiz?.title }}</h1>
          </div>
          <div class="rounded-2xl bg-blue-50 px-8 py-4 text-center dark:bg-blue-950/40">
            <div class="text-sm text-gray-500">نمره نهایی</div>
            <div class="text-3xl font-black text-blue-600">{{ formatScore(report.final_score) }}</div>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-green-50 p-4 text-green-700">صحیح: {{ report.correct_answers }}</div>
          <div class="rounded-xl bg-red-50 p-4 text-red-700">غلط: {{ report.incorrect_answers }}</div>
          <div class="rounded-xl bg-gray-100 p-4 text-gray-700">بدون پاسخ: {{ report.unanswered_questions }}</div>
        </div>
      </UCard>

      <div class="mt-6 space-y-4">
        <UCard v-for="(answer, index) in report.user_answer" :key="answer.question.id">
          <div class="flex gap-3">
            <span class="font-bold text-blue-600">{{ index + 1 }}.</span>
            <div class="flex-1">
              <p class="font-medium">{{ answer.question.text }}</p>

              <div v-if="answer.question.question_type === 'FLB'" class="mt-4 space-y-3">
                <div v-for="blank in answer.blanks" :key="blank.id" class="rounded-lg border p-3">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span>جای خالی {{ blank.position + 1 }}: {{ blank.user_answer || 'بدون پاسخ' }}</span>
                    <span :class="blank.is_correct ? 'text-green-600' : 'text-red-600'">
                      {{ blank.is_correct ? 'صحیح' : 'غلط' }}
                    </span>
                  </div>
                  <p v-if="!blank.is_correct" class="mt-2 text-sm text-gray-500">
                    پاسخ‌های قابل قبول: {{ blank.acceptable_answers.map(item => item.text).join('، ') }}
                  </p>
                </div>
              </div>

              <div v-else class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div
                  v-for="option in answer.question.options"
                  :key="option.id"
                  :class="optionClass(option.id, answer)"
                  class="rounded-lg border p-3"
                >
                  {{ option.text || option.title }}
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const api = useApi()
const report = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const formatScore = value => Number(value || 0).toLocaleString('fa-IR', { maximumFractionDigits: 2 })
const optionClass = (optionId, answer) => {
  if (optionId === answer.correct_answer) return 'border-green-500 bg-green-50 text-green-700'
  if (optionId === answer.user_answer) return 'border-red-500 bg-red-50 text-red-700'
  return 'border-gray-200 dark:border-gray-700'
}

onMounted(async () => {
  try {
    report.value = await api(`quiz/retrieve-quiz-report/${route.params.id}/`)
  } catch (error) {
    errorMessage.value = error?.data?.detail || 'دریافت نتیجه آزمون ناموفق بود.'
  } finally {
    loading.value = false
  }
})
</script>
