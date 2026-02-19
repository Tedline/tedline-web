<template>
  <div>
    <div
    class="p-4 rounded-lg ring ring-inset ring-accented/30 "
      :class="[
        'transition-all duration-200 bg-elevated/50  hover:bg-stone-100  dark:hover:bg-stone-800',
        disable ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'
      ]"
      @click="handleClick"
    >
      <div class="flex items-center justify-between ">
        <!-- Icon and Title -->
        <div class="flex items-center gap-4">
          
          <UAvatar 
            :size="'3xl'" 
            :icon="icon"
            :ui="{
              icon:'text-white'
            }"
            :class="iconClass"
            class="bg-gradient-to-br flex-shrink-0 rounded-lg"
          />
          <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
        </div>
        
        <!-- Status Badge -->
        <div class="flex-shrink-0">
          <UBadge 
            v-if="read" 
           color="neutral" variant="soft"
            size="sm"
            class="flex items-center gap-1"
          >
            <UIcon name="i-heroicons-check" class="w-3 h-3 text-green-500" />
            خوانده شده
          </UBadge>
          <UBadge 
            v-else 
            color="neutral" variant="soft"
            size="sm"
          >
            خوانده نشده
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocalePath } from '#i18n'
const localePath = useLocalePath()

const props = defineProps({
  iconClass: {
    type: String,
    default: 'from-blue-500 to blue-600'
  },
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  to: {
    type: String,
    default: null
  },
  read: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  href: {
    type: String,
    default: null
  }
})


const handleClick = () => {
  if (props.disable) return
  
  if (props.href) {
    window.open(props.href, '_blank')
  } else if (props.to) {
    navigateTo(localePath(props.to))
  }
}
</script>