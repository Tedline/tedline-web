<template>
  <div class="container mx-auto px-4">
    <!-- Header Section -->
    <UCard v-if="data" class="mb-5 mt-3" variant="subtle">
      <div class="flex items-center justify-between ">
        <div class="flex items-center gap-4">
          <UAvatar size="2xl" color="yellow" class="rounded-lg" variant="soft">
            <UIcon name="i-heroicons-document" class="w-6 h-6" />
          </UAvatar>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $t('learning.file') }}</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ data.title }}</p>
          </div>
        </div>
        
        <UButton
          :to="localePath(`/course/learn/${$route.params.id}/${$route.params.session}/`)"
          icon="i-heroicons-arrow-right"
          color="neutral"
          variant="outline"
          size="lg"
        />
      </div>
    </UCard>

    <!-- Files List -->
    <div v-if="data" class="space-y-3">
      <UCard
        v-for="(item, index) in data.sub_file"
        :key="item.id"
        class=" rounded-lg"
        variant="subtle"
      >
        <template #header>
          <h3 class="font-bold text-gray-900 dark:text-gray-100">
            {{ $t('learning.fileNumber', { number: index + 1 }) }}
          </h3>
        </template>
        
        <div class="p-4">
          <UButton
            :loading="loadingDownload.includes(item.id)"
            color="primary"
            variant="solid"
            size="lg"
            class="font-bold"
            @click="downloadFile(item.id)"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
            </template>
            {{ $t('learning.downloadFile') }}
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="mt-10 px-6 container mx-auto">
        <USkeleton  class=" h-20 my-5"></USkeleton>
        <USkeleton  class=" h-30 my-5"></USkeleton>
    </div>
  </div>
</template>
<script setup>
import { useLocalePath } from '#i18n'

definePageMeta({
  layout: "course-dashboard",
})

const localePath = useLocalePath()
const route = useRoute()
const userStore = useUserStore()
const api = useApi()

const data = ref(null)
const loading = ref(true)
const loadingDownload = ref([])

const getData = async () => {
  try {
    loading.value = true
    const response = await api(`box/files/collections/${route.params.box}/`)
    data.value = response
    loading.value = false
  } catch (error) {
    console.error($t('learning.errorFetchingFiles'), error)
    loading.value = false
  }
}

const downloadFile = async (id) => {
  try {
    loadingDownload.value.push(id)
    const response = await api(`box/files/download/${id}/`)
    
    // Remove from loading array
    const index = loadingDownload.value.indexOf(id)
    if (index > -1) {
      loadingDownload.value.splice(index, 1)
    }

    // Trigger file download
    const a = document.createElement('a')
    a.href = `data:application/octet-stream;base64,${response.file_data}`
    a.download = response.filename
    a.click()
  } catch (error) {
    console.error($t('learning.errorDownloadingFile'), error)
    // Remove from loading array on error
    const index = loadingDownload.value.indexOf(id)
    if (index > -1) {
      loadingDownload.value.splice(index, 1)
    }
  }
}

onMounted(async () => {
  await userStore.initialize()
  await getData()
})
</script>