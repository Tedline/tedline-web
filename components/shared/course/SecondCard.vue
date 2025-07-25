<template>
    <NuxtLink
        :to="`/shop/${course.id}`"
        class="relative group bg-white  rounded-2xl border border-gray-100  overflow-hidden p-3 flex flex-col items-center text-center hover:scale-99 hover:p-0 hover:pb-6 hover:border-gray-200 dark:bg-stone-900/70 dark:border-stone-900 dark:hover:bg-gray-900/60 dark:hover:border-gray-900 transition-all duration-300"
    >
        <div class="relative w-full  h-[160px]  flex items-center justify-center mb-4">
            <img
                :src="course.image"
                alt="product"
                class="h-full w-full rounded-xl object-cover group-hover:rounded-none transition-all duration-300"
            />
            <div class="absolute bottom-[-15px] start-2 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                <UserIcon class="h-4 w-4 text-white" />
            </div>
        </div>

        <div class="text-start w-full px-2 mt-3 ">
            <p class=" text-xs text-gray-800 font-semibold line-clamp-1  dark:text-gray-100 mb-1">{{ course.title }}</p>
            <p class="text-xs  text-gray-500 dark:text-gray-400 ">{{ formatPrice(discountedPrice) }}</p>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { CourseListItem } from '~/types/course'
import { UserIcon } from '@heroicons/vue/24/outline'
const props = defineProps<{
    course: CourseListItem
}>()

function formatPrice(amount: number) {
    return `${amount}`
}

const discountedPrice = computed(() => {
    const { price, discount } = props.course
    if (!discount) return price
    return Math.round(price - ((price * discount) / 100))
})
</script>