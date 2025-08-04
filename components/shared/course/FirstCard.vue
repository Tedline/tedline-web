<template>
  <NuxtLinkLocale :to="`/shop/${course.id}`"
    class="relative group transform transition-transform duration-300 hover:scale-[0.98] flex h-[330px] mb-5 flex-col justify-end overflow-hidden rounded-3xl">
    <img :src="course.image" alt="" class="absolute inset-x-0 top-0 bottom-0 w-full h-full object-cover" />
    <div aria-hidden="true"
      class="group-hover:opacity-0 transition-opacity duration-700 absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 from-[calc(7/16*100%)] ring-1 ring-gray-950/10 ring-inset sm:from-25%" />
    <figure class="relative p-10 group-hover:opacity-0 transition-opacity duration-300">
      <p class="relative text-sm line-clamp-2 text-white">{{ course.description }}</p>
      <figcaption class="mt-6 border-t border-white/20 pt-6">
        <p class="text-sm/6 font-bold text-[#6dccfb] ">
          {{ course.title }}
        </p>
        <div class="flex items-center justify-between mt-2">
          <div>
            <p v-if="course.discount" class="text-xs font-medium text-white/50 line-through">
              {{ formatPrice(course.price) }}
            </p>
            <p class="text-sm/6 font-medium text-white">
              {{ formatPrice(discountPercent(course) || 0) }}
            </p>
          </div>
          <div v-if="discountPercent(course)"
            class="p-2 rounded-full text-xs text-white ring-1 ring-inset ring-white/10 bg-white/10">
            {{ course.discount }}%
          </div>
        </div>
      </figcaption>
    </figure>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">

import { defineProps } from 'vue'
import type { CourseListItem } from '~/types/course';

const props = defineProps<{
  course: CourseListItem
}>()
const course = props.course

function formatPrice(amount: number) {
  return `${amount.toLocaleString()} تومان`
}

function discountPercent(course: CourseListItem) {
  if (!course.discount) return course.price
  return Math.round(course.price - ((course.price * course.discount) / 100))
}

</script>
