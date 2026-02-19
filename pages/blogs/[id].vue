<template>
  <Head>
    <Title v-if="blog">{{ blog.title }} | {{ $t("tedline") }}</Title>
  </Head>

  <LayoutHeader :hide-until-scroll="true" />

  <!-- Loading State -->
  <div v-if="loading" class="min-h-screen">
    <USkeleton class="h-96 md:h-[500px] mb-8"></USkeleton>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <USkeleton class="h-12 w-3/4 mb-4 rounded-lg"></USkeleton>
      <USkeleton class="h-6 w-1/2 mb-8 rounded-lg"></USkeleton>
      <USkeleton class="h-64 w-full mb-4 rounded-lg"></USkeleton>
      <USkeleton class="h-64 w-full rounded-lg"></USkeleton>
    </div>
  </div>

  <!-- Blog Content -->
  <div v-else-if="blog" class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative h-80 md:h-96 lg:h-[500px] overflow-hidden">
      <NuxtImg
        :src="blog.image.image"
        :alt="blog.image.title_for_photo.toString()"
        class="w-full h-full object-cover"
        loading="eager"
      />
      
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t dark:backdrop-blur-lg from-white via-white/60 dark:from-black dark:via-black/60 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/40 dark:from-black/40 via-transparent to-white/20 dark:to-black/50"></div>
      <div class="absolute inset-0 bg-gradient-to-l from-white/40 dark:from-black/40 via-transparent to-white/20 dark:to-black/50"></div>
      
      <!-- Content Overlay -->
      <div class="max-w-7xl mx-auto absolute bottom-0 left-0 right-0 p-6 md:p-8 md:pb-15">
        <div class="max-w-4xl mx-auto ">
          <!-- Category Badge -->
          <div class="mb-4">
            <UBadge
            v-for="category in blog.categories"
              color="primary"
              variant="soft"
              size="lg"
              class="text-sm bg-white/80 dark:bg-black/50 backdrop-blur-sm"
            >
              {{ category.title }}
            </UBadge>
          </div>
          
          <!-- Title -->
          <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight mb-4">
            {{ blog.title }}
          </h1>
          
          <!-- Meta Information -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
            <!-- Author -->
            <div class="flex items-center gap-3">
              <UAvatar
                v-if="blog.author.image"
                :src="blog.author.image"
                :alt="blog.author.get_full_name"
                size="sm"
              />
              <div>
                <p class="font-medium text-black dark:text-white">{{ blog.author.get_full_name }}</p>
              </div>
            </div>
            
            <!-- Date -->
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <NuxtTime
                :datetime="blog.updated_at"
                :locale="locale"
                time-zone="Asia/Tehran"
                date-style="medium"
                time-style="short"
              />
            </div>
            
            <!-- Like Button -->
            <UButton
              @click="toggleLike"
              :loading="liking"
              variant="ghost"
              size="sm"
              class="rounded-full"
              :class="{ 'text-red-500 dark:text-red-400': blog.is_liked }"
            >
              <UIcon 
                :name="blog.is_liked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" 
                class="w-4 h-4 mr-1" 
              />
              {{ blog.like_count }}
            </UButton>
            
            <!-- Share Button -->
            <UButton
              @click="shareBlog"
              variant="ghost"
              size="sm"
              class="rounded-full"
            >
              <UIcon name="i-heroicons-share" class="w-4 h-4 mr-2" />
              {{ $t('blog.share') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Blog Content (Quill HTML) -->
      <div v-if="blog.content" class="ql-snow">
        <div v-html="blog.content" class="ql-editor"></div>
      </div>

      <!-- Files Section -->
      <div v-if="blog.file && blog.file.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-document" class="w-5 h-5" />
          {{ $t('blog.files') }}
        </h2>
        <div class="space-y-3">
          <UCard
            v-for="(fileItem, index) in blog.file"
            :key="fileItem.id"
            class="rounded-lg"
            variant="subtle"
          >
            <div class="p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-document-arrow-down" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ $t('learning.fileNumber', { number: index + 1 }) }}
                  </p>
                  <p v-if="fileItem.name" class="text-sm text-gray-600 dark:text-gray-400">
                    {{ fileItem.name }}
                  </p>
                </div>
              </div>
              <UButton
                :loading="loadingDownload.includes(fileItem.id)"
                color="primary"
                variant="solid"
                @click="downloadFile(fileItem)"
              >
                <template #leading>
                  <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
                </template>
                {{ $t('learning.downloadFile') }}
              </UButton>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Author Card -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-stone-900/50 rounded-2xl border border-gray-200 dark:border-stone-800">
          <UAvatar
            v-if="blog.author.image"
            :src="blog.author.image"
            :alt="blog.author.get_full_name"
            size="xl"
            class="ring-2 ring-gray-200 dark:ring-gray-700"
          />
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {{ blog.author.get_full_name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 ">
              {{ $t('blog.author') }}
            </p>
           
          </div>
        </div>
      </div>

      <!-- Related Actions -->
      <div class="mt-8 flex flex-wrap gap-4">
        <UButton
          @click="toggleLike"
          :loading="liking"
          variant="outline"
          size="lg"
          class="rounded-full"
          :class="{ 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400': blog.is_liked }"
        >
          <UIcon 
            :name="blog.is_liked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" 
            class="w-5 h-5 mr-2" 
          />
          {{ blog.is_liked ? $t('blog.unlike') : $t('blog.like') }} ({{ blog.like_count }})
        </UButton>
        <UButton
          @click="shareBlog"
          variant="outline"
          size="lg"
          class="rounded-full"
        >
          <UIcon name="i-heroicons-share" class="w-5 h-5 mr-2" />
          {{ $t('blog.share') }}
        </UButton>
        <UButton
          :to="localePath('/explore?tab=blogs')"
          variant="ghost"
          size="lg"
          class="rounded-full"
        >
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2 rtl:rotate-180" />
          {{ $t('blog.backToBlogs') }}
        </UButton>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('blog.notFound') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ $t('blog.notFoundDesc') }}
      </p>
      <UButton
        :to="localePath('/explore?tab=blogs')"
        variant="solid"
        size="lg"
        class="rounded-full"
      >
        {{ $t('blog.backToBlogs') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  title?: string
  href?: string
}

interface Author {
  username: string
  get_full_name: string
  image?: string
}

interface BlogImage {
  id: number
  image: string
  title_for_photo: number
}

interface BlogFile {
  id: number
  file?: string
  name?: string
  [key: string]: any
}

interface BlogPost {
  id: number
  title: string
  content?: string
  image: BlogImage
  file: BlogFile[]
  created_at: string
  updated_at: string
  categories: Category[]
  author: Author
  like_count: number
  is_liked: boolean
}

// Import Quill CSS for proper styling

import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const { t } = useI18n()

// Page meta
definePageMeta({
  layout: 'dashboard'
})

const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
)

// Route
const route = useRoute()
const blogId = route.params.id as string

// API
const api = useApi(false)
const apiAuth = useApi(true) // For authenticated requests like like/unlike

// Store
const userStore = useUserStore()

// Toast
const toast = useToast()

// State
const liking = ref(false)
const loadingDownload = ref<number[]>([])

// Fetch blog data
const { data: blog, pending: loading, error, refresh: refreshBlog } = await useLazyAsyncData<BlogPost>(
  `blog-${blogId}`,
  () => api(`/blog/${blogId}/`),
  {
    server: true,
  }
)

// Like/Unlike functionality
const toggleLike = async () => {
  if (!blog.value) return
  
  // Check if user is authenticated
  if (!userStore.isAuthenticated) {
    toast.add({
      title: t('blog.loginRequired'),
      description: t('blog.loginRequiredDesc'),
    })
    navigateTo(`/auth/signIn?redirect=${route.fullPath}`)
    return
  }

  try {
    liking.value = true
    const endpoint = blog.value.is_liked ? `/blog/${blogId}/unlike/` : `/blog/${blogId}/like/`
    await apiAuth(endpoint, { method: 'POST' })
    
    // Update local state optimistically
    if (blog.value) {
      blog.value.is_liked = !blog.value.is_liked
      blog.value.like_count += blog.value.is_liked ? 1 : -1
    }
  } catch (error: any) {
    console.error('Like error:', error)
    toast.add({
      title: t('blog.error'),
      description: error?.data?.message || t('blog.likeError'),
    })
    // Refresh to get correct state
    await refreshBlog()
  } finally {
    liking.value = false
  }
}

// Download file functionality
const downloadFile = async (fileItem: BlogFile) => {
  if (!fileItem.id) return

  try {
    loadingDownload.value.push(fileItem.id)
    
    // Try to download from file URL if available
    if (fileItem.file) {
      const link = document.createElement('a')
      link.href = fileItem.file
      link.download = fileItem.name || `file-${fileItem.id}`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Fallback: try API endpoint
      const response = await apiAuth(`/blog/${blogId}/file/${fileItem.id}/download/`, {
        method: 'GET'
      }) as any
      
      if (response.file_data) {
        const a = document.createElement('a')
        a.href = `data:application/octet-stream;base64,${response.file_data}`
        a.download = response.filename || fileItem.name || `file-${fileItem.id}`
        a.click()
      }
    }
  } catch (error: any) {
    console.error('Download error:', error)
    toast.add({
      title: t('blog.error'),
      description: error?.data?.message || t('learning.errorDownloadingFile'),
    })
  } finally {
    const index = loadingDownload.value.indexOf(fileItem.id)
    if (index > -1) {
      loadingDownload.value.splice(index, 1)
    }
  }
}

// Share functionality
const shareBlog = () => {
  if (!blog.value) return
  
  const url = window.location.href

  if (navigator.share) {
    navigator.share({
      title: blog.value.title,
      text: blog.value.title,
      url: url
    }).catch(() => {
      // User cancelled or error occurred
    })
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(url).then(() => {
      toast.add({
        title: t('blog.shareSuccess'),
        description: t('blog.linkCopied'),
      })
    }).catch(() => {
      toast.add({
        title: t('blog.shareError'),
        description: t('blog.shareErrorDesc'),
      })
    })
  }
}

// Initialize user store
onMounted(() => {
  userStore.initialize()
})
</script>

