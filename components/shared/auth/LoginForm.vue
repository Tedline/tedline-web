<template>
  <form @submit.prevent="sendLoginSms" class="space-y-6">
    <PhoneNumberInput
      :model-value="phoneNumber"
      v-model:is-valid="phoneIsValid"
      v-model:error="phoneError"
      @update:model-value="$emit('update:phoneNumber', $event)"
    />
    <div>
      <UButton 
        type="submit" 
        class="w-full cursor-pointer justify-center rounded-xl" 
        size="lg" 
        :loading="loading"
        :disabled="!phoneIsValid || !phoneNumber"
      >
        {{$t('login.getCode')}}
      </UButton>
    </div>
  </form>
</template>
<script>
import { useApi } from '~/composables/useApi';
import PhoneNumberInput from '~/components/shared/auth/PhoneNumberInput.vue';
export default {
  components: {
    PhoneNumberInput
  },
  props: ['phoneNumber', 'loading'],
  emits: ['update:phoneNumber', 'loginSmsSent', 'update:loading'],
  data() {
    return {
      phoneError: '',
      phoneIsValid: false
    }
  },
  methods: {
    sendLoginSms() {
      const toast = useToast();
      
      if (!this.phoneNumber) {
        toast.add({
          title: 'خطا',
          description: this.$t('login.noPhoneError'),
          color: 'red',
          icon: 'i-heroicons-exclamation-triangle'
        });
        return;
      }
      
      if (!this.phoneIsValid) {
        toast.add({
          title: 'خطا',
          description: this.phoneError || this.$t('login.phoneFormatError'),
          color: 'red',
          icon: 'i-heroicons-exclamation-triangle'
        });
        return;
      }
      
      const api = useApi(false);
      this.$emit('update:loading', true);
      
      // Backend expects the national leading 0.
      const cleanPhone = `0${this.phoneNumber.replace(/\D/g, '')}`;
      
      api(`/v1/account/login-sms/${cleanPhone}/`, {
        method: 'POST',
      })
      .then(() => {
        this.$emit('loginSmsSent');
        this.$emit('update:loading', false);
      })
      .catch(() => {
        toast.add({
          title: 'خطا',
          description: this.$t('login.noUserError'),
          color: 'error',
          icon: 'i-heroicons-exclamation-triangle'
        });
        this.$emit('update:loading', false);
      });
    }
  }
}
</script>
