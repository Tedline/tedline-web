<template>
  <section id="resources" class=" scroll-mt-14 sm:scroll-mt-32 sm:py-5" v-if="pending == false">
    <div class="flex justify-between items-center mx-10">
      <h3 class="font-semibold flex text-gray-900 dark:text-gray-100">   
        {{ $t('coursesList.bestSeller') }}  
      </h3>
      <div>
      <button class="mx-5 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
       {{ $t('more') }}
        <component
          :is="$i18n.locale === 'fa' ? ArrowLeftIcon : ArrowRightIcon "
          class="h-3 w-3 mx-1"
        />
          
        </button>
      </div>
    </div>

    <div class="px-4 sm:px-10">
      <UCarousel
        :items="data"
        loop
        arrows
        :ui="{ item: 'basis-1/4' ,}"
        :autoplay="{ delay: 4000 }"
        class="w-full ltr"
        
      >
        <template #default="{ item }">
          <div class="p-4" v-if="item">
            <SharedCourseSecondCard :course="item as CourseListItem" />
          </div>
        </template>
      </UCarousel>
    </div>
   
    <UiLoading v-if="pending" class="my-20" />
    <UiError v-else-if="error" class="my-20"/>
  </section>
</template>


<script setup lang="ts">
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { useAsyncData } from 'nuxt/app';
import axios from 'axios';
import { useRuntimeConfig, useRoute } from '#app';
import type { CourseListItem } from '~/types/course';

// Access runtime config to get the baseURL from environment variables
const config = useRuntimeConfig();
const route = useRoute();

// Use useAsyncData for server-side data fetching
const { data, pending, error } = await useAsyncData('getCourseData', async () => {
  const response = await axios.get(`https://tedline.org/api/course/HomeCourses/?ordering=?`);
  return response.data.results;
});
</script>
