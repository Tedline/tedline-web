<template>

    <Head>
        <Title>{{ $t('explore.title') }} | {{ $t('tedline') }}</Title>
    </Head>
    <UiHeroPattern />
    <!-- Main Content -->
    <div class="min-h-screen ">
        <!-- Search Bar -->
        <div
            class="sticky top-0 z-10 bg-white/50 border-b-1 border-gray-100/50  backdrop-blur-lg dark:bg-black/40 dark:border-neutral-700/20 dark:shadow-xl py-4 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div class="flex justify-between gap-2 items-center mx-10">
                    <UInput v-model="searchQuery" :placeholder="$t('explore.searchPlaceholder')" :ui="{
                        base: 'rounded-xl text-sm py-3 bg-white/50 dark:bg-black/40'
                    }" icon="i-heroicons-magnifying-glass" size="xl" class="w-3xl" :loading="loading"
                        @update:model-value="handleSearch">
                        <template #trailing>
                            <UButton v-if="searchQuery" color="primary" variant="ghost" icon="i-heroicons-x-mark"
                                :padded="false" @click="clearSearch" />
                        </template>
                    </UInput>
                    <USelect v-model="sortOption" :items="sortOptions" size="lg" :ui="{
                        base: 'min-w-[140px] rounded-xl py-3'
                    }" @update:model-value="handleSearch" />
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <!-- Category Pills (Mobile and Desktop) -->
            <div class="flex overflow-x-auto py-4 ">
                <UBadge v-for="category in categories" :key="category.id" :ui="{
                    base: 'bg-white/50 dark:bg-black/40'
                }" :color="filters.selectedCategoryIds.includes(category.id) ? 'primary' : 'neutral'"
                    :variant="filters.selectedCategoryIds.includes(category.id) ? 'solid' : 'outline'" size="lg"
                    class="whitespace-nowrap mr-2 font-normal px-4 py-2 text-xs rounded-xl cursor-pointer"
                    @click="toggleCategory(category.id)">
                    {{ category.title }}
                    <UIcon v-if="filters.selectedCategoryIds.includes(category.id)" name="i-heroicons-check"
                        class="ms-1 w-3 h-3" />
                </UBadge>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">


                <!-- Filters (Desktop) -->
                <div class="hidden lg:block">
                    <SectionExploreSearchFilter :categories="categories" v-model="filters"
                        :search-categories="searchCategories" @update:filters="handleSearch" />
                </div>

                <!-- Content -->
                <div class="lg:col-span-3">
                    <!-- Mobile Filter Button -->
                    <UModal>
                        <div class="flex justify-end mb-4 lg:hidden">
                            <UButton color="primary" variant="soft" icon="i-heroicons-adjustments-horizontal"
                                @click="isFilterDrawerOpen = true">
                                {{ $t('explore.filters') }}
                            </UButton>
                        </div>
                        <template #body>
                            <UCard class="divide-y divide-gray-100 dark:divide-gray-800">
                                <template #header>
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                                            {{ $t('explore.filters') }}
                                        </h3>
                                        <UButton color="primary" variant="ghost" icon="i-heroicons-x-mark" class="-my-1"
                                            @click="isFilterDrawerOpen = false" />
                                    </div>
                                </template>

                                <SectionExploreSearchFilter :categories="categories" v-model="filters"
                                    :search-categories="searchCategories" @update:filters="handleSearch" />

                                <template #footer>
                                    <div class="flex justify-end gap-3">
                                        <UButton color="secondary" variant="soft" @click="resetFilters">
                                            {{ $t('reset') || 'Reset' }}
                                        </UButton>
                                        <UButton color="primary" @click="isFilterDrawerOpen = false">
                                            {{ $t('apply') || 'Apply' }}
                                        </UButton>
                                    </div>
                                </template>
                            </UCard>
                        </template>

                    </UModal>

                    <UTabs :items="tabItems.map(tab => ({ ...tab, label: $t(tab.label) }))" variant="link"
                        :ui="{ trigger: 'px-18' }" :dir="currentLocale?.dir" color="neutral">
                        <template #courses="{ item }">
                            <template v-if="loading == false">
                                <template v-if="courses.length > 0">
                                    <SharedCourseHorizontalCard class="my-10" v-for="course in courses"
                                        :key="course.id" :course="course" />
                                </template>
                                <UAlert v-else icon="i-heroicons-information-circle" color="info" variant="soft"
                                    class="text-center py-8">
                                    {{ $t('explore.noCoursesFound') }}
                                </UAlert>
                            </template>
                            <template v-else>
                                <USkeleton v-for="item in 10" class="h-40 my-10 w-full rounded-xl"></USkeleton>
                            </template>

                            <!-- Pagination -->
                            <div v-if="totalPages > 1" class="flex justify-center mt-8">
                                <UPagination v-model:page="page" @update:page="handleSearch" class="ltr" :items-per-page="12" :total="totalPages*12" size="sm" 
                                   />
                            </div>
                        </template>
                        <template #blogs="{ item }">
                            <div v-if="blogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SectionExploreBlogCard v-for="blog in blogs" :key="blog.id" :blog="blog" />
                            </div>
                            <UAlert v-else icon="i-heroicons-information-circle" color="info" variant="soft"
                                class="text-center py-8">
                                {{ $t('explore.noBlogsFound') }}
                            </UAlert>
                        </template>

                    </UTabs>


                
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { CourseListItem } from '~/types/course'
import { useI18n } from 'vue-i18n'
const { locale, locales } = useI18n()

// Page meta
definePageMeta({
    layout: 'dashboard'
})

// Setup i18n
const { t } = useI18n()

// State
const searchQuery = ref('')
const activeTab = ref('courses')
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const isFilterDrawerOpen = ref(false)

const courses = ref<CourseListItem[]>([])
const blogs = ref<any[]>([])
const categories = ref<{ id: number; title: string }[]>([])

// Sort options
const sortOption = ref('newest')
const sortOptions = [
    { label: t('explore.newest'), value: 'newest' },
    { label: t('explore.oldest'), value: 'oldest' },
    { label: t('explore.mostLiked'), value: 'most_liked' }
]

const filters = ref({
    selectedCategoryIds: [] as number[],
    isFree: false,
    hasDiscount: false
})

const currentLocale = computed(() =>
    locales.value.find((l) => l.code === locale.value)
)

// Tabs configuration
const tabItems = [
    {
        name: 'courses',
        label: t('explore.courses'),
        icon: 'i-heroicons-academic-cap',
        slot: 'courses' as const
    },
    {
        name: 'blogs',
        label: t('explore.blogs'),
        icon: 'i-heroicons-document-text',
        slot: 'blogs' as const
    }
]

// Methods
function handleSearch() {
    if (activeTab.value === 'courses') {
        searchCourses()
    } else {
        searchBlogs()
    }
}

async function searchCourses() {
    try {
        loading.value = true

        // Build query parameters
        const params = new URLSearchParams()
        params.append('page', page.value.toString())
        if (searchQuery.value) params.append('search', searchQuery.value)
        if (filters.value.isFree) params.append('is_free', 'true')
        if (filters.value.hasDiscount) params.append('is_discount', 'true')
        if (filters.value.selectedCategoryIds.length > 0) {
            params.append('categories', filters.value.selectedCategoryIds.join(','))
        }

        // Add sorting parameter
        if (sortOption.value) {
            params.append('ordering', sortOption.value === 'newest' ? '-created_at' :
                sortOption.value === 'oldest' ? 'created_at' :
                    sortOption.value === 'most_liked' ? '-likes_count' : '-created_at')
        }

        // Make API request
        interface CourseResponse {
            results: CourseListItem[]
            total_pages: number
        }

        const response = await $fetch<CourseResponse>(`https://tedline.org/api/course/SearchCourse/?${params.toString()}`)
        courses.value = response.results || []
        totalPages.value = response.total_pages || 1
    } catch (error: any) {
        console.error('Error searching courses:', error)
        const { $toast } = useNuxtApp() as any
        $toast.add({
            title: t('errorOccurred'),
            description: error.message,
            color: 'red'
        })
    } finally {
        loading.value = false
    }
}

async function searchBlogs() {
    try {
        loading.value = true

        // Build query parameters
        const params = new URLSearchParams()
        if (searchQuery.value) params.append('search', searchQuery.value)

        // Make API request
        interface BlogResponse {
            results: any[]
        }

        const response = await $fetch<BlogResponse>(`https://tedline.org/api/blog/Blog_List/?${params.toString()}`)
        blogs.value = response.results || []
    } catch (error: any) {
        console.error('Error searching blogs:', error)
        const { $toast } = useNuxtApp() as any
        $toast.add({
            title: t('errorOccurred'),
            description: error.message,
            color: 'red'
        })
    } finally {
        loading.value = false
    }
}

async function getCategories() {
    try {
        interface Category {
            id: number
            title: string
        }

        const response = await $fetch<Category[]>('https://tedline.org/api/course/CourseCategoryPopular/')
        categories.value = response || []
    } catch (error) {
        console.error('Error fetching categories:', error)
    }
}

async function searchCategories(query: string) {
    try {
        interface Category {
            id: number
            title: string
        }

        // If we have a search query, use a search endpoint
        if (query && query.trim() !== '') {
            const params = new URLSearchParams()
            params.append('search', query)
            const response = await $fetch<Category[]>(`https://tedline.org/api/course/CourseCategory/?${params.toString()}`)
            return response || []
        } else {
            // Otherwise return the popular categories we already have
            return categories.value
        }
    } catch (error) {
        console.error('Error searching categories:', error)
        return []
    }
}

function toggleCategory(id: number) {
    const index = filters.value.selectedCategoryIds.indexOf(id)
    if (index === -1) {
        filters.value.selectedCategoryIds.push(id)
    } else {
        filters.value.selectedCategoryIds.splice(index, 1)
    }
    handleSearch()
}

function clearSearch() {
    searchQuery.value = ''
    handleSearch()
}

function resetFilters() {
    filters.value = {
        selectedCategoryIds: [],
        isFree: false,
        hasDiscount: false
    }
    handleSearch()
}

// Watch for tab changes
watch(activeTab, () => {
    page.value = 1
    handleSearch()
})

// Lifecycle
onMounted(() => {
    // Check for URL parameters
    const route = useRoute()
    if (route.query.search) searchQuery.value = route.query.search as string
    if (route.query.tab) activeTab.value = route.query.tab as string
    if (route.query.category) {
        const categoryId = parseInt(route.query.category as string)
        if (!isNaN(categoryId)) {
            filters.value.selectedCategoryIds = [categoryId]
        }
    }

    // Load initial data
    getCategories()
    handleSearch()
})
</script>