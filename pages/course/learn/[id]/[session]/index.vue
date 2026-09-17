<template>
  <div class="container mx-auto px-4">
    <!-- Loading State -->
    <div v-if="loading" class="mt-20 container mx-auto">
        <USkeleton v-for="n in 10" class=" h-20  my-5"></USkeleton>
    </div>

    <!-- Main Content -->
    <div v-if="data">
      <!-- Session Header -->
      <div class="flex items-center gap-4 px-3 mb-6">
        <UAvatar size="xl" color="primary" variant="soft">
          <UIcon name="i-heroicons-information-circle" class="w-6 h-6" />
        </UAvatar>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ data.title }}
          </h1>
        </div>
      </div>

      <UAlert
        color="neutral"
        v-if="data.description"
        variant="subtle"
        :title="$t('learning.description')"
        :description="data.description"
        icon="i-lucide-terminal"
        class="my-10"
        />

      <!-- Alerts -->
      <div v-for="item in data.alerts" :key="item.id" class="mx-2 my-10">
        <UAlert
          :color="item.status === 'w' ? 'warning' : 'danger'"
          variant="soft"
          :title="item.title"
          :description="item.body"
          icon="i-heroicons-information-circle"
        />
      </div>

      <!-- Boxes -->
     <!-- Boxes -->
<div class="space-y-4">
  <UAccordion
    :items="accordionItems"
    type="multiple"
    :default-value="defaultActiveValues"
  >
    <template #body="{ item }">
      <div class="space-y-2 p-4">
        <div v-for="box in item.boxes" :key="box.id">
          <SharedCourseBox
            v-if="box.file"
            :read="box.is_finished"
            :title="box.title || $t('learning.file')"
            :disable="box.is_locked && !data.is_signed"
            color="indigo"
            icon-class="from-indigo-400 to-indigo-600 dark:from-indigo-600/70 dark:to-indigo-700/70"
            icon="i-heroicons-document"
            :to="`/course/learn/${$route.params.id}/${$route.params.session}/${box.file}/files`"
          />

          <SharedCourseBox
            v-if="box.quiz"
            :read="box.is_finished"
            :title="box.title || $t('learning.quiz')"
            :disable="!data.is_signed"
            icon-class="from-orange-400 to-orange-600 dark:from-orange-600/70 dark:to-orange-700/70"
            icon="i-heroicons-question-mark-circle"
            :to="`/course/learn/${$route.params.id}/${$route.params.session}/${box.id}/quiz/`"
          />

          <SharedCourseBox
            v-if="box.video"
            :read="box.is_finished"
            :title="box.title || $t('learning.video')"
            :disable="box.is_locked && !data.is_signed"
            icon-class="from-blue-400 to-blue-600 dark:from-blue-600/70 dark:to-blue-700/70"
            icon="i-heroicons-video-camera"
            :href="`https://player.tedline.org/#/player/${$route.params.id}/${$route.params.session}/${box.id}/${token || 'null'}/${username || 'null'}`"
          />

          <SharedCourseBox
            v-if="box.audio"
            :read="box.is_finished"
            :title="box.title || $t('learning.audio')"
            :disable="box.is_locked && !data.is_signed"
            icon-class="from-green-400 to-green-600 dark:from-green-600/70 dark:to-green-700/70"
            icon="i-heroicons-speaker-wave"
            :to="`/course/learn/${$route.params.id}/${$route.params.session}/${box.id}/audio`"
          />
        </div>
      </div>
    </template>
  </UAccordion>
</div>

    </div>
  </div>
</template>




<script setup>

definePageMeta({
  layout: "course-dashboard",
  middleware: "auth",
})


const accordionItems = computed(() => {
  if (!data.value?.boxes) return []
  return data.value.boxes.map((section, index) => ({
    label: section.title,    // Accordion expects `label`
    value: String(index),    // unique id for each item
    boxes: section.box       // your custom data for inside panel
  }))
})

const defaultActiveValues = computed(() => accordionItems.value.map(i => i.value))


const route = useRoute()
const userStore = useUserStore()
const api = useApi()

const data = ref(null)
const loading = ref(true)

const token = ref(null)
const videoUsername = ref(null)
const username = computed(() => videoUsername.value || userStore.username)

const fetchVideoToken = async () => {
  if (!userStore.accessToken) {
    token.value = null
    return
  }

  const hasAccessibleVideo = data.value?.boxes?.some(section =>
    section.box?.some(box => box.video && (!box.is_locked || data.value?.is_signed))
  )

  if (hasAccessibleVideo) {
    try {
      const response = await api('box/video/generate-token/')
      if (response?.token) {
        token.value = response.token
      }
      if (response?.username) {
        videoUsername.value = response.username
      }
    } catch (error) {
      console.error('Error fetching video token:', error)
      token.value = null
    }
  }
}

const getData = async () => {
  try {
    const response = await api(`course/RetrieveSession/${route.params.session}/`)
    loading.value = false
    data.value = response
    await fetchVideoToken()
  } catch (error) {
    console.error('Error fetching session:', error)
    loading.value = false
  }
}

onMounted(async () => {
  userStore.initialize()
  await getData()
})
</script>