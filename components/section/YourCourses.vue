<template>
  <div class=" mx-auto grid max-w-7xl px-6 mt-6 mb-20">
    <div v-if="showTitle" class="flex justify-between items-center mb-4">
      <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">
        {{ title || $t('yourCourses.title') }}
      </h3>
    </div>

    <UTabs
      :dir="currentLocale?.dir"
      :variant="variant === 'flat' ? 'link' : 'link'"
      :items="tabs.map(tab => ({ 
        ...tab, 
        label: $t(tab.label) 
      }))"
      class="w-full"
    >
      <!-- Learning / Ongoing tab -->
      <template #learning="{ item }">
        <div class="mt-6 space-y-4">
          <!-- Loading skeleton -->
          <div v-if="loadingUnfinished" class="space-y-4 grid lg:grid-cols-2 gap-4">
            <USkeleton v-for="n in 3" :key="n" class="h-44 w-full rounded-3xl" />
          </div>

          <!-- Course list -->
          <div v-else-if="data.length > 0" class="space-y-6">
            <div class="grid lg:grid-cols-2 gap-4">
              <div v-for="course in data" :key="course.id + 'unfinished'">
                <SharedCourseHorizontalCard :course="course" :progress="progress" />
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalUnfinished > 0" class="flex justify-center mt-6">
              <UPagination
                v-model:page="pageUnfinished"
                class="ltr"
                :items-per-page="pageSize"
                :total="totalUnfinished"
                size="sm"
              />
            </div>
          </div>

          <!-- Empty state -->
          <UAlert
            v-else
            icon="i-heroicons-information-circle"
            color="primary"
            variant="soft"
            class="my-8 rounded-2xl"
          >
            <template #title>
              <span class="font-semibold">{{ $t('yourCourses.noCourses') }}</span>
            </template>
            <template #description>
              {{ $t('yourCourses.noLearningCourses') }}
            </template>
          </UAlert>
        </div>
      </template>

      <!-- Completed / Finished tab -->
      <template #completed="{ item }">
        <div class="mt-6 space-y-4">
          <!-- Loading skeleton -->
          <div v-if="loadingFinished" class="grid lg:grid-cols-2 gap-4">
            <USkeleton v-for="n in 3" :key="n" class="h-44 w-full rounded-3xl" />
          </div>

          <!-- Course list -->
          <div v-else-if="dataFinished.length > 0" class="space-y-6">
            <div class="grid lg:grid-cols-2 gap-4">
              <div v-for="course in dataFinished" :key="course.id + 'finished'">
                <SharedCourseHorizontalCard :course="course" :progress="progress" />
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalFinished > 0" class="flex justify-center mt-6">
              <UPagination
                v-model:page="pageFinished"
                class="ltr"
                :items-per-page="pageSize"
                :total="totalFinished"
                size="sm"
              />
            </div>
          </div>

          <!-- Empty state -->
          <UAlert
            v-else
            icon="i-heroicons-information-circle"
            color="primary"
            variant="soft"
            class="my-8 rounded-2xl"
          >
            <template #title>
              <span class="font-semibold">{{ $t('yourCourses.noCourses') }}</span>
            </template>
            <template #description>
              {{ $t('yourCourses.noCompletedCourses') }}
            </template>
          </UAlert>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { CourseListItem } from '~/types/course'

interface Props {
  username?: string
  progress?: boolean | number
  variant?: string
  showTitle?: boolean
  title?: string
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  username: '',
  progress: true,
  variant: 'default',
  showTitle: true,
  title: undefined,
  pageSize: 10
})

const { locale, locales } = useI18n()
const currentLocale = computed(() =>
  locales.value.find((l: any) => l.code === locale.value)
)

const userStore = useUserStore()
const activeUsername = computed(() => props.username || userStore.username || '')

const data = ref<CourseListItem[]>([])
const dataFinished = ref<CourseListItem[]>([])
const loadingUnfinished = ref(true)
const loadingFinished = ref(true)

const pageUnfinished = ref(1)
const pageFinished = ref(1)
const totalUnfinished = ref(0)
const totalFinished = ref(0)
const totalPagesUnfinished = ref(1)
const totalPagesFinished = ref(1)

const tabs = [
  {
    key: 'learning',
    label: 'yourCourses.learning',
    icon: 'i-heroicons-list-bullet',
    slot: 'learning'
  },
  {
    key: 'completed',
    label: 'yourCourses.completed',
    icon: 'i-heroicons-check-circle',
    slot: 'completed'
  }
]

const api = useApi(false, '/api/v2/')

const getUnfinishedCourses = async () => {
  if (!activeUsername.value) {
    loadingUnfinished.value = false
    return
  }
  loadingUnfinished.value = true
  try {
    const res: any = await api(`/course/UnfinishedCourse/${activeUsername.value}/?page=${pageUnfinished.value}&page_size=${props.pageSize}`)
    if (res && res.results !== undefined) {
      data.value = res.results || []
      totalUnfinished.value = res.count ?? (res.total_pages ? res.total_pages * props.pageSize : (res.results?.length || 0))
      totalPagesUnfinished.value = res.total_pages ?? Math.ceil(totalUnfinished.value / props.pageSize) ?? 1
    } else if (Array.isArray(res)) {
      data.value = res
      totalUnfinished.value = res.length
      totalPagesUnfinished.value = Math.ceil(res.length / props.pageSize) || 1
    } else {
      data.value = []
      totalUnfinished.value = 0
      totalPagesUnfinished.value = 1
    }
  } catch (err) {
    console.error('Error fetching unfinished courses:', err)
    data.value = []
    totalUnfinished.value = 0
    totalPagesUnfinished.value = 1
  } finally {
    loadingUnfinished.value = false
  }
}

const getFinishedCourses = async () => {
  if (!activeUsername.value) {
    loadingFinished.value = false
    return
  }
  loadingFinished.value = true
  try {
    const res: any = await api(`/course/FinishedCourse/${activeUsername.value}/?page=${pageFinished.value}&page_size=${props.pageSize}`)
    if (res && res.results !== undefined) {
      dataFinished.value = res.results || []
      totalFinished.value = res.count ?? (res.total_pages ? res.total_pages * props.pageSize : (res.results?.length || 0))
      totalPagesFinished.value = res.total_pages ?? Math.ceil(totalFinished.value / props.pageSize) ?? 1
    } else if (Array.isArray(res)) {
      dataFinished.value = res
      totalFinished.value = res.length
      totalPagesFinished.value = Math.ceil(res.length / props.pageSize) || 1
    } else {
      dataFinished.value = []
      totalFinished.value = 0
      totalPagesFinished.value = 1
    }
  } catch (err) {
    console.error('Error fetching finished courses:', err)
    dataFinished.value = []
    totalFinished.value = 0
    totalPagesFinished.value = 1
  } finally {
    loadingFinished.value = false
  }
}

watch(pageUnfinished, () => {
  getUnfinishedCourses()
})

watch(pageFinished, () => {
  getFinishedCourses()
})

watch(() => activeUsername.value, (newVal) => {
  if (newVal) {
    pageUnfinished.value = 1
    pageFinished.value = 1
    getUnfinishedCourses()
    getFinishedCourses()
  }
})

onMounted(() => {
  if (activeUsername.value) {
    getUnfinishedCourses()
    getFinishedCourses()
  } else {
    loadingUnfinished.value = false
    loadingFinished.value = false
  }
})
</script>
