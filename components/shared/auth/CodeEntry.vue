<template>
  <form @submit.prevent="checkCode" class="space-y-6">
    <div >
      <div class="flex justify-center mt-2 rounded-xl shadow-sm">
        <UPinInput
          size="xl"
          :length="5"
          v-model="codeValue"
          otp
        />
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
  props: ['phoneNumber', 'code', 'loading'],
  emits: ['update:code', 'codeChecked', 'update:loading'],
  computed: {
    codeValue: {
      get() {
        return this.code;
      },
      set(value) {
        this.$emit('update:code', value);
      }
    }
  },
  methods: {
    checkCode() {
      const toast = useToast();
      
      if (this.code && this.code.length === 5) {
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
          toast.add({
            title: 'خطا',
            description: 'کد معتبر نیست',
            color: 'red',
            icon: 'i-heroicons-exclamation-triangle'
          });
          this.$emit('update:loading', false);
        });
      } else {
        toast.add({
          title: 'خطا',
          description: 'کد 5 رقمی وارد نشده است',
          color: 'red',
          icon: 'i-heroicons-exclamation-triangle'
        });
      }
    }
  }
}
</script>
