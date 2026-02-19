<template>
  <NuxtLinkLocale
    :to="`/blogs/${blog.id}`"
    class="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-white border border-gray-100 transition-all duration-300 hover:scale-[0.99] hover:border-gray-200 dark:bg-stone-900/50 dark:border-stone-900 dark:hover:bg-gray-900/60 dark:hover:border-gray-900"
  >
    <!-- Blog Image -->
    <div class="relative aspect-[5/3] overflow-hidden">
      <NuxtImg
        :src="blog.image.image"
        :alt="blog.image.title_for_photo.toString()"
        preset="thumbnail"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
      />
      <!-- Category Badge Overlay -->
      <div class="absolute top-3 start-3">
        <UBadge
        v-for="category in blog.categories"
          color="primary"
          variant="soft"
          size="sm"
          class="text-xs bg-white/80 dark:bg-black/50 backdrop-blur-sm"
        >
          {{ category.title }}
        </UBadge>
      </div>
      <!-- Date Badge -->
      
    </div>
    
    <!-- Blog Content -->
    <div class="relative flex flex-1 flex-col justify-between p-4">
      <!-- Title -->
      <div class="mb-2">
        <h3 class="line-clamp-2 text-sm font-semibold leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ blog.title }}
        </h3>
        <NuxtTime
        class="text-[10px] text-gray-500"
                :datetime="blog.updated_at"
                :locale="locale"
                time-zone="Asia/Tehran"
                date-style="medium"
                time-style="short"
              />
      </div>

      
      <!-- Author -->
      <div class="flex items-center pt-3 border-t border-gray-100 dark:border-gray-800">
        <UAvatar
          v-if="blog.author.image"
          :src="blog.author.image"
          :alt="blog.author.get_full_name"
          size="sm"
          class="me-3"
        />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-900 dark:text-white truncate">{{ blog.author.get_full_name }}</p>
        </div>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
interface Category {
  title: string
  href: string
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


interface BlogPost {
  id: number
  title: string
  description: string
  image: BlogImage
  created_at: string
  updated_at: string
  categories: Category[]
  author: Author
}

interface Props {
  blog: BlogPost
}

const props = defineProps<Props>()
</script>