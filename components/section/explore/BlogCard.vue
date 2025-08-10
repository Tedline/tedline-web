<template>
  <UCard
    class="group h-full hover:shadow-lg transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-700 overflow-hidden"
  >
    <!-- Blog Image -->
    <div class="relative h-48 rounded-t-lg overflow-hidden">
      <img
        :src="blog.imageUrl"
        :alt="blog.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
    
    <!-- Blog Content -->
    <div class="p-4">
      <!-- Category and Date -->
      <div class="flex items-center justify-between mb-3">
        <UBadge
          color="primary"
          variant="soft"
          size="sm"
          class="text-xs"
        >
          {{ blog.category.title }}
        </UBadge>
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ blog.date }}</span>
      </div>
      
      <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {{ blog.title }}
      </h3>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
        {{ blog.description }}
      </p>
      
      <!-- Author -->
      <div class="flex items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <UAvatar
          v-if="blog.author.imageUrl"
          :src="blog.author.imageUrl"
          :alt="blog.author.name"
          size="sm"
          class="mr-3"
        />
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ blog.author.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ blog.author.role }}</p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Category {
  title: string
  href: string
}

interface Author {
  name: string
  role: string
  imageUrl?: string
}

interface BlogPost {
  id: number
  title: string
  description: string
  imageUrl: string
  date: string
  datetime: string
  category: Category
  author: Author
}

interface Props {
  blog: BlogPost
}

const props = defineProps<Props>()
</script>