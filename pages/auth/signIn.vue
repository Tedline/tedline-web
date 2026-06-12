<template>
    <div class="space-y-8">
        <div>
            <div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100 dark:bg-primary-950/40 dark:text-primary-300 dark:ring-primary-900/60">
                <UIcon :name="active_section === 'get_number' ? 'i-heroicons-device-phone-mobile' : 'i-heroicons-key'" class="h-6 w-6" />
            </div>

            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-xs font-semibold text-primary-600 dark:text-primary-300">
                        {{ active_section === 'get_number' ? $t('auth.login.phoneStepLabel') : $t('auth.common.verifyPhoneLabel') }}
                    </p>
                    <h1 class="mt-2 text-2xl font-black leading-9 text-gray-950 dark:text-white">
                        {{ active_section === 'get_number' ? $t('auth.login.title') : $t('auth.common.codeTitle') }}
                    </h1>
                </div>

                <UBadge color="neutral" variant="soft" class="shrink-0 rounded-full">
                    {{ active_section === 'get_number' ? $t('auth.common.stepOne') : $t('auth.common.stepTwo') }}
                </UBadge>
            </div>

            <p class="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                {{ active_section === 'get_number'
                    ? $t('auth.login.description')
                    : $t('auth.common.codeSentTo', { phone: phoneNumber }) }}
            </p>

            <div class="mt-6 grid grid-cols-2 gap-2">
                <div
                    class="h-1.5 rounded-full transition-colors"
                    :class="active_section === 'get_number' ? 'bg-primary-500' : 'bg-primary-300 dark:bg-primary-700'"
                />
                <div
                    class="h-1.5 rounded-full transition-colors"
                    :class="active_section === 'get_code' ? 'bg-primary-500' : 'bg-gray-200 dark:bg-neutral-800'"
                />
            </div>
        </div>

        <div v-if="active_section == 'get_number'">
            <LoginForm :phoneNumber="phoneNumber" :loading="loading"
                @update:phoneNumber="val => phoneNumber = val" @update:loading="val => loading = val"
                @loginSmsSent="onLoginSmsSent" />

            <div class="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{{ $t('auth.login.noAccount') }}</span>
                <UButton
                    to="/auth/signUp"
                    variant="link"
                    color="primary"
                    size="sm"
                    class="px-0 font-bold"
                >
                    {{ $t('auth.login.createAccount') }}
                </UButton>
            </div>
        </div>

        <div v-if="active_section == 'get_code'">
            <CodeEntry :phoneNumber="phoneNumber" :code="code" :loading="loading"
                @update:code="val => code = val" @update:loading="val => loading = val" @codeChecked="onCodeChecked" />

            <div v-if="isCountdownActive" class="mt-6 rounded-xl border border-primary-100 bg-primary-50/70 px-4 py-3 text-center text-sm font-medium text-primary-700 dark:border-primary-900/60 dark:bg-primary-950/30 dark:text-primary-300">
                {{ $t('auth.common.resendIn', { time: formattedCountdown }) }}
            </div>

            <div v-else class="mt-6 flex justify-center">
                <UButton
                    variant="soft"
                    color="primary"
                    icon="i-heroicons-arrow-path"
                    class="rounded-xl"
                    @click="resendLoginSms"
                >
                    {{ $t('auth.common.resend') }}
                </UButton>
            </div>

            <div class="mt-8">
                <UButton
                    variant="ghost"
                    color="neutral"
                    icon="i-heroicons-arrow-right"
                    class="rounded-xl"
                    @click="backToPhone"
                >
                    {{ $t('auth.common.changePhone') }}
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import LoginForm from '~/components/shared/auth/LoginForm.vue'
import CodeEntry from '~/components/shared/auth/CodeEntry.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const isCountdownActive = ref(false)
const countDownInterval = ref(null)
const countDownTime = ref(120) // 2 minutes in seconds
const active_section = ref('get_number')
const phoneNumber = ref('')
const code = ref('')
const loading = ref(false)

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const formattedCountdown = computed(() => `${Math.floor(countDownTime.value / 60)}:${('0' + countDownTime.value % 60).slice(-2)}`)

function startCooldown() {
    countDownInterval.value = setInterval(() => {
        if (countDownTime.value > 0) {
            countDownTime.value -= 1;
        } else {
            isCountdownActive.value = false;
            countDownTime.value = 120;
            clearInterval(countDownInterval.value);
        }
    }, 1000);
}

definePageMeta({
    layout: 'authentication'
})

useHead({
    title: t('auth.login.pageTitle'),
})

function onLoginSmsSent() {
    active_section.value = 'get_code';
    loading.value = false;
    countDownTime.value = 120;
    clearInterval(countDownInterval.value);
    isCountdownActive.value = true;
    startCooldown();
}

function onCodeChecked() {
    const redirectPath = route.query.next?.toString() || '/'
    router.push(redirectPath)
}

function resendLoginSms() {
    active_section.value = 'get_number';
}

function backToPhone() {
    active_section.value = 'get_number';
    code.value = '';
    isCountdownActive.value = false;
    countDownTime.value = 120;
    clearInterval(countDownInterval.value);
}

onUnmounted(() => {
    if (countDownInterval.value) {
        clearInterval(countDownInterval.value);
    }
})
</script>
