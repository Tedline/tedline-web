<template>
  <footer class="bg-gray-50 mt-10 dark:bg-stone-900/80 border-t border-gray-200 dark:border-stone-800">
    <div class="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="flex items-center mb-4">
            <img class="h-8 w-auto" src="/images/icon2.png" alt="Tedline" />
          </div>
          <p class="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {{ $t('footer.description') }}
          </p>
          <!-- Social Media Links -->
          <div class="mt-6 flex gap-x-4">
            <!-- Telegram -->
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-[#0379e7] dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Telegram"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.89 8.9c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.12l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </a>
            <!-- Instagram -->
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-[#0379e7] dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.597-.012 2.957-.06 4.123-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0-2.957-.012-4.123-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.467.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 110 6.666 3.333 3.333 0 010-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"/>
              </svg>
            </a>
            <!-- LinkedIn -->
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-[#0379e7] dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd"/>
              </svg>
            </a>
            <!-- Twitter -->
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-[#0379e7] dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Twitter"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="lg:col-span-1">
          <h3 class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            {{ $t('footer.quickLinks') }}
          </h3>
          <ul role="list" class="mt-6 space-y-4">
            <li v-for="link in quickLinks" :key="link.name">
              <NuxtLinkLocale 
                :to="link.href"
                class="text-sm leading-6 text-gray-600 hover:text-[#0379e7] dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {{ link.name }}
              </NuxtLinkLocale>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div class="lg:col-span-1">
          <h3 class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            {{ $t('footer.resources') }}
          </h3>
          <ul role="list" class="mt-6 space-y-4">
            <li v-for="resource in resources" :key="resource.name">
              <NuxtLinkLocale 
                :to="resource.href"
                class="text-sm leading-6 text-gray-600 hover:text-[#0379e7] dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {{ resource.name }}
              </NuxtLinkLocale>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="lg:col-span-1">
          <h3 class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            {{ $t('footer.contact') }}
          </h3>
          <ul role="list" class="mt-6 space-y-4">
            <li class="flex items-start gap-x-3">
              <EnvelopeIcon class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <a 
                href="mailto:info@tedline.com" 
                class="text-sm leading-6 text-gray-600 hover:text-[#0379e7] dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
              >
                info@tedline.com
              </a>
            </li>
            <li class="flex items-start gap-x-3">
              <PhoneIcon class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <a 
                href="tel:+989123456789" 
                class="text-sm leading-6 text-gray-600 hover:text-[#0379e7] dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
              >
                +98 912 345 6789
              </a>
            </li>
            <li class="flex items-start gap-x-3">
              <MapPinIcon class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
              <span class="text-sm leading-6 text-gray-600 dark:text-gray-400">
                {{ $t('footer.address') }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 border-t border-gray-200 dark:border-stone-800 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} {{ $t('tedline') }}. {{ $t('footer.rights') }}
          </p>
          <div class="flex flex-wrap gap-6">
            <NuxtLinkLocale 
              v-for="legal in legalLinks" 
              :key="legal.name"
              :to="legal.href"
              class="text-xs leading-5 text-gray-500 hover:text-[#0379e7] dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {{ legal.name }}
            </NuxtLinkLocale>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
} from '@heroicons/vue/24/outline';

const { t } = useI18n();

const quickLinks = computed(() => [
  { name: t('home'), href: '/' },
  { name: t('explore.title'), href: '/explore' },
  { name: t('navigation.home'), href: '/home' },
  { name: t('navigation.explore'), href: '/explore' },
]);

const resources = computed(() => [
  { name: t('explore.blogs'), href: '/blogs' },
  { name: t('footer.helpCenter'), href: '/contact' },
  { name: t('footer.faq'), href: '/contact' },
  { name: t('footer.support'), href: '/contact' },
]);

const legalLinks = computed(() => [
  { name: t('footer.privacy'), href: '/contact' },
  { name: t('footer.terms'), href: '/contact' },
  { name: t('footer.cookies'), href: '/contact' },
]);
</script>