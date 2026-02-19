<template>
  <div class="mt-5">
    <UTabs
      :dir="currentLocale?.dir"
      variant="link"
      :items="tabs.map(tab => ({ 
        ...tab, 
        label: $t(tab.label) 
      }))"
      class="w-full"
    >
      <!-- Finished Courses -->
      <template #finished="{ item }">
        <div class="grid grid-cols-1 gap-6 mt-8">
          <div 
            v-for="course in dataFinished" 
            :key="course.id + 'finished'"
          >
            <SharedCourseHorizontalCard :progress="false" :course="course" />
          </div>

          <!-- Empty state -->
          <UAlert
            v-if="!loadingFinished && dataFinished.length === 0"
            icon="i-heroicons-information-circle"
            color="blue"
            variant="soft"
            class="my-10"
          >
            <template #title>
              <span class="font-semibold">{{ $t('profile.noCourses') }}</span>
            </template>
            <template #description>
              {{ $t('profile.noFinishedCourses') }}
            </template>
          </UAlert>

          <!-- Loading -->
          <div v-if="loadingFinished" class="flex justify-center my-10">
            <UIcon 
              name="i-heroicons-arrow-path" 
              class="w-8 h-8 text-blue-500 animate-spin" 
            />
          </div>
        </div>
      </template>

      <!-- Ongoing Courses -->
      <template #ongoing="{ item }">
        <div class="space-y-6">
          <div 
            v-for="course in data" 
            :key="course.id + 'ongoing'"
            class="my-10"
          >
            <SharedCourseHorizontalCard :progress="false" :course="course" />
          </div>

          <!-- Empty state -->
          <UAlert
            v-if="!loadingUnfinished && data.length === 0"
            icon="i-heroicons-information-circle"
            color="blue"
            variant="soft"
            class="my-10"
          >
            <template #title>
              <span class="font-semibold">{{ $t('profile.noCourses') }}</span>
            </template>
            <template #description>
              {{ $t('profile.noOngoingCourses') }}
            </template>
          </UAlert>

          <!-- Loading -->
          <div v-if="loadingUnfinished" class="flex justify-center my-10">
            <UIcon 
              name="i-heroicons-arrow-path" 
              class="w-8 h-8 text-blue-500 animate-spin" 
            />
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const { locale, locales } = useI18n()
const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
)
const props = defineProps({
  username: { type: String, required: true }
})

const data = ref([])
const dataFinished = ref([])
const loadingUnfinished = ref(true)
const loadingFinished = ref(true)

const tabs = [
  {
    key: 'finished',
    label: 'profile.finishedCourses',
    icon: 'i-heroicons-check-circle',
    slot: 'finished' 
  },
  {
    key: 'ongoing',
    label: 'profile.ongoingCourses',
    icon: 'i-heroicons-list-bullet',
    slot: 'ongoing' 
  }
]

const api = useApi(false)

const getData = async () => {
  try {
    const res = await api(`/course/TeacherUnfinishedCourse/${props.username}/`)
    data.value = res
  } finally {
    loadingUnfinished.value = false
  }
}

const getDataFinished = async () => {
  try {
    const res = await api(`/course/TeacherFinishedCourse/${props.username}/`)
    dataFinished.value = res
  } finally {
    loadingFinished.value = false
  }
}

onMounted(() => {
  getData()
  getDataFinished()
})
</script>
