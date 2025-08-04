<template>
  <UModal v-model="isOpen" >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('courseDetail.registrationTitle') }}</h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>

      <!-- Course Info -->
      <div class="flex items-start gap-4 mb-6">
        <img
          :src="course.image"
          :alt="course.title"
          class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ course.title }}</h4>
          <p class="text-sm text-gray-600 line-clamp-2">{{ course.description }}</p>
        </div>
      </div>

      <!-- Discount Code Section -->
      <UDisclosure>
        <UDisclosureButton class="w-full">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-900">{{ $t('courseDetail.applyDiscountCode') }}</span>
            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
          </div>
        </UDisclosureButton>
        
        <UDisclosurePanel>
          <div class="mt-4 space-y-3">
            <div class="flex gap-2">
              <UInput
                v-model="discountCode"
                :placeholder="$t('courseDetail.discountCodePlaceholder')"
                class="flex-1"
                :disabled="btnDiscountLoading"
              />
              <UButton
                @click="checkDiscountCode"
                :loading="btnDiscountLoading"
                :disabled="!discountCode || btnDiscountLoading"
                color="primary"
                variant="solid"
                icon="i-heroicons-check"
              />
            </div>
            <p class="text-xs text-gray-500">
              {{ $t('courseDetail.discountCodeHelp') }}
            </p>
          </div>
        </UDisclosurePanel>
      </UDisclosure>

      <!-- Price Summary -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">{{ $t('courseDetail.originalPrice') }}</span>
            <span class="text-gray-900">{{ formatPrice(course.price) }}</span>
          </div>
          
          <div v-if="course.discount && course.discount > 0" class="flex justify-between text-sm">
            <span class="text-gray-600">{{ $t('courseDetail.courseDiscount') }}</span>
            <span class="text-green-600">-{{ course.discount }}%</span>
          </div>
          
          <div v-if="discountAmount > 0" class="flex justify-between text-sm">
            <span class="text-gray-600">{{ $t('courseDetail.codeDiscount') }}</span>
            <span class="text-green-600">-{{ formatPrice(discountAmount) }}</span>
          </div>
          
          <UDivider />
          
          <div class="flex justify-between text-lg font-semibold">
            <span class="text-gray-900">{{ $t('courseDetail.finalPriceLabel') }}</span>
            <span class="text-blue-600">{{ formatPrice(calculateFinalPrice()) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center">
          <UButton
            color="secondary"
            variant="ghost"
            @click="closeModal"
          >
            {{ $t('courseDetail.cancel') }}
          </UButton>
          
          <UButton
            @click="handleRegistration"
            :loading="loadingRegister"
            :disabled="loadingRegister"
            color="primary"
            variant="solid"
            class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {{ $t('courseDetail.finalizePurchase') }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { CourseDetail } from '~/types/course'

interface Props {
  course: CourseDetail
  modelValue: boolean
  loadingRegister?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loadingRegister: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  register: [discountCode: string | null]
  checkDiscount: [code: string]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const discountCode = ref('')
const discountAmount = ref(0)
const btnDiscountLoading = ref(false)

function formatPrice(amount: number) {
    if (amount === 0) return 'Free'
    return amount
}

const calculateFinalPrice = () => {
  let finalPrice = props.course.price
  
  // Apply course discount
  if (props.course.discount && props.course.discount > 0) {
    finalPrice = finalPrice - (finalPrice * props.course.discount / 100)
  }
  
  // Apply discount code
  finalPrice = Math.max(0, finalPrice - discountAmount.value)
  
  return Math.round(finalPrice)
}

const checkDiscountCode = async () => {
  if (!discountCode.value) return
  
  btnDiscountLoading.value = true
  emit('checkDiscount', discountCode.value)
  
  // Reset loading after a delay (you can remove this if you handle it in parent)
  setTimeout(() => {
    btnDiscountLoading.value = false
  }, 2000)
}

const handleRegistration = () => {
  emit('register', discountCode.value || null)
}

const closeModal = () => {
  isOpen.value = false
  discountCode.value = ''
  discountAmount.value = 0
}

// Watch for discount amount updates from parent
const updateDiscountAmount = (amount: number) => {
  discountAmount.value = amount
}

// Expose method for parent to call
defineExpose({
  updateDiscountAmount
})
</script>