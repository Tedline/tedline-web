<template>
  <div class="container mx-auto px-4 relative">
    <!-- Header Section -->
    <div class="flex justify-center">
      <div class="w-full max-w-4xl">
        <div dir="rtl" class="mb-6">
          <h1 class="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">رویداد های ما</h1>
          <img
            class="w-full h-48 object-cover rounded-lg"
            src="https://img.freepik.com/free-vector/recruitment-isometric-composition-with-images-different-office-rooms-infographic-text-captions-available-editing-illustration_1284-29101.jpg?t=st=1726852469~exp=1726856069~hmac=dfb3bc638720500c1bd509703fd7f1fbd59ca8a42df530aa35fd11ccc37b449e&w=1380"
            alt="Events"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center">
      <div class="w-full max-w-4xl">
        <UCard class="flex justify-center items-center px-8 py-8">
          <div class="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
        </UCard>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading" class="flex justify-center mt-5">
      <div class="w-full max-w-4xl">
        <!-- Title Section -->
        <div dir="rtl" class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">برترین نمرات</h1>
          <UIcon name="i-heroicons-ellipsis-horizontal" class="w-6 h-6 text-gray-500" />
        </div>
        <!-- Podium Section -->
        <div class="mt-6 flex justify-center items-end gap-8">
          <!-- 2nd Place -->
          <div class="flex flex-col items-center relative mt-8">
            <div class="relative">
              <UAvatar
                :src="data.ranking[1].user.image"
                :size="avatarSize"
                class="border-4 border-gray-200 dark:border-gray-700"
              />
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold text-white">2</span>
              </div>
            </div>
            <span class="text-lg font-bold mt-2 text-gray-900 dark:text-gray-100">
              {{ data.ranking[1].user.first_name }}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ parseFloat(data.ranking[1].final_score) }}%
            </span>
          </div>

          <!-- 1st Place -->
          <div class="flex flex-col items-center relative">
            <div class="relative">
              <UAvatar
                :src="data.ranking[0].user.image"
                :size="rankOneAvatarSize"
                class="border-4 border-yellow-400"
              />
              <div class="absolute -top-2 -right-2 w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-lg font-bold text-white">1</span>
              </div>
            </div>
            <span class="text-xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {{ data.ranking[0].user.first_name }}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ parseFloat(data.ranking[0].final_score) }}%
            </span>
          </div>

          <!-- 3rd Place -->
          <div class="flex flex-col items-center relative mt-8">
            <div class="relative">
              <UAvatar
                :src="data.ranking[2].user.image"
                :size="avatarSize"
                class="border-4 border-gray-200 dark:border-gray-700"
              />
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold text-white">3</span>
              </div>
            </div>
            <span class="text-lg font-bold mt-2 text-gray-900 dark:text-gray-100">
              {{ data.ranking[2].user.first_name }}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ parseFloat(data.ranking[2].final_score) }}%
            </span>
          </div>
        </div>
        <!-- Ranking List -->
        <div dir="rtl" class="mt-8">
          <div class="space-y-2">
            <div
              v-for="item in data.ranking"
              :key="item.id + '-rank'"
              class="flex items-center w-full relative p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <!-- Sidebar indicator for 3rd place -->
              <div v-if="item.rank === 3" class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
              
              <!-- Rank number -->
              <div class="ml-5 text-lg font-bold text-gray-900 dark:text-gray-100 min-w-[2rem]">
                {{ item.rank }}
              </div>
              
              <!-- Avatar -->
              <div class="ml-4">
                <UAvatar :src="item.user.image" size="md" />
              </div>
              
              <!-- Name -->
              <div class="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1">
                {{ item.user.first_name }}
              </div>
              
              <!-- Score -->
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ parseFloat(item.final_score) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Rank Card (Fixed Position) -->
    <UCard
      dir="rtl"
      class="fixed bottom-0 right-0 w-full sm:w-80 z-10 m-4 sm:m-6"
    >
      <div class="flex items-center gap-4 p-4">
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ data.user_rank.rank }}
        </div>
        <UAvatar :src="data.user_rank.user.image" size="lg" />
        <div class="flex-1">
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ data.user_rank.user.first_name }}
          </div>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ parseFloat(data.user_rank.final_score) }}%
        </div>
      </div>
    </UCard>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "dashboard",
})

const route = useRoute()
const api = useApi()

const data = ref({})
const loading = ref(true)
const userId = ref(null)
const avatarSize = ref(75)
const rankOneAvatarSize = ref(100)

const getData = async () => {
  try {
    loading.value = true
    const response = await api(`quiz/ranking-quiz/${route.params.box}`)
    data.value = response
    loading.value = false
    console.log("data: ", data.value)
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}

const getAvatarSize = () => {
  const width = window.innerWidth
  let newAvatarSize, newRankOneAvatarSize
  
  if (width < 600) {
    newAvatarSize = 75
    newRankOneAvatarSize = 100
  } else if (width < 900) {
    newAvatarSize = 75
    newRankOneAvatarSize = 100
  } else {
    newAvatarSize = 100
    newRankOneAvatarSize = 125
  }
  
  return { avatarSize: newAvatarSize, rankOneAvatarSize: newRankOneAvatarSize }
}

const onResize = () => {
  const sizes = getAvatarSize()
  avatarSize.value = sizes.avatarSize
  rankOneAvatarSize.value = sizes.rankOneAvatarSize
}

onMounted(() => {
  getData()
  const sizes = getAvatarSize()
  avatarSize.value = sizes.avatarSize
  rankOneAvatarSize.value = sizes.rankOneAvatarSize
  window.addEventListener("resize", onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize)
})
</script>
  