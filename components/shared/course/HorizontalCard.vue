<template>
  <div  class="group  h-full rounded-xl transition-all duration-300 border border-gray-200
       hover:border-gray-300 hover:bg-gray-50/30 dark:bg-stone-900/70 dark:border-stone-800
       dark:hover:bg-gray-900/60 dark:hover:border-gray-900 overflow-hidden">
    <NuxtLinkLocale :to="'/course/'+course.id"
     
    >
     <div class="">
       <div class="relative isolate flex flex-col p-2 md:flex-row gap-4 overflow-hidden">
        <img
             :src="course.image"
             :alt="course.title"
             class=" -z-10 absolute opacity-0 dark:opacity-10 w-full h-full object-cover "
           />
           <div class="-z-10 absolute dark:backdrop-blur-lg inset-0 ltr:bg-gradient-to-l rtl:bg-gradient-to-r   dark:from-black/50 to-transparent"></div>

         <!-- Course Image -->
         <div class="relative h-40 md:w-1/3 overflow-hidden rounded-lg">
           <img
             :src="course.image"
             :alt="course.title"
             class="w-full h-full   object-cover  group-hover:scale-102 transition-transform duration-300"
           />
           <div class="absolute inset-0 bg-gradient-to-t  dark:from-black/60 to-transparent"></div>
           
           <!-- Price Badge -->
           <div class="absolute top-3 left-3">
             <UBadge
                 v-if="course.price === 0"
                 color="neutral"
                 variant="soft"
                 class="text-xs bg-white/70 dark:bg-black/50 dark:backdrop-blur-md"
               >
               {{ t('free') }}
             </UBadge>
             <UBadge
               v-else-if="course.discount && course.discount > 0"
               color="neutral"
               variant="soft"
               class="text-xs bg-white/70 dark:bg-black/50 dark:backdrop-blur-md"
             >
               {{ course.discount }}% {{ t('courseDetail.discount') }}
             </UBadge>
           </div>
         </div>
         
         <!-- Course Content -->
         <div class="flex-1 p-2 md:p-4 flex flex-col">
           <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 transition-colors">
             {{ course.title }}
           </h3>
           
           <p class="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
             {{ course.description }}
           </p>
           
           <!-- Course Meta -->
           <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
             <div class="flex items-center gap-1 text-xs">
               <UIcon name="i-heroicons-clock" class="w-4 h-4" />
               <span>{{ formatDuration(course.duration) }}</span>
             </div>
             
             <div class="flex items-center gap-1 text-xs">
               <UIcon name="i-heroicons-user" class="w-4 h-4" />
               <span>{{ course.teacher?.username || course.institute?.username }}</span>
             </div>
           </div>
           
           <!-- Price -->
           <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
             <div v-if="course.price !== 0" class="flex items-center justify-between">
               <div v-if="course.discount && course.discount > 0" class="text-xs text-gray-500 dark:text-gray-400 line-through">
                 {{ formatPrice(course.price) }} {{ t('explore.currency') }}
               </div>
               <div v-else class="text-sm font-semibold text-gray-900 dark:text-white">
                 {{ formatPrice(course.price) }} {{ t('explore.currency') }}
               </div>
               <div v-if="course.discount && course.discount > 0" class="text-sm font-semibold text-green-600 dark:text-green-400">
                 {{ formatPrice(calculateFinalPrice()) }} {{ t('explore.currency') }}
               </div>
             </div>
             <div v-else class="text-sm font-semibold text-green-600 dark:text-green-400">
               {{ t('free') }}
             </div>
           </div>
         </div>
       </div>
     </div>
    </NuxtLinkLocale>
  </div>
</template>

<script setup lang="ts">
import type { CourseListItem } from '~/types/course'

interface Props {
  course: CourseListItem
}

const { t } = useI18n()
const props = defineProps<Props>()

function formatPrice(amount: number) {
  if (amount === 0) return t('free')
  return amount.toLocaleString('en-US')
}

const calculateFinalPrice = () => {
  if (props.course.price === 0) return 0
  if (!props.course.discount) return props.course.price
  return Math.round(props.course.price - (props.course.price * props.course.discount / 100))
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours} ${t('courseDetail.hour')} ${t('and')} ${mins} ${t('minute')}`
  }
  return `${mins} ${t('minute')}`
}
</script>