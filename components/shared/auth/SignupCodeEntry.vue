<template>
  <form @submit.prevent="checkSignupCode" class="space-y-6">
    <div class="ltr">
      <div class="relative mt-2 rounded-lg">
        <input
          type="text"
          placeholder="کد پیامک شده"
          :value="code"
          @input="$emit('update:code', $event.target.value)"
          name="code"
          id="code"
          class="block w-full rounded-lg border-0 py-1.5 px-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 "
        />
      </div>
      <div v-if="error">
        <p class="text-red-600 text-xs pe-3 pt-3">{{ error }}</p>
      </div>
    </div>
    <div>
      <button type="submit" class="w-full rounded-lg bg-blue-600 text-white py-2" :disabled="loading">
        تایید
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
import { useUserStore } from '~/store/user';
import { useApi } from '~/composables/useApi';
export default {
  props: ['phoneNumber', 'code', 'error', 'loading'],
  emits: ['update:code', 'signupCodeChecked', 'error'],
  methods: {
    checkSignupCode() {
      if (this.code) {
        const api = useApi();
        this.$emit('update:loading', true);
        api('/api/account/code-check-sign-up/', {
          method: 'POST',
          body: { number: this.phoneNumber, code: this.code },
        })
        .then(response => {
          const userStore = useUserStore();
          userStore.setToken(
            response.access_token,
            response.refresh_token,
            response.username,
            response.status
          );
          this.$emit('signupCodeChecked');
          this.$emit('update:loading', false);
        })
        .catch(() => {
          this.$emit('error', 'کد معتبر نیست');
          this.$emit('update:loading', false);
        });
      } else {
        this.$emit('error', 'کد وارد نشده است');
      }
    }
  }
}
</script>
