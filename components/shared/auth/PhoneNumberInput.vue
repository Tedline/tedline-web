<template>
  <div>
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300 mb-2"></label>
    <UInput
      :id="id"
      :value="modelValue"
      @input="handleInput"
      :placeholder="$t('login.phonePlaceholder')"
      autocomplete="tel"
      inputmode="numeric"
      :error="localError"
      class="w-full ltr"
      size="xl"
      :ui="{
        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 focus:ring-2 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ps-12 rounded-xl',
        wrapper: 'relative block w-full',
        icon: 'flex-shrink-0 h-4 w-4',
        input: 'block w-full border-0 bg-transparent py-1.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6 ltr',
        trailing: 'flex items-center'
      }"
    >
      <label class="pointer-events-none absolute right-0 -top-2.5 text-highlighted text-xs font-medium px-5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
        <span class="inline-flex bg-default px-1">{{ $t('login.phoneNumber') }}</span>
      </label>
      <template #leading>
        <span class="font-medium text-gray-700 dark:text-gray-300">+98</span>
      </template>
    </UInput>
    <p v-if="localError" class="mt-1 text-xs font-bold text-red-600 dark:text-red-400">{{ localError }}</p>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  id: {
    type: String,
    default: 'phone-number'
  },
  modelValue: {
    type: String,
    default: ''
  },
  isValid: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:isValid', 'update:error'])
const { t } = useI18n()

const localError = computed(() => props.error)

function normalizePhone(value) {
  return String(value || '')
    .replace(/[^0-9]/g, '')
    .replace(/^0(?=9)/, '')
    .slice(0, 10)
}

function validatePhone(value) {
  return /^9\d{9}$/.test(value)
}

function getPhoneError(value) {
  if (!value) return ''
  if (!value.startsWith('9')) return t('login.phoneFormatError')
  if (value.length !== 10) return t('login.phoneLengthError')
  return ''
}

function syncPhone(value) {
  const normalizedValue = normalizePhone(value)
  const error = getPhoneError(normalizedValue)

  emit('update:modelValue', normalizedValue)
  emit('update:error', error)
  emit('update:isValid', validatePhone(normalizedValue))

  return normalizedValue
}

function handleInput(event) {
  event.target.value = syncPhone(event.target.value)
}

watch(
  () => props.modelValue,
  value => {
    const normalizedValue = normalizePhone(value)
    const error = getPhoneError(normalizedValue)

    if (normalizedValue !== value) {
      emit('update:modelValue', normalizedValue)
    }

    emit('update:error', error)
    emit('update:isValid', validatePhone(normalizedValue))
  },
  { immediate: true }
)
</script>
