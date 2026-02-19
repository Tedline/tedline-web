<template>
    <NuxtLinkLocale :to="`/course/${course.id}`"
        class="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-100 transition-all duration-300 hover:scale-99  hover:border-gray-200 dark:bg-stone-900/50 dark:border-stone-900 dark:hover:bg-gray-900/60 dark:hover:border-gray-900">
        <!-- Image Container -->
        <div class="relative aspect-[5/3] overflow-hidden">
            <NuxtImg :src="course.image" :alt="course.title" preset="thumbnail" loading="lazy"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103" />
            <!-- Teacher Avatar -->
            <div
                class="absolute bg-white/60 rounded-full backdrop-blur-xs py-1 px-2 bottom-3 start-3 flex items-center text-[10px] text-gray-800 dark:bg-black/40 dark:text-gray-100">
                <ClockIcon class="me-1 h-3 w-3" />
                <span>{{ formatDuration(course.duration) }}</span>
            </div>
        </div>

        <!-- Content Container -->
        <div class="relative flex flex-1 flex-col justify-between p-4">
            <UChip position="bottom-left" size="xl"  :show="course.institute ? true : false" class="absolute top-[-16px] end-3">
                <template v-slot:content>
                    <UIcon name="qlementine-icons:check-tick-small-16" class="text-white" />
                </template>
            <UAvatar icon="lets-icons-user"
                :src="
                !course.institute ? `${useRuntimeConfig().public.apiImageProxyUrl}/api/account/user_profile_image/${course.teacher.username}`
                 : course.institute.image! "
                size="sm"
                :class="[ course.institute ? 'rounded-lg ring-white' :'rounded-full ring-white',' h-8.5 w-8.5 items-center justify-center   ring-3  dark:ring-gray-900 text-white']" />
            </UChip>

            <!-- Course Title -->
            <div class="text-[10px] " >
                <template v-if="course.institute">
                    {{ course.institute.name }}
                </template>
                <template v-else>
                    {{ course.teacher.first_name }} {{ course.teacher.last_name }}
                </template>
            </div>
            <div class="mb-2 mt-1">
                <h3 class="line-clamp-1 text-sm font-semibold leading-tight text-gray-900 dark:text-white">
                    {{ course.title }}
                </h3>
            </div>

            <!-- Pricing and Duration -->
            <div class="space-t-2">
                <!-- Price Section -->
                <div class="flex items-center justify-between">
                    <div class="flex flex-col min-h-[2rem] justify-center">
                        <!-- Original Price (if discounted) -->
                        <span v-if="course.price > 0 && course.discount"
                            class="text-xs text-gray-500 line-through dark:text-gray-400">
                            {{ formatPrice(course.price) }}
                        </span>
                        <!-- Final Price -->
                        <span class="text-sm font-bold text-gray-900 dark:text-white">
                            {{ course.price === 0 ? $t("free") : formatPrice(discountedPrice) }}
                        </span>
                    </div>

                    <!-- Discount Badge -->
                    <div v-if="course.discount && course.price > 0"
                        class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        -{{ course.discount }}%
                    </div>
                    <!-- Empty space placeholder when no discount -->
                    <div v-else class="w-12"></div>
                </div>

                <!-- Duration -->

            </div>
        </div>
    </NuxtLinkLocale>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { CourseListItem } from '~/types/course'
import {  ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    course: CourseListItem
}>()

function formatPrice(amount: number) {
    if (amount === 0) return 'Free'
    return amount.toLocaleString('en-US')
}

function formatDuration(minutes: number) {
    if (minutes < 60) {
        return `${minutes} min`
    } else {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        if (remainingMinutes === 0) {
            return `${hours}h`
        } else {
            return `${hours}h ${remainingMinutes}m`
        }
    }
}

const discountedPrice = computed(() => {
    const { price, discount } = props.course
    if (!discount) return price
    return Math.round(price - ((price * discount) / 100))
})
</script>