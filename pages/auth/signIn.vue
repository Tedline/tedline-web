<template>
    <div>
        <div class="mb-10">
            <h1 class="text-2xl font-bold ms-2 dark:text-white">ورود</h1>
            <div class="mt-3 pb-6 flex rtl flex-items-center">
                <p class=" text-sm text-center leading-6 ps-2 text-gray-500 ">
                    اکانت ندارید؟
                </p>
                <p 
                    class="text-sm text-center cursor-pointer leading-6 ps-2 text-blue-600 hover:text-blue-500">
                    ثبت نام کنید</p>
            </div>
        </div>
        <div v-if="active_section == 'get_number'">
            <LoginForm :phoneNumber="phoneNumber" :error="error" :loading="loading"
                @update:phoneNumber="val => phoneNumber = val" @update:loading="val => loading = val"
                @loginSmsSent="onLoginSmsSent" @error="onError" />
            
        </div>
        <div v-if="active_section == 'get_code'">
            <CodeEntry :phoneNumber="phoneNumber" :code="code" :error="error" :loading="loading"
                @update:code="val => code = val" @update:loading="val => loading = val" @codeChecked="onCodeChecked"
                @error="onError" />
            <div v-if="isCooldownActive" class="text-indigo-500 flex  justify-center pt-5">
                {{ Math.floor(cooldownTime / 60) }}:{{ ('0' + cooldownTime % 60).slice(-2) }} تا ارسال مجدد
            </div>
            <div v-else class="text-indigo-600 flex cursor-pointer justify-center pt-5">
                <p @click="resendLoginSms">
                    ارسال مجدد
                </p>
            </div>
            <div class="mt-10 pb-6 flex ">
                <p @click="() => active_section = 'get_number'"
                    class="font-semibold text-center leading-6 cursor-pointer ps-2 text-blue-600 hover:text-blue-500">
                    برگشت</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import LoginForm from '~/components/shared/auth/LoginForm.vue'
import CodeEntry from '~/components/shared/auth/CodeEntry.vue'
import SignupForm from '~/components/shared/auth/SignupForm.vue'
import SignupCodeEntry from '~/components/shared/auth/SignupCodeEntry.vue'
import { useRouter } from 'vue-router'

const error = ref(null)
const isCooldownActive = ref(false)
const cooldownInterval = ref(null)
const cooldownTime = ref(120) // 2 minutes in seconds
const active_section = ref('get_number')
const phoneNumber = ref('')
const code = ref('')
const loading = ref(false)

const router = useRouter()

function startCooldown() {
    cooldownInterval.value = setInterval(() => {
        if (cooldownTime.value > 0) {
            cooldownTime.value -= 1;
        } else {
            isCooldownActive.value = false;
            cooldownTime.value = 120;
            clearInterval(cooldownInterval.value);
        }
    }, 1000);
}

definePageMeta({
    layout: 'authentication'
})

useHead({
    title: 'ورود',
})

function onLoginSmsSent() {
    active_section.value = 'get_code';
    loading.value = false;
    cooldownTime.value = 120;
    clearInterval(cooldownInterval.value);
    isCooldownActive.value = true;
    startCooldown();
}

function onCodeChecked() {
    router.go(router.currentRoute.value)
}

function onError(msg) {
    error.value = msg;
    loading.value = false;
}

function resendLoginSms() {
    active_section.value = 'get_number';
}

onUnmounted(() => {
    if (cooldownInterval.value) {
        clearInterval(cooldownInterval.value);
    }
})
</script>

