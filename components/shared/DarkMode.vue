<template>
  <button @click="toggleMode" :class="class_data" >
    <template v-if="colorMode.value === 'dark'">
      <MoonIcon class="w-6 h-6 inline" />
    </template>
    <template v-else>
      <SunIcon class="w-6 h-6 inline" />
    </template>
  </button>
</template>

<script setup>
const colorMode = useColorMode()
import { defineProps } from 'vue'
import {
    MoonIcon,
    SunIcon,
} from '@heroicons/vue/24/outline'
const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})
const class_data = props.class
const toggleMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>