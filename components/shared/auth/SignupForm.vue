<template>
  <form @submit.prevent="sendSignupSms" class="space-y-6">
    <div class="sm:col-span-3">
      <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">نام</label>
      <div class="mt-2">
        <input type="text" name="first-name" id="first-name" :value="first_name" autocomplete="given-name"
          @input="$emit('update:first_name', $event.target.value)"
          class="block w-full rounded-full border-0 py-1.5 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 " />
      </div>
    </div>
    <div class="sm:col-span-3">
      <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">نام خانوادگی</label>
      <div class="mt-2">
        <input type="text" name="last-name" id="last-name" :value="last_name" autocomplete="family-name"
          @input="$emit('update:last_name', $event.target.value)"
          class="block w-full rounded-full border-0 py-1.5 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 " />
      </div>
    </div>
    <div class="sm:col-span-3">
      <label for="email" class="block text-sm font-medium leading-6 text-gray-900">ایمیل</label>
      <div class="mt-2">
        <input type="email" name="email" id="email" :value="email" autocomplete="email"
          @input="$emit('update:email', $event.target.value)"
          class="block w-full rounded-full border-0 py-1.5 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 " />
      </div>
    </div>
    <div class="ltr">
      <label for="phone-number" class="block text-sm font-medium leading-6 text-gray-900">شماره موبایل</label>
      <div class="relative mt-2 rounded-full shadow-sm">
        <input type="text" name="phone-number" id="phone-number"
          :value="phoneNumber"
          @input="$emit('update:phoneNumber', $event.target.value)"
          class="block w-full rounded-full border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 "
          placeholder="09 -- -- -- -- -- -- --" />
      </div>
    </div>
    <div>
      <button type="submit" class="w-full" :disabled="loading">
        دریافت کد
      </button>
      <div v-if="loading">
        <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#E5E7EB" />
          <path fill="currentColor" />
        </svg>
      </div>
    </div>
  </form>
</template>
<script>
import { useApi } from '~/composables/useApi';
export default {
  props: ['first_name', 'last_name', 'email', 'phoneNumber', 'loading'],
  emits: ['update:first_name', 'update:last_name', 'update:email', 'update:phoneNumber', 'signupSmsSent', 'update:loading'],
  methods: {
    sendSignupSms() {
      const toast = useToast();
      
      if (this.phoneNumber) {
        const api = useApi();
        this.$emit('update:loading', true);
        api('/api/account/sign-up-sms/', {
          method: 'POST',
          body: {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            number: this.phoneNumber
          },
        })
        .then(() => {
          this.$emit('signupSmsSent');
          this.$emit('update:loading', false);
        })
        .catch(() => {
          toast.add({
            title: 'خطا',
            description: 'ارسال پیامک ثبت نام ناموفق بود',
            color: 'red',
            icon: 'i-heroicons-exclamation-triangle'
          });
          this.$emit('update:loading', false);
        });
      } else {
        toast.add({
          title: 'خطا',
          description: 'شماره موبایل وارد نشده است',
          color: 'red',
          icon: 'i-heroicons-exclamation-triangle'
        });
      }
    }
  }
}
</script>
