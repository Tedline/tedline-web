<template>
  <section id="resources" class="lg:px-8 scroll-mt-14 sm:scroll-mt-32 sm:py-5" v-if="pending == false">
    <div class="flex justify-between items-center mx-10">
      <h3 class="font-semibold flex text-gray-900 dark:text-gray-100">
        {{ activeTab.name }}
        <button class="mx-5 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          بیشتر
        </button>
      </h3>
      <div>
        <div class="sm:hidden">
          <select
            class="block w-full rounded-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            v-model="activeTabName">
            <option v-for="tab in tabs" :key="tab.name" :value="tab.name">
              {{ tab.name }}
            </option>
          </select>
        </div>
        <div class="hidden sm:block">
          <nav class="flex space-x-3" aria-label="Tabs">
            <a
              v-for="tab in tabs"
              :key="tab.name"
              :href="tab.href"
              :class="[
                tab.name === activeTabName
                  ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white mx-2'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white',
                'rounded-md px-3 py-2 text-sm font-medium',
              ]"
              @click.prevent="activeTabName = tab.name"
            >
              {{ tab.name }}
            </a>
          </nav>
        </div>
      </div>
    </div>

    <div class="px-4 sm:px-10">
      <Swiper
        :modules="[Navigation, Pagination]"
        :spaceBetween="20"
        :slides-per-view="1"
        :breakpoints="{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
          1500: { slidesPerView: 5 },
        }"
        navigation
        :pagination="{ clickable: true }"
        class="w-full"
        dir="rtl"
      >
        <SwiperSlide
          v-for="item in data"
          :key="item.id"
          class="p-4"
        >
          <SharedCourseFirstCard :course="item" />
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useAsyncData } from 'nuxt/app';
import axios from 'axios';
import { useRuntimeConfig, useRoute } from '#app';


// Access runtime config to get the baseURL from environment variables
const config = useRuntimeConfig();
const route = useRoute();

// Use useAsyncData for server-side data fetching
const { data, pending, error } = await useAsyncData('getCourseData', async () => {
  const response = await axios.get(`https://tedline.org/api/course/HomeCourses/?ordering=?`);
  return response.data.results;
});

const tabs = [
  { name: 'پر فروش ترین', href: '/', current: true },
  { name: 'محبوب ترین', href: '/', current: false },
  { name: 'دارای تخفیف', href: '/', current: false }
]

const activeTabName = ref(tabs.find(t => t.current)?.name || tabs[0].name)

const activeTab = computed(() => tabs.find(t => t.name === activeTabName.value) || tabs[0])



</script>

<style scoped>
/* Optional: Customize RTL or Swiper styles */
</style>
