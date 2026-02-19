<template>
  <!-- Loading State -->
  <div v-if="loading" class="flex justify-center items-center min-h-64">
    <div class="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600"></div>
  </div>

  <!-- Main Content -->
  <div v-if="!loading" class="container mx-auto px-4">
    <!-- Header -->
    <UCard class="mb-5 mt-3">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-4">
          <UAvatar size="xl" color="primary" variant="soft">
            <UIcon name="i-heroicons-video-camera" class="w-6 h-6" />
          </UAvatar>
          <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $t('learning.audio') }}</h2>
        </div>
        
        <UButton
          :to="`/course/learn/${$route.params.id}/${$route.params.session}/`"
          icon="i-heroicons-arrow-right"
          color="primary"
          variant="solid"
          size="lg"
        />
      </div>
    </UCard>
    <!-- Video Player Section -->
    <UCard class="rounded-xl overflow-hidden">
      <video-player
        @seeking="seeking"
        :src="`${audioUrl}/${$route.params.id}/${$route.params.box}/?token=${$store.state.token}#.mp3`"
        controls
        :audioOnlyMode="true"
        oncontextmenu="return false;"
        :loop="true"
        @mounted="update"
        :responsive="true"
        :fluid="true"
        :playbackRates="[0.5, 1, 1.5, 2]"
        :volume="0.6"
      >
        <template v-if="state" v-slot="{ player, state }">
          <!-- User Overlay -->
          <div
            v-if="state.playing && show_user"
            :class="[
              'absolute inset-0 flex items-start justify-center pt-20 z-10',
              position_show_user === 1 ? 'justify-end' : position_show_user === 2 ? 'justify-start' : 'justify-center'
            ]"
          >
            <UCard class="bg-black/80 backdrop-blur-sm px-4 py-2 flex items-center gap-3">
              <UAvatar color="primary" variant="soft" size="sm">
                <IconUser size="15" />
              </UAvatar>
              <span class="text-sm text-white font-medium">{{ username }}</span>
            </UCard>
          </div>

          <!-- Quiz Dialog -->
          <div v-if="data" v-for="item in data.quiz" :key="item.id">
            <div v-if="showDialog(Math.floor(state.currentTime), item.time)">
              <UModal v-model="dialog" :persistent="true">
                <UCard class="w-full h-full">
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-semibold">{{ $t('learning.quizTitle') }}</h3>
                      <UButton
                        color="primary"
                        variant="ghost"
                        icon="i-heroicons-x-mark"
                        @click="
                          dialog = false;
                          player.play();
                          lastQuiz = Math.floor(state.currentTime);
                        "
                      />
                    </div>
                  </template>
                  
                  <div class="p-4">
                    <QuizMovie :idVideo="data.id" :data="item.quiz" />
                  </div>
                </UCard>
              </UModal>
            </div>
          </div>
        </template>
      </video-player>
    </UCard>
  </div>
</template>

<script setup>
import QuizMovie from "~/components/section/QuizMovie.vue"
import { IconUser } from '@tabler/icons-vue'

definePageMeta({
  layout: "course-dashboard",
})

const route = useRoute()
const userStore = useUserStore()
const api = useApi()

const audioUrl = "https://tedline.org/api/box/audio/stream_audio"
const state = ref(null)
const data = ref(null)
const loading = ref(true)
const dialog = ref(false)
const lastQuiz = ref(null)
const show_user = ref(false)
const username = ref(null)
const interval_show_user = ref(null)
const position_show_user = ref(1)

const showDialog = (current, time) => {
  if (current == time && lastQuiz.value != time) {
    dialog.value = true
    lastQuiz.value = time
    return true
  } else {
    return false
  }
}

const seeking = () => {
  // when user jump to new time of movie
  // last quiz can appear again
  lastQuiz.value = null
}

const update = (data) => {
  state.value = data.state
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const getData = async () => {
  try {
    const response = await api(`box/audio/retrieve-audio/${route.params.box}/`)
    loading.value = false
    data.value = response
    show_user.value = response.show_user
    
    // change position of show_user each 10 sec
    if (show_user.value) {
      interval_show_user.value = setInterval(() => {
        position_show_user.value = getRandomInt(3)
      }, 10000)
    }
  } catch (error) {
    console.error($t('learning.errorFetchingAudio'), error)
    loading.value = false
  }
}

onMounted(async () => {
  await userStore.initialize()
  username.value = userStore.username
  await getData()
  
  // Prevent right-click context menu
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault()
  })
  
  // Prevent F12 key from opening developer tools
  document.addEventListener("keydown", function (e) {
    if (e.keyCode == 123 /* F12 */) {
      e.preventDefault()
    }
  })
})

onBeforeUnmount(() => {
  if (interval_show_user.value) {
    clearInterval(interval_show_user.value)
  }
})
</script>

