<template>
    <div class="space-y-8">
        <div>
            <div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 dark:bg-primary-950/40 dark:text-primary-300 dark:ring-primary-900/60">
                <UIcon :name="activeSection === 'register' ? 'i-heroicons-user-plus' : 'i-heroicons-key'" class="h-6 w-6" />
            </div>

            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-xs font-semibold text-primary-600 dark:text-primary-300">
                        {{ activeSection === 'register' ? $t('auth.signup.stepLabel') : $t('auth.common.verifyPhoneLabel') }}
                    </p>
                    <h1 class="mt-2 text-2xl font-black leading-9 text-gray-950 dark:text-white">
                        {{ activeSection === 'register' ? $t('auth.signup.title') : $t('auth.common.codeTitle') }}
                    </h1>
                </div>

                <UBadge color="neutral" variant="soft" class="shrink-0 rounded-full">
                    {{ activeSection === 'register' ? $t('auth.common.stepOne') : $t('auth.common.stepTwo') }}
                </UBadge>
            </div>

            <p class="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                {{ activeSection === 'register'
                    ? $t('auth.signup.description')
                    : $t('auth.common.codeSentTo', { phone: phoneNumber }) }}
            </p>

            <div class="mt-6 grid grid-cols-2 gap-2">
                <div
                    class="h-1.5 rounded-full transition-colors"
                    :class="activeSection === 'register' ? 'bg-primary-500' : 'bg-primary-300 dark:bg-primary-700'"
                />
                <div
                    class="h-1.5 rounded-full transition-colors"
                    :class="activeSection === 'get_code_signup' ? 'bg-primary-500' : 'bg-gray-200 dark:bg-neutral-800'"
                />
            </div>
        </div>

        <form v-if="activeSection === 'register'" class="space-y-5" @submit.prevent="sendSignupSms">
            <div class="grid gap-4 sm:grid-cols-2">
                <UInput
                    v-model="firstName"
                    size="xl"
                    :placeholder="$t('auth.signup.firstName')"
                    autocomplete="given-name"
                    :ui="{
                        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 focus:ring-2 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-xl',
                        wrapper: 'relative block w-full',
                        icon: 'flex-shrink-0 h-4 w-4',
                        input: 'block w-full border-0 bg-transparent py-1.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6',
                        trailing: 'flex items-center'
                    }"
                >
                    <label class="pointer-events-none absolute right-0 -top-2.5 text-highlighted text-xs font-medium px-5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                        <span class="inline-flex bg-default px-1">{{ $t('auth.signup.firstName') }}</span>
                    </label>
                </UInput>
                <UInput
                    v-model="lastName"
                    size="xl"
                    :placeholder="$t('auth.signup.lastName')"
                    autocomplete="family-name"
                    :ui="{
                        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 focus:ring-2 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-xl',
                        wrapper: 'relative block w-full',
                        icon: 'flex-shrink-0 h-4 w-4',
                        input: 'block w-full border-0 bg-transparent py-1.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6',
                        trailing: 'flex items-center'
                    }"
                >
                    <label class="pointer-events-none absolute right-0 -top-2.5 text-highlighted text-xs font-medium px-5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
                        <span class="inline-flex bg-default px-1">{{ $t('auth.signup.lastName') }}</span>
                    </label>
                </UInput>
            </div>

            <div>
                <label for="signup-phone-number" class="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300 mb-2"></label>
                <UInput
                    id="signup-phone-number"
                    :value="phoneNumber"
                    @input="handlePhoneInput"
                    :placeholder="$t('login.phonePlaceholder')"
                    autocomplete="tel"
                    inputmode="numeric"
                    :error="phoneError"
                    class="w-full ltr"
                    size="xl"
                    :ui="{
                        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 focus:ring-2 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ps-18 rounded-xl',
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
                        <div class="flex items-center gap-2">
                            <img
                                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA5YzM5Ii8+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSI1LjMzMzMzIiB5PSI1LjMzMzMzIiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSI1LjMzMzMzIiB5PSIxMC42NjY3IiBmaWxsPSIjZDAxNDFkIi8+CjxyZWN0IHdpZHRoPSIxMiIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA5YzM5Ii8+CjxjaXJjbGUgY3g9IjYiIGN5PSI4IiByPSIyIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik02IDZMMTAgOEw2IDEwVjZaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPgo="
                                alt="Iran Flag"
                                class="w-5 h-4 rounded-sm"
                            />
                            <span class="font-medium text-gray-700 dark:text-gray-300">+98</span>
                        </div>
                    </template>
                </UInput>
                <p v-if="phoneError" class="mt-1 text-xs font-bold text-red-600 dark:text-red-400">{{ phoneError }}</p>
            </div>

            <UButton
                type="submit"
                size="lg"
                class="w-full justify-center rounded-xl"
                :loading="loading"
                :disabled="!canSubmitSignup"
            >
                {{ $t('auth.signup.submit') }}
            </UButton>

            <div class="flex items-center justify-center gap-2 pt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{{ $t('auth.signup.hasAccount') }}</span>
                <UButton
                    to="/auth/signIn"
                    variant="link"
                    color="primary"
                    size="sm"
                    class="px-0 font-bold"
                >
                    {{ $t('auth.signup.signIn') }}
                </UButton>
            </div>
        </form>

        <form v-if="activeSection === 'get_code_signup'" class="space-y-6" @submit.prevent="checkSignupCode">
            <div class="flex justify-center rounded-xl">
                <UPinInput
                    v-model="code"
                    size="xl"
                    :length="5"
                    otp
                />
            </div>

            <UButton
                type="submit"
                size="lg"
                class="w-full justify-center rounded-xl"
                :loading="loading"
                :disabled="codeValue.length !== 5"
            >
                {{ $t('auth.signup.confirmAndEnter') }}
            </UButton>

            <div v-if="isCountdownActive" class="rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-3 text-center text-sm font-medium text-primary-700 dark:border-primary-900/60 dark:bg-primary-950/30 dark:text-primary-300">
                {{ $t('auth.common.resendIn', { time: formattedCountdown }) }}
            </div>

            <div v-else class="flex justify-center">
                <UButton
                    variant="soft"
                    color="primary"
                    icon="i-heroicons-arrow-path"
                    class="rounded-xl"
                    :loading="loading"
                    @click="sendSignupSms"
                >
                    {{ $t('auth.common.resend') }}
                </UButton>
            </div>

            <UButton
                variant="ghost"
                color="neutral"
                icon="i-heroicons-arrow-right"
                class="rounded-xl"
                @click="backToRegister"
            >
                {{ $t('auth.common.changePhone') }}
            </UButton>
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useI18n()

const activeSection = ref('register')
const firstName = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const phoneError = ref('')
const code = ref([])
const loading = ref(false)
const isCountdownActive = ref(false)
const countDownInterval = ref(null)
const countDownTime = ref(120)
const next = ref(null)

const codeValue = computed(() => Array.isArray(code.value) ? code.value.join('') : String(code.value || ''))
const isValidPhone = computed(() => /^09\d{9}$/.test(phoneNumber.value))
const canSubmitSignup = computed(() => firstName.value.trim() && lastName.value.trim() && isValidPhone.value && !loading.value)
const formattedCountdown = computed(() => `${Math.floor(countDownTime.value / 60)}:${('0' + countDownTime.value % 60).slice(-2)}`)

definePageMeta({
    layout: 'authentication'
})

useHead({
    title: t('auth.signup.pageTitle'),
})

onMounted(() => {
    if (route.query.next != null) next.value = route.query.next
})

function handlePhoneInput(event) {
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 11)
    phoneNumber.value = value

    if (!value) {
        phoneError.value = ''
    } else if (!value.startsWith('09')) {
        phoneError.value = t('login.phoneFormatError')
    } else if (value.length !== 11) {
        phoneError.value = t('login.phoneLengthError')
    } else {
        phoneError.value = ''
    }
}

function startCountdown() {
    clearInterval(countDownInterval.value)
    countDownInterval.value = setInterval(() => {
        if (countDownTime.value > 0) {
            countDownTime.value -= 1
        } else {
            isCountdownActive.value = false
            countDownTime.value = 120
            clearInterval(countDownInterval.value)
        }
    }, 1000)
}

async function sendSignupSms() {
    if (!firstName.value.trim() || !lastName.value.trim()) {
        toast.add({
            title: t('auth.common.errorTitle'),
            description: t('auth.signup.nameRequired'),
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle'
        })
        return
    }

    if (!isValidPhone.value) {
        toast.add({
            title: t('auth.common.errorTitle'),
            description: phoneError.value || t('auth.signup.invalidPhone'),
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle'
        })
        return
    }

    const api = useApi(false)
    loading.value = true

    try {
        const body = new URLSearchParams()
        body.append('first_name', firstName.value)
        body.append('last_name', lastName.value)
        body.append('number', phoneNumber.value)

        await api('/account/sign-up-sms/', {
            method: 'POST',
            body,
        })

        activeSection.value = 'get_code_signup'
        code.value = []
        countDownTime.value = 120
        isCountdownActive.value = true
        startCountdown()
    } catch {
        toast.add({
            title: t('auth.common.errorTitle'),
            description: t('auth.signup.smsFailed'),
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle'
        })
    } finally {
        loading.value = false
    }
}

async function checkSignupCode() {
    if (codeValue.value.length !== 5) {
        toast.add({
            title: t('auth.common.errorTitle'),
            description: t('auth.common.codeLengthError'),
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle'
        })
        return
    }

    const api = useApi(false)
    loading.value = true

    try {
        const body = new URLSearchParams()
        body.append('number', phoneNumber.value)
        body.append('code', codeValue.value)

        const response = await api('/account/code-check-sign-up/', {
            method: 'POST',
            body,
        })

        const userStore = useUserStore()
        userStore.setToken(
            response.access_token || response.token,
            response.refresh_token || response.refresh || '',
            response.username,
            response.status || ''
        )

        if (next.value != null) {
            router.push(`/course/${next.value}/?register=true`)
        } else {
            router.push('/')
        }
    } catch {
        toast.add({
            title: t('auth.common.errorTitle'),
            description: t('auth.common.invalidCode'),
            color: 'error',
            icon: 'i-heroicons-exclamation-triangle'
        })
    } finally {
        loading.value = false
    }
}

function backToRegister() {
    activeSection.value = 'register'
    code.value = []
    isCountdownActive.value = false
    countDownTime.value = 120
    clearInterval(countDownInterval.value)
}

onUnmounted(() => {
    clearInterval(countDownInterval.value)
})
</script>
