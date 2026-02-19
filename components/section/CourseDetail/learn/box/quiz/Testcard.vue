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
        <div class="flex items-center gap-4 mb-6">
          <UAvatar size="xl" color="primary" variant="soft">
            <UIcon name="i-heroicons-question-mark-circle" class="w-6 h-6" />
          </UAvatar>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ question.title }}
          </h3>
        </div>

        <!-- Options -->
        <div class="mt-6">
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
                <span class="text-sm font-medium">{{ item.title }}</span>
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
  }
})

const emit = defineEmits(['currentQuestionPlusOne', 'currentQuestionMinusOne', 'selectedId'])

const selectedOptionId = ref(null)
const selectedOption = ref(null)
const loading = ref(false)

const api = useApi()

const sendUserAnswer = async () => {
  try {
    const response = await api(`quiz/answer/${props.question.id}/${selectedOptionId.value}/`, {
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
    const response = await api(`quiz/answer/${props.question.id}/`, {
      method: 'POST'
    })
    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

const plusCurrentQuestion = async () => {
  loading.value = true
  try {
    let response

    if (selectedOption.value !== null) {
      response = await sendUserAnswer()
    } else {
      response = await sendBlankAnswer()
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
</script>

