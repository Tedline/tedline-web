<template>
  <form @submit.prevent="sendLoginSms" class="space-y-6">
    <div>
      <label for="phone-number" class="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-300 mb-2"></label>
      <UInput
        id="phone-number"
        :value="phoneNumber"
        @input="handlePhoneInput"
        :placeholder="$t('login.phonePlaceholder')"
        :error="phoneError"
        class="w-full ltr"
        size="xl"
        :ui="{ 
          base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 focus:ring-2 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ps-18 rounded-xl',
          wrapper: 'relative block w-full',
          icon: 'flex-shrink-0 h-4 w-4',
          input: 'block w-full border-0 bg-transparent py-1.5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6 ltr',
          trailing: 'flex items-center'
        }"
      >
      <label class="pointer-events-none absolute right-0 -top-2.5 text-highlighted text-xs font-medium px-5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
      <span class="inline-flex bg-default px-1">{{$t('login.phoneNumber')}}</span>
    </label>
        <template #leading>
          <div class="flex items-center gap-2">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA5YzM5Ii8+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSI1LjMzMzMzIiB5PSI1LjMzMzMzIiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSI1LjMzMzMzIiB5PSIxMC42NjY3IiBmaWxsPSIjZDAxNDFkIi8+CjxyZWN0IHdpZHRoPSIxMiIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA5YzM5Ii8+CjxjaXJjbGUgY3g9IjYiIGN5PSI4IiByPSIyIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik02IDZMMTAgOEw2IDEwVjZaIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPgo=" 
              alt="Iran Flag" 
              class="w-5 h-4 rounded-sm"
            />
            <span class=" font-medium text-gray-700 dark:text-gray-300">+98</span>
          </div>
        </template>
      </UInput>
      <p v-if="phoneError" class="mt-1 text-xs font-bold text-red-600 dark:text-red-400">{{ phoneError }}</p>
    </div>
    <div>
      <UButton 
        type="submit" 
        class="w-full cursor-pointer justify-center rounded-xl" 
        size="lg" 
        :loading="loading"
        :disabled="!isValidPhone || !phoneNumber"
      >
        {{$t('login.getCode')}}
      </UButton>
    </div>
  </form>
</template>
<script>
import { useApi } from '~/composables/useApi';
export default {
  props: ['phoneNumber', 'loading'],
  emits: ['update:phoneNumber', 'loginSmsSent', 'update:loading'],
  data() {
    return {
      phoneError: ''
    }
  },
  computed: {
    isValidPhone() {
      return this.validateIranianPhone(this.phoneNumber);
    }
  },
  methods: {
    validateIranianPhone(phone) {
      if (!phone) return false;
      
      // Remove any non-digit characters
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Check if it starts with 09 and has exactly 11 digits
      const iranPhoneRegex = /^09\d{9}$/;
      
      if (!iranPhoneRegex.test(cleanPhone)) {
        return false;
      }
      
      return true;
    },
    
    handlePhoneInput(event) {
      let value = event.target.value;
      
      // Remove any non-English digit characters (including Persian/Arabic numbers)
      value = value.replace(/[^0-9]/g, '');
      
      // Limit to 11 digits
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
      
      
      // Validate and set error message
      if (value && value.replace(/\s/g, '').length > 0) {
        const cleanValue = value.replace(/\s/g, '');
        if (!cleanValue.startsWith('09')) {
          this.phoneError = this.$t('login.phoneFormatError');
        } else if (cleanValue.length !== 11) {
          this.phoneError = this.$t('login.phoneLengthError');
        } else {
          this.phoneError = '';
        }
      } else {
        this.phoneError = '';
      }
      
      this.$emit('update:phoneNumber', value);
    },
    
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
      
      if (!this.isValidPhone) {
        toast.add({
          title: 'خطا',
          description: this.$t('login.invalidPhoneError'),
          color: 'red',
          icon: 'i-heroicons-exclamation-triangle'
        });
        return;
      }
      
      const api = useApi();
      this.$emit('update:loading', true);
      
      // Clean the phone number for API call
      const cleanPhone = this.phoneNumber.replace(/\s/g, '');
      
      api(`/api/v1/account/login-sms/${cleanPhone}/`, {
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
