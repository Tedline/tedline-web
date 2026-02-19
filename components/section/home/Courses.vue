<template>
  <section id="resources" class=" scroll-mt-14 sm:scroll-mt-32 sm:py-5" v-if="pending == false">
    <div class="flex justify-between items-center mx-10">
      <h3 class="font-semibold flex text-gray-900 dark:text-gray-100">   
        {{ title }}  
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
        :ui="{ item: 'basis-3/4 sm:basis-2/4 md:basis-1/4' ,}"
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
import { useApi } from '~/composables/useApi'
import type { CourseListItem } from '~/types/course';

// Define props to receive URL and title
interface Props {
  apiUrl?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  apiUrl: '/course/HomeCourses/?ordering=?',
  title: undefined
})

const api = useApi(false)  // false = optional token, true = require token

const { data, pending, error } = await useLazyAsyncData('getCourseData', () => 
api(props.apiUrl).then((res: any) => res.results),
)
</script>
