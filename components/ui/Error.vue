<template>

    <div class="flex justify-center w-full items-center text-gray-400 dark:text-gray-500">
        <InformationCircleIcon class="h-6 w-6" />
        <div class="px-2 text-xs my-5">
            {{ $t('errorOccurred') }}
        </div>
    </div>
</template>
<script setup>
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
</script>