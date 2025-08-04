<template>
  <div 
    class="bg-white rounded-2xl border border-gray-200 p-8 hover:border-gray-300 hover:bg-gray-50/30 dark:bg-stone-900/70 dark:border-stone-800 dark:hover:bg-gray-900/60 dark:hover:border-gray-900 transition-all duration-200"
    :class="{ 'h-full': fullHeight }"
  >
    <SharedSectionHeader 
      :title="title" 
      :description="description" 
      :icon="icon" 
      :color="color"
    />
    
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'indigo'
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  color: 'blue',
  fullHeight: false
})
</script>