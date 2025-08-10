<script setup>
import { ref, computed } from 'vue'

// Generate a unique ID for the pattern
const patternId = ref(`pattern-${Math.random().toString(36).substr(2, 9)}`)

// Define props with defaults
const props = defineProps({
  width: {
    type: Number,
    default: 40
  },
  height: {
    type: Number,
    default: 40
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  squares: {
    type: Array,
    default: null
  }
})

// Compute the path data
const pathD = computed(() => `M.5 ${props.height}V.5H${props.width}`)
</script>

<template>
  <svg aria-hidden="true" v-bind="$attrs">
    <defs>
      <pattern
        :id="patternId"
        :width="width"
        :height="height"
        patternUnits="userSpaceOnUse"
        :x="x"
        :y="y"
      >
        <path :d="pathD" fill="none" />
      </pattern>
    </defs>
    <rect
      width="100%"
      height="100%"
      stroke-width="0"
      :fill="`url(#${patternId})`"
    />
    <svg v-if="squares" :x="x" :y="y" class="overflow-visible">
      <rect
        v-for="([x, y], index) in squares"
        :key="`${x}-${y}`"
        stroke-width="0"
        :width="width + 1"
        :height="height + 1"
        :x="x * width"
        :y="y * height"
      />
    </svg>
  </svg>
</template>