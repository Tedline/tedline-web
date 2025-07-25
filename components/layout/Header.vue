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
    ChartPieIcon,
    SquaresPlusIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    ArrowPathIcon,
    XMarkIcon,
    AcademicCapIcon,
    BookOpenIcon,
    PlayCircleIcon,
    UserGroupIcon,
    PhoneIcon,
} from "@heroicons/vue/24/outline";
import {
    ChevronDownIcon,

} from "@heroicons/vue/20/solid";
import { useRoute, useRouter } from "vue-router";

// محصولات مربوط به آموزش آنلاین
const products = [
    {
        name: "دوره‌های آموزشی",
        description: "دسترسی به انواع دوره‌های آنلاین",
        href: "#",
        icon: AcademicCapIcon,
    },
    {
        name: "وبینارها",
        description: "شرکت در وبینارهای تخصصی",
        href: "#",
        icon: PlayCircleIcon,
    },
    {
        name: "کتابخانه منابع",
        description: "مطالعه کتاب‌ها و مقالات آموزشی",
        href: "#",
        icon: BookOpenIcon,
    },
    {
        name: "مدرسان",
        description: "آشنایی با اساتید و مدرسان دوره‌ها",
        href: "#",
        icon: UserGroupIcon,
    },
    {
        name: "دسته‌بندی‌ها",
        description: "جستجو بر اساس موضوعات مختلف آموزشی",
        href: "#",
        icon: SquaresPlusIcon,
    },
];

const callsToAction = [
    { name: "تماس با پشتیبانی", href: "#", icon: PhoneIcon },
    { name: "مشاهده دموی سایت", href: "#", icon: PlayCircleIcon },
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
</script>

<template>
    <header 
    :class="[
        'fixed transition-all duration-500 z-50 w-full',
        isScrolled
            ? 'bg-white border-b-1 border-gray-100 dark:bg-black dark:border-neutral-900 dark:shadow-xl'
            : 'border-gray-50 dark:border-gray-900',
    ]">
        <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 py-4 lg:px-8" aria-label="Global">
            <div class="flex lg:flex-1 rtl:float-left ltr:float-right">
                <a href="#" class="-m-1.5 p-1.5">
                    <span class="sr-only">Tedline</span>
                    <img class="h-8 w-auto" src="/images/icon2.png" alt="" />
                </a>
            </div>

            <div class="flex lg:hidden rtl:float-left ltr:float-right">
                <button type="button"
                    class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                    @click="mobileMenuOpen = true">
                    <span class="sr-only">Open main menu</span>
                    <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
            </div>

            <PopoverGroup class="hidden lg:flex lg:gap-x-12 rtl:float-left ltr:float-right">
                <Popover class="relative">
                    <PopoverButton
                        class="flex items-center gap-x-1 text-sm font-semibold leading-6 focus:ring-0 focus:border-0 focus:outline-none text-gray-900 dark:text-gray-100">
                        ابزار ها
                        <ChevronDownIcon class="h-5 w-5 flex-none text-gray-400 dark:text-gray-300" aria-hidden="true" />
                    </PopoverButton>

                    <Transition enter-active-class="transition ease-out duration-200"
                        enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition ease-in duration-150"
                        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                        <PopoverPanel
                            class="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-900 dark:ring-gray-700/50 rtl:left-8 ltr:-left-8">
                            <div class="p-4">
                                <div v-for="item in products" :key="item.name"
                                    class="group relative flex gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <div
                                        class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-900">
                                        <component :is="item.icon"
                                            class="h-6 w-6 text-gray-600 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400"
                                            aria-hidden="true" />
                                    </div>
                                    <div class="flex-auto">
                                        <a :href="item.href" class="block font-semibold text-gray-900 dark:text-gray-100 relative">
                                            {{ item.name }}
                                            <span class="absolute inset-0"></span>
                                        </a>
                                        <p class="mt-1 text-gray-600 dark:text-gray-300">{{ item.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>

                <router-link to="/blogs" :class="[
                    'text-sm font-semibold leading-6',
                    pathname === '/blogs'
                        ? 'text-[#0379e7] dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100',
                ]">
                    وبلاگ
                </router-link>

                <router-link to="/contact" :class="[
                    'text-sm font-semibold leading-6',
                    pathname === '/contact'
                        ? 'text-[#0379e7] dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100',
                ]">
                    تماس با ما
                </router-link>

                <router-link to="/" :class="[
                    'text-sm font-semibold leading-6',
                    pathname === '/'
                        ? 'text-[#0379e7] dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100',
                ]">
                    صفحه ی اصلی
                </router-link>
            </PopoverGroup>

            <div class="hidden lg:flex lg:flex-1 items-center lg:justify-end rtl:float-left ltr:float-right">
                <nuxt-link to="/auth/signIn" @click.prevent="openLogin"
                    class="rounded-xl bg-gray-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0379e7] dark:bg-blue-600 dark:hover:bg-gray-700">
                    ورود
                </nuxt-link>
                <a href="#" class="text-sm font-semibold mx-3 leading-6 text-gray-900 dark:text-gray-100">
                    ثبت نام
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
                        <a href="#" class="-m-1.5 p-1.5">
                            <span class="sr-only">Your Company</span>
                            <img class="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                        </a>
                        <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                            @click="mobileMenuOpen = false">
                            <span class="sr-only">Close menu</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div class="mt-6 flow-root">
                        <div class="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700/50">
                            <div class="space-y-2 py-6">
                                <a v-for="item in products" :key="item.name" :href="item.href"
                                    class="group -mx-3 flex items-center gap-x-6 rounded-lg p-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    <div
                                        class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-800 dark:group-hover:bg-gray-900">
                                        <component :is="item.icon"
                                            class="h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-blue-400"
                                            aria-hidden="true" />
                                    </div>
                                    {{ item.name }}
                                </a>
                            </div>
                            <div class="space-y-2 py-6">
                                <a href="#"
                                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    Features
                                </a>
                                <a href="#"
                                    class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    Marketplace
                                </a>
                            </div>
                            <div class="py-6">
                                <a href="#"
                                    class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sticky bottom-0 grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 text-center dark:divide-gray-700/50 dark:bg-gray-800">
                    <a v-for="item in callsToAction" :key="item.name" :href="item.href"
                        class="p-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700">
                        {{ item.name }}
                    </a>
                </div>
            </DialogPanel>
        </Dialog>
    </header>
</template>

