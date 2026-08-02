<script setup>
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'home',
})

const { t } = useI18n()
const api = useApi(false, '/api/v1/')

const form = reactive({
  name: '',
  email: '',
  body: '',
})

const fieldErrors = reactive({
  name: '',
  email: '',
  body: '',
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref('')

useSeoMeta({
  title: () => t('contactPage.metaTitle'),
  description: () => t('contactPage.description'),
})

const clearErrors = () => {
  fieldErrors.name = ''
  fieldErrors.email = ''
  fieldErrors.body = ''
  submitError.value = ''
}

const validate = () => {
  clearErrors()

  if (!form.name.trim()) fieldErrors.name = t('contactPage.validation.nameRequired')
  if (!form.email.trim()) {
    fieldErrors.email = t('contactPage.validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    fieldErrors.email = t('contactPage.validation.emailInvalid')
  }
  if (!form.body.trim()) fieldErrors.body = t('contactPage.validation.messageRequired')

  return !Object.values(fieldErrors).some(Boolean)
}

const submitForm = async () => {
  if (!validate()) return

  isSubmitting.value = true
  isSubmitted.value = false

  try {
    await api('account/contact/', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        body: form.body.trim(),
      },
    })

    form.name = ''
    form.email = ''
    form.body = ''
    isSubmitted.value = true
  } catch (error) {
    const status = error?.response?.status ?? error?.statusCode
    const data = error?.data ?? error?.response?._data

    for (const field of ['name', 'email', 'body']) {
      if (Array.isArray(data?.[field])) fieldErrors[field] = data[field][0]
    }

    if (status === 429) {
      submitError.value = t('contactPage.errors.rateLimited')
    } else if (!Object.values(fieldErrors).some(Boolean)) {
      submitError.value = t('contactPage.errors.general')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="relative isolate min-h-screen overflow-hidden bg-white pt-24 dark:bg-black sm:pt-28">
    <div class="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-gradient-to-b from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-black dark:to-black" />
    <div class="absolute -top-24 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />

    <section class="mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-16">
      <div class="mx-auto max-w-3xl text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0379e7] text-white shadow-lg shadow-blue-500/20">
          <ChatBubbleLeftRightIcon class="h-7 w-7" aria-hidden="true" />
        </div>
        <p class="mt-6 text-sm font-semibold text-[#0379e7] dark:text-blue-400">{{ t('contactPage.eyebrow') }}</p>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          {{ t('contactPage.title') }}
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
          {{ t('contactPage.description') }}
        </p>
      </div>

      <div class="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-900/5 dark:border-stone-800 dark:bg-stone-950 lg:grid-cols-[0.8fr_1.2fr]">
        <aside class="relative overflow-hidden bg-gray-950 p-8 text-white sm:p-10">
          <div class="absolute -bottom-24 -start-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div class="relative">
            <h2 class="text-xl font-semibold">{{ t('contactPage.detailsTitle') }}</h2>
            <p class="mt-3 text-sm leading-7 text-gray-300">{{ t('contactPage.detailsDescription') }}</p>

            <a href="mailto:info@tedline.com" class="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <EnvelopeIcon class="h-5 w-5" aria-hidden="true" />
              </span>
              <span class="min-w-0">
                <span class="block text-xs text-gray-400">{{ t('contactPage.emailLabel') }}</span>
                <span class="mt-1 block truncate text-sm font-medium" dir="ltr">info@tedline.com</span>
              </span>
            </a>
          </div>
        </aside>

        <div class="p-8 sm:p-10">
          <div v-if="isSubmitted" role="status" class="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircleIcon class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p class="font-semibold">{{ t('contactPage.successTitle') }}</p>
              <p class="mt-1 text-sm">{{ t('contactPage.successMessage') }}</p>
            </div>
          </div>

          <form novalidate class="space-y-6" @submit.prevent="submitForm">
            <div>
              <label for="contact-name" class="block text-sm font-medium text-gray-900 dark:text-gray-100">{{ t('contactPage.name') }}</label>
              <input id="contact-name" v-model="form.name" name="name" type="text" autocomplete="name" maxlength="200" :aria-invalid="Boolean(fieldErrors.name)" :aria-describedby="fieldErrors.name ? 'contact-name-error' : undefined" class="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-[#0379e7] focus:ring-2 focus:ring-blue-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white" :placeholder="t('contactPage.namePlaceholder')" />
              <p v-if="fieldErrors.name" id="contact-name-error" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ fieldErrors.name }}</p>
            </div>

            <div>
              <label for="contact-email" class="block text-sm font-medium text-gray-900 dark:text-gray-100">{{ t('contactPage.email') }}</label>
              <input id="contact-email" v-model="form.email" name="email" type="email" autocomplete="email" maxlength="200" dir="ltr" :aria-invalid="Boolean(fieldErrors.email)" :aria-describedby="fieldErrors.email ? 'contact-email-error' : undefined" class="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-[#0379e7] focus:ring-2 focus:ring-blue-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white" placeholder="name@example.com" />
              <p v-if="fieldErrors.email" id="contact-email-error" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ fieldErrors.email }}</p>
            </div>

            <div>
              <label for="contact-body" class="block text-sm font-medium text-gray-900 dark:text-gray-100">{{ t('contactPage.message') }}</label>
              <textarea id="contact-body" v-model="form.body" name="body" rows="6" :aria-invalid="Boolean(fieldErrors.body)" :aria-describedby="fieldErrors.body ? 'contact-body-error' : undefined" class="mt-2 block w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-[#0379e7] focus:ring-2 focus:ring-blue-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white" :placeholder="t('contactPage.messagePlaceholder')" />
              <p v-if="fieldErrors.body" id="contact-body-error" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ fieldErrors.body }}</p>
            </div>

            <p v-if="submitError" role="alert" class="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{{ submitError }}</p>

            <button type="submit" :disabled="isSubmitting" class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0379e7] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-stone-950">
              <span>{{ isSubmitting ? t('contactPage.sending') : t('contactPage.send') }}</span>
              <PaperAirplaneIcon v-if="!isSubmitting" class="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
              <span v-else class="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>
