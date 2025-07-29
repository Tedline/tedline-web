<template>
    <div>
        <div v-if="active_section == 'register'">
            <SignupForm :first_name="first_name" :last_name="last_name" :email="email" :phoneNumber="phoneNumber"
                :loading="loading" @update:first_name="val => first_name = val"
                @update:last_name="val => last_name = val" @update:email="val => email = val"
                @update:phoneNumber="val => phoneNumber = val" @update:loading="val => loading = val"
                @signupSmsSent="onSignupSmsSent" />
            <div class="mt-10 pb-6 flex  flex-items-center">
                <p class=" text-sm text-center leading-6 ps-2 text-gray-500 ">
                    اکانت دارید؟
                </p>
                <p @click="active_section = 'get_number'"
                    class="font-semibold leading-6 ps-2  cursor-pointer text-indigo-600 hover:text-indigo-500">
                    وارد شوید</p>
            </div>
        </div>
        <div v-if="active_section == 'get_code_signup'">
            <SignupCodeEntry :phoneNumber="phoneNumber" :code="code" :loading="loading"
                @update:code="val => code = val" @update:loading="val => loading = val"
                @signupCodeChecked="onSignupCodeChecked" />
            <div v-if="isCountDownActive" class="text-indigo-500 flex  justify-center pt-5">
                {{ Math.floor(countDownTime / 60) }}:{{ ('0' + countDownTime % 60).slice(-2) }} تا ارسال مجدد
            </div>
            <div v-else class="text-indigo-600 flex cursor-pointer justify-center pt-5">
                <p @click="resendSignupSms">
                    ارسال مجدد
                </p>
            </div>
            <div class="mt-10 pb-6 flex ">
                <p @click="active_section = 'register'"
                    class="font-semibold cursor-pointer text-center leading-6 ps-2 text-indigo-600 hover:text-indigo-500">
                    برگشت</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import LoginForm from '~/components/shared/auth/LoginForm.vue'
import CodeEntry from '~/components/shared/auth/CodeEntry.vue'
import SignupForm from '~/components/shared/auth/SignupForm.vue'
import SignupCodeEntry from '~/components/shared/auth/SignupCodeEntry.vue'

export default {
    components: { ref, Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot, ExclamationTriangleIcon, LoginForm, CodeEntry, SignupForm, SignupCodeEntry },
    data() {
        return {
            isCountDownActive: false,
            countDownInterval: null,
            countDownTime: 120, // 2 minutes in seconds
            active_section: 'get_number',
            first_name: '',
            last_name: '',
            email: '',
            phoneNumber: '',
            code: '',
            loading: false,
        }
    },
    methods: {
        startCountDown() {
            this.countDownInterval = setInterval(() => {
                if (this.countDownTime > 0) {
                    this.countDownTime -= 1;
                } else {
                    this.isCountDownActive = false;
                    this.countDownTime = 120;
                    clearInterval(this.countDownInterval);
                }
            }, 1000);
        },
        onSignupSmsSent() {
            this.active_section = 'get_code_signup';
            this.loading = false;
            this.countDownTime = 120;
            clearInterval(this.countDownInterval);
            this.isCountDownActive = true;
            this.startCountDown();
        },
        onSignupCodeChecked() {
            this.$router.go(this.$router.currentRoute);
        },
        resendSignupSms() {
            this.active_section = 'register';
        },
    },
}
</script>
