<template>
  <form @submit.prevent="checkCode" class="space-y-6">
    <div >
      <div class="flex justify-center mt-2 rounded-xl ">
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
    </div>
  </form>
</template>
<script>
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
        api('/api/v1/account/login-code/', {
          method: 'POST',
          body: { number: this.phoneNumber, code: this.codeValue.join('') },
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
