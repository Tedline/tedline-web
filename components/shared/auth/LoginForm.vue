<template>
  <form @submit.prevent="sendLoginSms" class="space-y-6">
    <div >
      <label for="phone-number" class="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">{{$t('login.phoneNumber')}}</label>
      <div class="relative mt-2 rounded-xl ">
        <input
          type="text"
          name="phone-number"
          id="phone-number"
          :value="phoneNumber"
          @input="$emit('update:phoneNumber', $event.target.value)"
          class="block w-full rounded-xl border-0 py-1.5 px-3 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-zinc-900 ltr"
          :placeholder="$t('login.phonePlaceholder')"
        />
      </div>
      <div v-if="error">
        <p class="text-red-600 dark:text-red-400 text-xs pe-3 pt-3">{{ error }}</p>
      </div>
    </div>
    <div>
      <button type="submit" class="w-full rounded-xl bg-blue-600 dark:bg-blue-700 text-white py-1.5" :disabled="loading">
        {{$t('login.getCode')}}
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
  props: ['phoneNumber', 'error', 'loading'],
  emits: ['update:phoneNumber', 'loginSmsSent', 'error'],
  methods: {
    sendLoginSms() {
      if (this.phoneNumber) {
        const api = useApi();
        this.$emit('update:loading', true);
        api(`/api/v1/account/login-sms/${this.phoneNumber}/`, {
          method: 'POST',
        })
        .then(() => {
          this.$emit('loginSmsSent');
          this.$emit('update:loading', false);
        })
        .catch(() => {
          this.$emit('error', this.$t('login.noUserError'));
          this.$emit('update:loading', false);
        });
      } else {
        this.$emit('error', this.$t('login.noPhoneError'));
      }
    }
  }
}
</script>
