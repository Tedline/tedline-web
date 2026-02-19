<script setup lang="ts">
import { useId } from 'vue'

interface CircleBackgroundProps {
    color: string
    width?: number
    height?: number
    [key: string]: any
}

const props = withDefaults(defineProps<CircleBackgroundProps>(), {
    width: 558,
    height: 558,
})

const id = useId()

// Destructure so we can spread "rest" props without duplicating width/height
const { color, width, height, ...rest } = props
</script>

<template>
    <svg viewBox="0 0 558 558" :width="width" :height="height" fill="none" aria-hidden="true" v-bind="rest">
        <defs>
            <linearGradient :id="id" x1="79" y1="16" x2="105" y2="237" gradientUnits="userSpaceOnUse">
                <stop :stop-color="color">
                    <animate attributeName="offset" values="1;0;0" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="1" :stop-color="color" stop-opacity="0">
                    <animate attributeName="offset" values="0;1;0" dur="4s" repeatCount="indefinite" />
                </stop>
            </linearGradient>
        </defs>
        <path opacity=".2" d="M1 279C1 125.465 125.465 1 279 1s278 124.465 278 278-124.465 278-278 278S1 432.535 1 279Z"
            :stroke="color" />
        <path d="M1 279C1 125.465 125.465 1 279 1" :stroke="`url(#${id})`" stroke-linecap="round" />
    </svg>
</template>
