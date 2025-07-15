<template>
    <div class="mx-auto grid max-w-7xl grid-cols-3 gap-x-4 px-6 pb-20 xl:gap-x-8">
        <div v-for="item in products" :key="item.name"
            class="group relative rounded-xl p-6 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-gray-900/60  dark:bg-stone-900/50">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 group-hover:bg-white dark:bg-stone-800 dark:group-hover:bg-gray-900">
                <component :is="item.icon" class="h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400"
                    aria-hidden="true" />
            </div>
            <a :href="item.href" class="mt-6 block font-semibold text-gray-900 dark:text-gray-100">
                {{ item.name }}
                <span class="absolute inset-0" />
            </a>
            <p class="mt-1 text-gray-600 font-light dark:text-gray-400">{{ item.description }}</p>
        </div>
    </div>
</template>

<script setup>


import { UserIcon, AcademicCapIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const products = [
  {
    name: t('feature.studentTitle'),
    description: t('feature.studentDesc'),
    href: '#',
    icon: AcademicCapIcon,
  },
  {
    name: t('feature.teacherTitle'),
    description: t('feature.teacherDesc'),
    href: '#',
    icon: UserIcon,
  },
  {
    name: t('feature.instituteTitle'),
    description: t('feature.instituteDesc'),
    href: '#',
    icon: BuildingOffice2Icon,
  },
]
</script>