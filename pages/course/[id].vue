<template>
  <Head>
    <Title v-if="course">دوره {{ course!.title }}</Title>
  </Head>

  <LayoutHeader :hide-until-scroll="true" />

  <!-- Loading State -->
  <div v-if="loading" class="min-h-screen ">
    <USkeleton class="h-96 md:h-[390px]   mb-8"></USkeleton>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <!-- Hero Skeleton -->

      <!-- Tabs Skeleton -->
      <div class="flex gap-4 mb-8">
        <USkeleton class="h-10 w-32  rounded-lg "></USkeleton>
        <USkeleton class="h-10 w-32  rounded-lg "></USkeleton>
        <USkeleton class="h-10 w-32  rounded-lg "></USkeleton>
      </div>

      <!-- Content Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <USkeleton class="h-32  rounded-lg "></USkeleton>
          <USkeleton class="h-32  rounded-lg "></USkeleton>
          <USkeleton class="h-32  rounded-lg "></USkeleton>
        </div>
        <div class="space-y-4">
          <USkeleton class="h-24  rounded-lg "></USkeleton>
          <USkeleton class="h-24  rounded-lg "></USkeleton>
        </div>
      </div>
    </div>
  </div>

  <!-- Course Content -->
  <div v-else class="min-h-screen ">
    <SectionCourseDetailCourseHeader :course="course!" @register="() => {handleRegister()}" />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-8">


      <!-- Tabs -->
      <div class="mt-5 grid grid-cols-1 lg:grid-cols-3 md:gap-8 pb-10">
        <div class="lg:col-span-1 mb-5">
          <div class="sticky top-20 grid grid-cols-2 md:grid-cols-1 gap-5 mt-10">
            <div
              class=" bg-green-400/10 border border-green-400/20 md:p-4 p-2 rounded-2xl hover:bg-green-400/20 hover:border-green-400/30 transition-all duration-200  ">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <UIcon
                      :name="course!.discount && course!.discount > 0 ? 'i-heroicons-tag' : 'i-heroicons-currency-dollar'"
                      class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ $t('courseDetail.coursePrice') }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('courseDetail.finalPrice') }}</p>
                  </div>
                </div>
              </div>

              <div v-if="course!.price !== 0" class="space-y-2">
                <div v-if="course!.discount && course!.discount > 0"
                  class="md:text-sm text-xs text-gray-500 dark:text-gray-400 line-through">
                  {{ formatPrice(course!.price) }} تومان
                </div>
                <div class="md:text-lg  text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {{ formatPrice(calculateFinalPrice()) }} تومان
                </div>
                <div v-if="course!.discount && course!.discount > 0"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                  <UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1" />
                  {{ course!.discount }}% {{ $t('courseDetail.discount') }}
                </div>
              </div>
              <div v-else>
                <div class="md:text-2xl text-lg font-bold text-emerald-700 dark:text-emerald-400">{{ $t("free") }}</div>
                <div
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 mt-2">
                  <UIcon name="i-heroicons-gift" class="w-3 h-3 mr-1" />
                  {{ $t('courseDetail.noFee') }}
                </div>
              </div>
            </div>

            <!-- Duration Card -->
            <div
              class="bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/20 hover:border-blue-400/30 rounded-2xl md:p-4 p-2 transition-all duration-200 ">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <UIcon name="i-heroicons-clock" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ $t('courseDetail.courseDuration')
                      }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('courseDetail.totalContentTime') }}</p>
                  </div>
                </div>
              </div>

              <div class="md:text-lg text-sm font-bold text-sky-700 dark:text-sky-400">
                {{ formatDuration(course!.duration) }}
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-2">
          <UTabs :dir="currentLocale?.dir" variant="link" :items="tabs.map(tab => ({ ...tab, label: $t(tab.label) }))"
            class="w-full">
            <template #details="{ item }">
              <SectionCourseDetailCourseDetailsTab :course="course!" />
            </template>
            <template #syllabus="{ item }">
              <SectionCourseDetailCourseSyllabusTab :course="course!" />
            </template>
            <template #prerequisites="{ item }">
              <SectionCourseDetailCoursePrerequisitesTab :course="course!" />
            </template>
          </UTabs>
        </div>
        
      </div>
    </div>
    <SectionCourseDetailRegistrationModal 
      :course="course!" 
      v-model:open="showRegistrationModal" 
      :loadingRegister="loadingRegister" 
    />
  </div>
</template>

<script setup lang="ts">
import type { CourseDetail } from '~/types/course'
const { locale, locales } = useI18n()

// Page meta
definePageMeta({
  layout: 'dashboard'
})

const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
)

function formatPrice(amount: number) {
  if (amount === 0) return 'Free'
  return amount.toLocaleString('en-US')
}

const api = useApi(false)

// Get i18n instance
const { t } = useI18n()

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours} ${t('courseDetail.hour')} ${t('and')} ${mins} ${t('minute')}`
  }
  return `${mins} ${t('minute')}`
}

// Route
const route = useRoute()
const localePath = useLocalePath()
const courseId = route.params.id as string
const loadingRegister = ref(false)
const activeTab = ref('details')
const showRegistrationModal = ref(false)
const discountAmount = ref(0)

// Store
const userStore = useUserStore()

// Toast
const toast = useToast()


// Tabs configuration
const tabs = [
  {
    key: 'details',
    label: 'courseDetail.courseDetails',
    icon: 'i-heroicons-information-circle',
    slot: 'details' as const
  },
  {
    key: 'syllabus',
    label: 'courseDetail.syllabus',
    icon: 'i-heroicons-list-bullet',
    slot: 'syllabus' as const
  },
  {
    key: 'prerequisites',
    label: 'courseDetail.prerequisites',
    icon: 'i-heroicons-check-circle',
    slot: 'prerequisites' as const
  }
]

// Fetch course data server-side (SEO-friendly) but only when accessed
const { data: course, pending: loading, refresh: refreshCourse } = await useLazyAsyncData<CourseDetail>(
  `course-${courseId}`,
  () => api(`/course/RetrieveCourses/${courseId}/`),
  {
    server: true, // run on server-side render
  }
)

function ShowaAlreadyRegisteredToast(){
  if (course.value?.registered && course.value?.session.length > 0) {
    toast.add({
      description: t('courseDetail.alreadyRegistered'),
      orientation:"horizontal",
      actions:
      [
        {
          label: t('courseDetail.view') ,
          color: 'neutral',
          variant: 'soft',
          to: localePath(`/course/learn/${course.value?.id}/${course.value?.session[0].id}`),
        }
      ] 
    })
  }
}

// show in server side
if (import.meta.client) {
  ShowaAlreadyRegisteredToast()
}

// show in client side
watch(course, (newVal) => {
  if (newVal) {
    ShowaAlreadyRegisteredToast()
  }
})


const handleRegister = () => {


  if (!userStore.isAuthenticated) {
    // Redirect to signup with return URL
    navigateTo(`/auth/signUp/?next=${courseId}`)
    return
  }

  if (course.value!.price > 0) {
    showRegistrationModal.value = true
  } else {
    registerFreeCourse()
  }
}



const handleRegistration = async (discountCode: string | null) => {
  try {
    loadingRegister.value = true

    if (calculateFinalPrice() === 0) {
      await registerFreeCourse()
    } else {
      await registerPaidCourse(discountCode)
    }
  } catch (error) {
    console.error('Registration error:', error)
    toast.add({
      title: 'خطا',
      description: 'خطا در ثبت نام',
    })
  } finally {
    loadingRegister.value = false
    showRegistrationModal.value = false
  }
}

const registerFreeCourse = async () => {
  const response = await api(`/course/RegisterCourseFree/${courseId}/`) as any

  // Redirect to first lesson
  navigateTo(`/course/learn/${course.value!.id}/${course.value!.session[0].id}`)
}

const registerPaidCourse = async (discountCode: string | null) => {
  const response = await $fetch('https://tedline.org/api/wallet/increase-money/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: {
      course_id: courseId,
      discount_code: discountCode
    }
  }) as any

  // Redirect to payment gateway
  window.location.href = response.result
}

const checkDiscountCode = async (code: string) => {
  try {
    const response = await $fetch(`https://tedline.org/api/course/check-valid-product-discount/${code}/${courseId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }) as any

    if (response.valid) {
      if (response.is_percentage) {
        discountAmount.value = (calculateCoursePrice() * response.amount) / 100
      } else {
        discountAmount.value = response.amount
      }

      toast.add({
        title: 'موفق',
        description: 'کد تخفیف اعمال شد',
      })
    } else {
      toast.add({
        title: 'خطا',
        description: 'کد تخفیف معتبر نیست',
      })
    }
  } catch (error) {
    console.error('Discount code error:', error)
    toast.add({
      title: 'خطا',
      description: 'مشکلی پیش آمده',
    })
  }
}

const shareCourse = () => {
  const url = `https://tedline.org/course/${courseId}/`

  if (navigator.share) {
    navigator.share({
      title: course.value!.title,
      text: course.value!.description,
      url: url
    })
  } else {
    // Fallback to clipboard
    navigator.clipboard.writeText(url).then(() => {
      toast.add({
        title: 'موفق',
        description: 'لینک کپی شد',
      })
    })
  }
}

const calculateCoursePrice = () => {
  if (course.value!.price === 0) return 0
  if (!course.value!.discount) return course.value!.price
  return course.value!.price - (course.value!.price * course.value!.discount / 100)
}

const calculateFinalPrice = () => {
  const coursePrice = calculateCoursePrice()
  return Math.max(0, coursePrice - discountAmount.value)
}


</script>

<style>
.position-dialog-b-l .v-overlay__content {
  bottom: var(--dialog-ypos);
  right: var(--dialog-xpos);
}
</style>