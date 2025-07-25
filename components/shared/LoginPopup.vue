<template>
    <!-- login popup -->
    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed z-50 inset-0 bg-black/80 backdrop-blur-sm bg-opacity-75 transition-opacity" />
    </TransitionChild>
    <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                leave-from="opacity-100 translate-y-0 sm:scale-100"
                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <DialogPanel
                    class="relative text-right rtl transform overflow-hidden rounded-[25px] bg-white  shadow-xl transition-all w-full lg:my-8 lg:w-full lg:max-w-lg">
                    <!-- Your content -->
                    <div v-if="dialog_page == 'get_number'">
                        <LoginForm
                            :phoneNumber="phoneNumber"
                            :error="error"
                            :loading="loading"
                            @update:phoneNumber="val => phoneNumber = val"
                            @update:loading="val => loading = val"
                            @loginSmsSent="onLoginSmsSent"
                            @error="onError"
                        />
                        <div class="mt-10 pb-6 flex rtl flex-items-center">
                            <p class=" text-sm text-center leading-6 ps-2 text-gray-500 ">
                                اکانت ندارید؟
                            </p>
                            <p @click="dialog_page = 'register'"
                                class="font-semibold text-sm text-center cursor-pointer leading-6 ps-2 text-indigo-600 hover:text-indigo-500">
                                ثبت نام کنید</p>
                        </div>
                    </div>
                    <div v-if="dialog_page == 'get_code'">
                        <CodeEntry
                            :phoneNumber="phoneNumber"
                            :code="code"
                            :error="error"
                            :loading="loading"
                            @update:code="val => code = val"
                            @update:loading="val => loading = val"
                            @codeChecked="onCodeChecked"
                            @error="onError"
                        />
                        <div v-if="isCooldownActive" class="text-indigo-500 flex  justify-center pt-5">
                            {{ Math.floor(cooldownTime / 60) }}:{{ ('0' + cooldownTime % 60).slice(-2) }} تا ارسال مجدد
                        </div>
                        <div v-else class="text-indigo-600 flex cursor-pointer justify-center pt-5">
                            <p @click="resendLoginSms">
                                ارسال مجدد
                            </p>
                        </div>
                        <div class="mt-10 pb-6 flex ">
                            <p @click="dialog_page = 'get_number'"
                                class="font-semibold text-center leading-6 cursor-pointer ps-2 text-indigo-600 hover:text-indigo-500">
                                برگشت</p>
                        </div>
                    </div>
                    <div v-if="dialog_page == 'register'">
                        <SignupForm
                            :first_name="first_name"
                            :last_name="last_name"
                            :email="email"
                            :phoneNumber="phoneNumber"
                            :error="error"
                            :loading="loading"
                            @update:first_name="val => first_name = val"
                            @update:last_name="val => last_name = val"
                            @update:email="val => email = val"
                            @update:phoneNumber="val => phoneNumber = val"
                            @update:loading="val => loading = val"
                            @signupSmsSent="onSignupSmsSent"
                            @error="onError"
                        />
                        <div class="mt-10 pb-6 flex  flex-items-center">
                            <p class=" text-sm text-center leading-6 ps-2 text-gray-500 ">
                                اکانت دارید؟
                            </p>
                            <p @click="dialog_page = 'get_number'"
                                class="font-semibold leading-6 ps-2  cursor-pointer text-indigo-600 hover:text-indigo-500">
                                وارد شوید</p>
                        </div>
                    </div>
                    <div v-if="dialog_page == 'get_code_signup'">
                        <SignupCodeEntry
                            :phoneNumber="phoneNumber"
                            :code="code"
                            :error="error"
                            :loading="loading"
                            @update:code="val => code = val"
                            @update:loading="val => loading = val"
                            @signupCodeChecked="onSignupCodeChecked"
                            @error="onError"
                        />
                        <div v-if="isCooldownActive" class="text-indigo-500 flex  justify-center pt-5">
                            {{ Math.floor(cooldownTime / 60) }}:{{ ('0' + cooldownTime % 60).slice(-2) }} تا ارسال مجدد
                        </div>
                        <div v-else class="text-indigo-600 flex cursor-pointer justify-center pt-5">
                            <p @click="resendSignupSms">
                                ارسال مجدد
                            </p>
                        </div>
                        <div class="mt-10 pb-6 flex ">
                            <p @click="dialog_page = 'register'"
                                class="font-semibold cursor-pointer text-center leading-6 ps-2 text-indigo-600 hover:text-indigo-500">
                                برگشت</p>
                        </div>
                    </div>
                </DialogPanel>
            </TransitionChild>
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
            error: null,
            isCooldownActive: false,
            cooldownInterval: null,
            cooldownTime: 120, // 2 minutes in seconds
            dialog_page: 'get_number',
            first_name: '',
            last_name: '',
            email: '',
            phoneNumber: '',
            code: '',
            loading: false,
        }
    },
    methods: {
        startCooldown() {
            this.cooldownInterval = setInterval(() => {
                if (this.cooldownTime > 0) {
                    this.cooldownTime -= 1;
                } else {
                    this.isCooldownActive = false;
                    this.cooldownTime = 120;
                    clearInterval(this.cooldownInterval);
                }
            }, 1000);
        },
        onLoginSmsSent() {
            this.dialog_page = 'get_code';
            this.loading = false;
            this.cooldownTime = 120;
            clearInterval(this.cooldownInterval);
            this.isCooldownActive = true;
            this.startCooldown();
        },
        onSignupSmsSent() {
            this.dialog_page = 'get_code_signup';
            this.loading = false;
            this.cooldownTime = 120;
            clearInterval(this.cooldownInterval);
            this.isCooldownActive = true;
            this.startCooldown();
        },
        onCodeChecked() {
            this.$router.go(this.$router.currentRoute);
        },
        onSignupCodeChecked() {
            this.$router.go(this.$router.currentRoute);
        },
        onError(msg) {
            this.error = msg;
            this.loading = false;
        },
        resendLoginSms() {
            this.dialog_page = 'get_number';
        },
        resendSignupSms() {
            this.dialog_page = 'register';
        },
    },
}
</script>
