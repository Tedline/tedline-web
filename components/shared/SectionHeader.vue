<template>
  <div class="flex items-center gap-3 mb-6">
    <div 
      class="flex-shrink-0 w-11 h-11 bg-gradient-to-br rounded-xl flex items-center justify-center"
      :class="gradientClass"
    >
      <UIcon :name="icon" class="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 class="text-md font-bold text-gray-900 dark:text-white">{{ title }}</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'indigo'
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  color: 'blue'
})

const gradientClass = computed(() => {
  const gradients = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600'
  }
  
  return gradients[props.color]
})
</script>