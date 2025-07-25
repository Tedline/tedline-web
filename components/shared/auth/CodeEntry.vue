<template>
  <form @submit.prevent="checkCode" class="space-y-6">
    <div >
      <div class="relative mt-2 rounded-xl shadow-sm">
        <input
          type="text"
          placeholder="کد پیامک شده"
          :value="code"
          @input="$emit('update:code', $event.target.value)"
          name="code"
          id="code"
          class="block w-full rounded-xl border-0 py-1.5 px-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 dark:bg-zinc-900 dark:text-gray-100 dark:ring-zinc-700 dark:placeholder:text-gray-400" />
      </div>
      <div v-if="error">
        <p class="text-red-600 text-xs pe-3 pt-3 dark:text-red-400">{{ error }}</p>
      </div>
    </div>
    <div>
      <UButton type="submit" class="w-full bg-blue-600 cursor-pointer justify-center rounded-xl" size="lg" :loading="loading">
        تایید
      </UButton>
      <div v-if="loading">
        <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin dark:text-gray-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  emits: ['update:code', 'codeChecked', 'error'],
  methods: {
    checkCode() {
      if (this.code) {
        const api = useApi();
        this.$emit('update:loading', true);
        api('/api/account/code_check/', {
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
          this.$emit('codeChecked');
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
