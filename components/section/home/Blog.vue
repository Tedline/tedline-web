<template>
    <div class=" py-24 sm:py-10 mx-10">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="flex items-center justify-between">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                    آخرین مقالات
                </h2>
                <button class="mx-5 flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                    بیشتر
                    <svg
                        class="mr-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 12H5M12 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            <div
                class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 2xl:grid-cols-4"
            >
                <article
                    v-for="post in posts"
                    :key="post.id"
                    class="flex flex-col items-start justify-between"
                >
                    <div class="relative w-full">
                        <img
                            :src="post.imageUrl"
                            alt=""
                            class="aspect-[16/9] w-full rounded-2xl bg-gray-100 dark:bg-gray-800 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                        />
                        <div
                            class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10"
                        />
                    </div>

                    <div class="max-w-xl">
                        <div class="mt-8 flex items-center gap-x-4 text-xs">
                            <time :datetime="post.datetime" class="text-gray-500 dark:text-gray-400">
                                {{ post.date }}
                            </time>
                            <NuxtLink
                                :to="post.category.href"
                                class="relative z-10 rounded-full bg-gray-50 dark:bg-gray-800 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {{ post.category.title }}
                            </NuxtLink>
                        </div>

                        <div class="group relative">
                            <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300">
                                <NuxtLink :to="post.href">
                                    <span class="absolute inset-0" />
                                    {{ post.title }}
                                </NuxtLink>
                            </h3>
                            <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                                {{ post.description }}
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup>
const posts = [
    {
        id: 1,
        title: 'راهنمای انتخاب دوره آموزشی مناسب',
        href: '#',
        description:
            'در این مقاله با نکات مهم انتخاب دوره آموزشی مناسب آشنا شوید. از بررسی اعتبار مدرس تا روش‌های یادگیری مؤثر، همه چیز را بررسی می‌کنیم.',
        imageUrl: '/images/1.jpg',
        date: '10 اسفند 1402',
        datetime: '2024-02-29',
        category: { title: 'راهنمای آموزش', href: '#' },
        author: {
            name: 'رضا محمدی',
            role: 'متخصص آموزش',
            href: '#',
            imageUrl:
                'https://example.com',
        },
    },
    {
        id: 2,
        title: 'چگونه یک مهارت جدید یاد بگیریم؟',
        href: '#',
        description:
            'آیا قصد یادگیری یک مهارت جدید را دارید؟ در این مقاله، روش‌های مختلف یادگیری، مزایا و چالش‌های آن را بررسی می‌کنیم.',
        imageUrl: '/images/3.jpg',
        date: '15 اسفند 1402',
        datetime: '2024-03-05',
        category: { title: 'یادگیری', href: '#' },
        author: {
            name: 'سارا احمدی',
            role: 'کارشناس آموزش',
            href: '#',
            imageUrl:
                'https://example.com',
        },
    },
    {
        id: 3,
        title: 'نکات مهم برای موفقیت در دوره‌های آنلاین',
        href: '#',
        description:
            'با افزایش محبوبیت دوره‌های آنلاین، موفقیت در این دوره‌ها اهمیت زیادی پیدا کرده است. در این مقاله به روش‌های افزایش بهره‌وری و یادگیری مؤثر می‌پردازیم.',
        imageUrl: '/images/2.jpg',
        date: '20 اسفند 1402',
        datetime: '2024-03-10',
        category: { title: 'آموزش آنلاین', href: '#' },
        author: {
            name: 'محمد رضایی',
            role: 'مدرس آنلاین',
            href: '#',
            imageUrl:
                'https://example.com',
        },
    },
];
</script>
