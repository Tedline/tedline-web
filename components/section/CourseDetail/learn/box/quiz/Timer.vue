<template>
  <div class="container mx-auto px-4">
    <UCard class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl py-10">
      <div class="flex items-center justify-center gap-8">
        <!-- Time Display -->
        <div class="rtl flex flex-col text-white justify-center items-center">
          <div class="text-sm font-light opacity-90">
            زمان باقی مانده 
          </div>
          <div class="text-2xl font-bold">
            {{ formattedTime }}
          </div>
        </div>
        
        <!-- Progress Circle -->
        <div class="relative">
          <div class="w-20 h-20 rounded-full bg-blue-800/30 flex items-center justify-center">
            <div class="w-16 h-16 rounded-full bg-blue-800/50 flex items-center justify-center">
              <div class="w-12 h-12 rounded-full bg-blue-800/70 flex items-center justify-center">
                <span class="text-white text-xs font-bold">
                  {{ Math.round(progress) }}%
                </span>
              </div>
            </div>
          </div>
          
          <!-- SVG Progress Circle -->
          <svg class="absolute inset-0 w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="rgba(255, 255, 255, 0.2)"
              stroke-width="8"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="white"
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              class="transition-all duration-1000 ease-in-out"
            />
          </svg>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps({
  examTime: {
    type: Number,
    required: true
  },
  elapsedTime: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['timeUp'])

const timeLeft = ref(props.examTime * 60)
const timer = ref(null)
const totalSeconds = ref(0)

const circumference = 2 * Math.PI * 35 // radius = 35

const progress = computed(() => {
  return (timeLeft.value / (props.examTime * 60)) * 100
})

const strokeDashoffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
})

const timeToSeconds = (timeString) => {
  if (timeString) {
    const [hours, minutes, seconds] = timeString.split(":")
    totalSeconds.value = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds.split(".")[0])
  } else {
    console.log("error")
  }
}

const startTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      totalSeconds.value++
      timeLeft.value = props.examTime * 60 - totalSeconds.value
    } else {
      clearInterval(timer.value)
      emit("timeUp")
    }
  }, 1000)
}

onMounted(() => {
  timeToSeconds(props.elapsedTime)
  startTimer()
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

