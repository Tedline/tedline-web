<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import {
    Dialog,
    Popover,
    DialogPanel,
    PopoverGroup,
    PopoverButton,
    PopoverPanel,
} from "@headlessui/vue";
import {
    Bars3Icon,
    SquaresPlusIcon,
    XMarkIcon,
    AcademicCapIcon,
    BookOpenIcon,
    PlayCircleIcon,
    LifebuoyIcon,
    PhoneIcon,
    CalendarIcon,
    ChartPieIcon,
    ArrowLeftStartOnRectangleIcon,
    ArrowRightEndOnRectangleIcon,
    UserPlusIcon,
    HomeIcon,
    DocumentTextIcon,
} from "@heroicons/vue/24/outline";
import {
    ChevronDownIcon,

} from "@heroicons/vue/20/solid";
import { useRoute, useRouter } from "vue-router";
import NotificationBell from '~/components/notifications/NotificationBell.vue'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const { t } = useI18n()

// Props
const props = defineProps({
    hideUntilScroll: {
        type: Boolean,
        default: false
    }
});

// محصولات مربوط به آموزش آنلاین
const products = [
    {
        name: "header.products.courses.name",
        description: "header.products.courses.description",
        href: "/explore?tab=courses",
        icon: AcademicCapIcon,
    },
    {
        name: "header.products.webinars.name",
        description: "header.products.webinars.description",
        href: "/webinars",
        icon: PlayCircleIcon,
    },
    {
        name: "header.products.helpdesk.name",
        description: "header.products.helpdesk.description",
        href: "/helpdesk",
        icon: LifebuoyIcon,
    },
    {
        name: "header.products.categories.name",
        description: "header.products.categories.description",
        href: "/explore?tab=courses",
        icon: SquaresPlusIcon,
    },
];

const callsToAction = [
    { name: "header.support", href: "#", icon: PhoneIcon },
];

const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const isLoginOpen = ref(false);

const route = useRoute();

const pathname = computed(() => route.path);

const handleScroll = () => {
    isScrolled.value = window.scrollY > 80;
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
    if (userStore.isAuthenticated) {
        notificationStore.startPolling()
    }
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});

function openLogin() {
    isLoginOpen.value = true;
}
function closeLogin() {
    isLoginOpen.value = false;
}

async function handleLogout() {
    mobileMenuOpen.value = false;
    notificationStore.stopPolling();
    await userStore.logout();
    navigateTo('/');
}
</script>

<template>
    <header 
    :class="[
        'fixed transition-all duration-500 z-50 w-full',
        isScrolled
            ? 'bg-white border-b-1 border-gray-100  dark:backdrop-blur-lg dark:bg-black/60 dark:border-neutral-700/40 dark:shadow-xl'
            : hideUntilScroll ? 'sr-only border-gray-50/10 dark:border-gray-900/10' : 'border-gray-50 dark:border-gray-900/10',
    ]">
        <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 py-3 lg:px-8" :aria-label="t('header.globalNavigation')">
            <div class="flex lg:flex-1 rtl:float-left ltr:float-right" :class="{ 'lg:hidden': userStore.isAuthenticated }">
                <a href="#" class="-m-1.5 p-1.5">
                    <span class="sr-only">{{ t('header.company') }}</span>
                    <img class="h-8 w-auto" src="/images/icon2.png" alt="" />
                </a>
            </div>

            <div class="flex items-center gap-3 lg:hidden rtl:float-left ltr:float-right">
                <NotificationBell
                    v-if="userStore.isAuthenticated"
                    mode="click"
                    placement="header"
                />
                <button type="button"
                    class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                    @click="mobileMenuOpen = true">
                    <span class="sr-only">{{ t('header.openMenu') }}</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <PopoverGroup class="hidden lg:flex lg:gap-x-12 rtl:float-left ltr:float-right ">
                <Popover class="relative">
                    <PopoverButton
                        class="flex items-center gap-x-1 text-sm leading-6 focus:ring-0 focus:border-0 focus:outline-none text-gray-900 dark:text-gray-100">
                        {{ t('header.services') }}
                        <ChevronDownIcon class="h-5 w-5 flex-none text-gray-400 dark:text-gray-200" aria-hidden="true" />
                    </PopoverButton>

                    <Transition enter-active-class="transition ease-out duration-200"
                        enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition ease-in duration-150"
                        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                        <PopoverPanel
                            v-slot="{ close }"
                            class="absolute top-full z-10 mt-3 w-[calc(100vw-2rem)]  max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ltr:left-0 rtl:right-0 dark:bg-stone-900">
                            <div class="p-4 ">
                                <div v-for="item in products" :key="item.name"
                                    class="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-black/10 ">
                                    <div
                                        class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-stone-800 dark:group-hover:bg-stone-900">
                                        <component :is="item.icon"
                                            class="h-6 w-6 text-gray-600 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-white"
                                            aria-hidden="true" />
                                    </div>
                                    <div class="flex-auto">
                                        <NuxtLinkLocale :to="item.href" @click="close()" class="block font-semibold text-gray-900 dark:text-gray-100 relative">
                                            {{ t(item.name) }}
                                            <span class="absolute inset-0"></span>
                                        </NuxtLinkLocale>
                                        <p class="mt-1 text-gray-600 dark:text-gray-300">{{ t(item.description) }}</p>
                                    </div>
                                </div>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>

                <NuxtLinkLocale to="/explore?tab=blogs"
                active-class="text-[#0379e7] dark:text-blue-400"
                :class="[
                    'text-sm  leading-6','text-gray-900 dark:text-gray-100',
                ]">
                    {{ t('header.blog') }}
                </NuxtLinkLocale>

                <NuxtLinkLocale to="/terms" active-class="text-[#0379e7] dark:text-blue-400"
                :class="[
                    'text-sm  leading-6','text-gray-900 dark:text-gray-100',
                ]">
                    {{ t('footer.terms') }}
                </NuxtLinkLocale>

                <NuxtLinkLocale to="/contact" active-class="text-[#0379e7] dark:text-blue-400"
                :class="[
                    'text-sm  leading-6','text-gray-900 dark:text-gray-100',
                ]">
                    {{ t('header.contact') }}
                </NuxtLinkLocale>

                <NuxtLinkLocale to="/" active-class="text-[#0379e7] dark:text-blue-400"
                :class="[
                    'text-sm  leading-6','text-gray-900 dark:text-gray-100',
                ]">
                    {{ t('header.home') }}
                </NuxtLinkLocale>
            </PopoverGroup>

            <div v-if="!userStore.isAuthenticated" class="hidden lg:flex lg:flex-1 items-center lg:justify-end rtl:float-left ltr:float-right" >
                <NuxtLinkLocale to="/auth/signIn" @click.prevent="openLogin"
                    class="rounded-xl bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0379e7] dark:bg-blue-600 dark:hover:bg-gray-700">
                    {{ t('auth.login.pageTitle') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale to="/auth/signUp" class="text-sm font-semibold mx-3 leading-6 text-gray-900 dark:text-gray-100">
                    {{ t('auth.signup.pageTitle') }}
                </NuxtLinkLocale>
            </div>
            <div v-else class="hidden lg:flex lg:flex-1 items-center lg:justify-end rtl:float-left ltr:float-right">
                <a href="#" class="-m-1.5 p-1.5">
                    <span class="sr-only">{{ t('header.company') }}</span>
                    <img class="h-8 w-auto" src="/images/icon2.png" alt="" />
                </a>
            </div>
        </nav>

        <!-- Mobile Menu Dialog -->
        <Dialog v-model="mobileMenuOpen" :open="mobileMenuOpen" class="lg:hidden" as="div" @close="mobileMenuOpen = false">
            <div class="fixed inset-0 z-10" aria-hidden="true" />
            <DialogPanel
                class="fixed inset-y-0 right-0 z-10 flex w-full flex-col justify-between overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:ring-gray-700/50 rtl:left-0 rtl:right-auto ltr:right-0">
                <div class="p-6">
                    <div class="flex items-center justify-between">
                        <NuxtLinkLocale to="/" class="-m-1.5 p-1.5" @click="mobileMenuOpen = false">
                            <span class="sr-only">{{ t('header.company') }}</span>
                            <img class="h-8 w-auto" src="/images/icon2.png" alt="Tedline" />
                        </NuxtLinkLocale>
                        <div class="flex items-center gap-2">
                            <SharedLanguageToggle class="rounded-xl px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-gray-700/60 transition-colors" />
                            <SharedDarkMode class="rounded-xl p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-gray-700/60 transition-colors flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5" />
                            <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                                @click="mobileMenuOpen = false">
                                <span class="sr-only">{{ t('header.closeMenu') }}</span>
                                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                    <div class="mt-6 flow-root">
                        <div class="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700/50">
                            <div class="space-y-2 py-6">
                                <NuxtLinkLocale v-for="item in products" :key="item.name" :to="item.href"
                                    @click="mobileMenuOpen = false"
                                    class="group -mx-3 flex items-center gap-x-6 rounded-lg p-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    <div
                                        class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-900">
                                        <component :is="item.icon"
                                            class="h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-blue-400"
                                            aria-hidden="true" />
                                    </div>
                                    {{ t(item.name) }}
                                </NuxtLinkLocale>
                            </div>
                            <div class="space-y-2 py-6">
                                <NuxtLinkLocale to="/"
                                    @click="mobileMenuOpen = false"
                                    class="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    <HomeIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    <span>{{ t('header.home') }}</span>
                                </NuxtLinkLocale>
                                <NuxtLinkLocale to="/calendar"
                                    @click="mobileMenuOpen = false"
                                    class="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    <CalendarIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    <span>{{ t('header.calendar') }}</span>
                                </NuxtLinkLocale>
                                <NuxtLinkLocale to="/dashboard/reports"
                                    @click="mobileMenuOpen = false"
                                    class="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    <ChartPieIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    <span>{{ t('header.reports') }}</span>
                                </NuxtLinkLocale>
                                <NuxtLinkLocale to="/explore?tab=blogs"
                                    @click="mobileMenuOpen = false"
                                    class="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    <BookOpenIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    <span>{{ t('header.blog') }}</span>
                                </NuxtLinkLocale>
                                <NuxtLinkLocale to="/terms"
                                    @click="mobileMenuOpen = false"
                                    class="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    <DocumentTextIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    <span>{{ t('footer.terms') }}</span>
                                </NuxtLinkLocale>
                                <NuxtLinkLocale to="/contact"
                                    @click="mobileMenuOpen = false"
                                    class="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    <PhoneIcon class="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    <span>{{ t('header.contact') }}</span>
                                </NuxtLinkLocale>
                            </div>
                            <div class="py-6 space-y-2">
                                <template v-if="!userStore.isAuthenticated">
                                    <NuxtLinkLocale to="/auth/signIn"
                                        @click="mobileMenuOpen = false"
                                        class="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                        <ArrowRightEndOnRectangleIcon class="h-5 w-5 text-gray-500 dark:text-gray-400 rtl:rotate-180" aria-hidden="true" />
                                        <span>{{ t('auth.login.pageTitle') }}</span>
                                    </NuxtLinkLocale>
                                    <NuxtLinkLocale to="/auth/signUp"
                                        @click="mobileMenuOpen = false"
                                        class="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800">
                                        <UserPlusIcon class="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                        <span>{{ t('auth.signup.pageTitle') }}</span>
                                    </NuxtLinkLocale>
                                </template>
                                <template v-else>
                                    <button
                                        type="button"
                                        @click="handleLogout"
                                        class="-mx-3 flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30">
                                        <ArrowLeftStartOnRectangleIcon class="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
                                        <span>{{ t('header.logout') }}</span>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sticky bottom-0 border-t border-gray-200/50 bg-gray-50 text-center dark:border-gray-700/50 dark:bg-gray-800">
                    <a v-for="item in callsToAction" :key="item.name" :href="item.href"
                        class="flex items-center justify-center gap-x-2 p-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700">
                        <component :is="item.icon" class="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                        <span>{{ t(item.name) }}</span>
                    </a>
                </div>
            </DialogPanel>
        </Dialog>
    </header>
</template>
