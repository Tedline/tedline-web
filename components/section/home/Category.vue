<script setup lang="ts">
import type { Category } from "~/types/course";

const api = useApi(false)

const { data : categories, pending:loading, error } = await useLazyAsyncData<Category[]>('getCategoryData', () => 
  api('/course/CourseCategoryPopular/').then((res: any) => res),
)

// Generate random colors for category badges
const getCategoryColor = (index: number) => {
  const colors = [
    'from-blue-500/20 to-cyan-500/20',
    'from-purple-500/20 to-pink-500/20',
    'from-emerald-500/20 to-teal-500/20',
    'from-orange-500/20 to-amber-500/20',
    'from-indigo-500/20 to-blue-500/20',
    'from-rose-500/20 to-red-500/20',
    'from-violet-500/20 to-purple-500/20',
  ]
  return colors[index % colors.length]
}
</script>

<template>
  <div class="relative isolate my-16 overflow-hidden">
    <!-- Background with enhanced gradient -->
    <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 dark:from-indigo-900/80 dark:via-blue-900/70 dark:to-indigo-950/80"></div>
    
    <!-- Animated background pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>
    
    <!-- Glow effect -->
    <div class="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-xl dark:opacity-10"></div>
    
    <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        <!-- Title Section -->
        <div class="md:col-span-1 text-right space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-yellow-300" />
            <span class="text-xs font-medium text-white/90">محبوب ترین</span>
          </div>
          <h2 class="font-extrabold text-2xl md:text-3xl text-white leading-tight">
            پر طرفدار ترین<br />
            <span class="text-blue-100 dark:text-blue-200">دسته بندی ها</span>
          </h2>
          <p class="text-sm text-white/80 font-light leading-relaxed">
            دسته بندی های محبوب و پرطرفدار را کاوش کنید
          </p>
        </div>
        
        <!-- Categories Carousel -->
        <div class="md:col-span-3">
          <UCarousel
            v-if="!loading && categories"
            :items="categories"
            class="px-2"
            :ui="{
              item: 'basis-3/4 sm:basis-2/4 md:basis-1/5 lg:basis-1/6',
              container: 'gap-3'
            }"
          >
            <template #default="{ item, index }">
              <NuxtLinkLocale
                :to="`/explore/?category=${item!.id}`"
                class="group relative flex flex-col items-center gap-3 px-4 py-4 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-blue-400/0 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/30 dark:hover:border-white/0  hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 min-h-[120px]"
              >
                <!-- Icon Container with gradient -->
                <div 
                  :class="`absolute inset-0 rounded-2xl bg-gradient-to-br ${getCategoryColor(index!)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`"
                ></div>
                
                <!-- Icon -->
                <div class="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 dark:bg-white/10 group-hover:bg-white/30 dark:group-hover:bg-white/20 backdrop-blur-sm border border-white/30 dark:border-white/20 transition-all duration-300  group-hover:rotate-3">
                  <UIcon 
                    name="i-heroicons-folder-open" 
                    class="w-6 h-6 text-white group-hover:text-blue-100 transition-colors duration-300" 
                  />
                </div>
                
                <!-- Category Title -->
                <p class="relative line-clamp-1 text-sm font-semibold text-white text-center leading-tight group-hover:text-blue-50 transition-colors duration-300">
                  {{ item!.title }}
                </p>
                
                <!-- Arrow indicator -->
                <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/20 dark:bg-white/10 group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-all duration-300 ">
                  <UIcon 
                    name="i-heroicons-arrow-left" 
                    class="w-3.5 h-3.5 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" 
                  />
                </div>
                
                <!-- Shine effect on hover -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300"></div>
              </NuxtLinkLocale>
            </template>
          </UCarousel>

          <!-- Enhanced Loader -->
          <div v-else class="flex justify-center items-center py-12">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-white/40 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
}
</style>
