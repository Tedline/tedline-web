<template>
  <Head>
    <Title>{{ $t("explore.title") }} | {{ $t("tedline") }}</Title>
  </Head>
  <ClientOnly>
    <UiHeroPattern />
  </ClientOnly>
  <!-- Main Content -->
  <div class="min-h-screen">
    <!-- Search Bar -->
    <div
      class="bg-black/30 z-90 fixed h-full w-screen"
      @click="isFilterDrawerOpen = false"
      v-if="isFilterDrawerOpen"
    ></div>
    <div
      class="sticky top-0 z-10 bg-white/50 border-b-1 border-gray-100/50 backdrop-blur-lg dark:bg-black/40 dark:border-neutral-700/20 dark:shadow-xl py-4 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-10xl mx-auto">
        <div class="flex justify-between gap-2 items-center md:mx-10">
          <UInput
            v-model="searchQuery"
            :placeholder="$t('explore.searchPlaceholder')"
            :ui="{
              base: 'rounded-full text-sm py-3 bg-white/50 dark:bg-black/40',
            }"
            leading-icon="i-heroicons-magnifying-glass"
            size="xl"
            class="w-3xl"
            :loading="loading"
            @update:model-value="refreshData!"
          >
            <template #trailing>
              <UButton
                v-if="searchQuery"
                color="primary"
                variant="ghost"
                icon="i-heroicons-x-mark"
                :padded="false"
                @click="clearSearch"
              />
            </template>
          </UInput>
          <USelect
            v-model="sortOption"
            :items="sortOptions"
            size="md"
            :ui="{
              base: 'min-w-[140px] rounded-full py-3 px-3 md:block hidden',
            }"
            @update:model-value="refreshData!"
          />
          <UDrawer v-model:open="isFilterDrawerOpen" :modal="false">
            <UButton
              color="neutral"
              class="lg:hidden bg-white/50 dark:bg-black/40 rounded-full"
              size="xl"
              variant="outline"
              icon="i-heroicons-adjustments-horizontal"
            >
            </UButton>
            <template #content>
              <div class="p-6">
                <SectionExploreSearchFilter
                  :categories="categories"
                  v-model="filters"
                  :search-categories="searchCategories"
                  @update:filters="refreshData!"
                />
              </div>
            </template>
          </UDrawer>
        </div>
      </div>
    </div>

    <!-- Category Pills (Mobile and Desktop) -->
    <div class=" border  dark:bg-black/20 border-gray-100 bg-white/30 dark:border-neutral-700/40 dark:shadow-xl backdrop-blur-sm">
      <div class="md:max-w-7xl md:mx-auto">
        <div class="flex overflow-x-auto py-4 ">
          <UBadge
            v-for="category in categories"
            :key="category.id"
            :ui="{
              base: 'bg-white/50 dark:bg-black/40',
            }"
            :color="
              filters.selectedCategoryIds.includes(category.id)
                ? 'primary'
                : 'neutral'
            "
            variant="outline"
            size="lg"
            class="whitespace-nowrap mr-2 font-normal px-4 py-2 text-xs rounded-full cursor-pointer"
            @click="toggleCategory(category.id)"
          >
            {{ category.title }}
            <UIcon
              v-if="filters.selectedCategoryIds.includes(category.id)"
              name="i-heroicons-check"
              class="ms-1 w-3 h-3"
            />
          </UBadge>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-3">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters (Desktop) -->
        <div class="hidden lg:block mt-10">
          <div
            class="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6 mb-6 sticky top-25"
          >
            <SectionExploreSearchFilter
              :categories="categories"
              v-model="filters"
              :search-categories="searchCategories"
              @update:filters="refreshData!"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-3">
          <!-- Mobile Filter Button -->

          <UTabs
            :items="tabItems.map((tab) => ({ ...tab, label: $t(tab.label) }))"
            variant="link"
            :ui="{ trigger: 'md:px-18 px-10' }"
            :dir="currentLocale?.dir"
            color="neutral"
          >
            <template #courses="{ item }">
              <template v-if="loading == false">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10" v-if="courses.length > 0">
                  <SharedCourseSecondCard
                    v-for="course in courses"
                    :key="course.id"
                    :course="course"
                  />
                </div>
                <UAlert
                  v-else
                  icon="i-heroicons-information-circle"
                  :title="$t('explore.noCoursesFound')"
                  color="neutral"
                  variant="soft"
                  class="rounded-2xl m-3"
                >
                </UAlert>
              </template>
              <template v-else>
                <USkeleton
                  v-for="item in 10"
                  class="h-40 my-10 w-full rounded-xl"
                ></USkeleton>
              </template>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex justify-center mt-8">
                <UPagination
                  v-model:page="page"
                  @update:page="refreshData!"
                  class="ltr"
                  :items-per-page="12"
                  :total="totalPages * 12"
                  size="sm"
                />
              </div>
            </template>
            <template #blogs="{ item }">
              <div
                v-if="blogs.length > 0"
                class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
              >
                <SectionExploreBlogCard
                  v-for="blog in blogs"
                  :key="blog.id"
                  :blog="blog"
                />
              </div>

              <UAlert
                v-else
                icon="i-heroicons-information-circle"
                :title="$t('explore.noBlogsFound')"
                color="neutral"
                variant="soft"
                class="rounded-2xl m-3"
              >
              </UAlert>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CourseListItem } from "~/types/course";
import { useI18n } from "vue-i18n";

// i18n setup
const { locale, locales, t } = useI18n();

// Page meta
definePageMeta({
  layout: "dashboard",
});

// State
const searchQuery = ref("");
const activeTab = ref<"courses" | "blogs">("courses");
const page = ref(1);
const isFilterDrawerOpen = ref(false);
defineShortcuts({
  o: () => (isFilterDrawerOpen.value = !isFilterDrawerOpen.value),
});

const courses = computed(() => coursesData.value?.results || []);
const totalPages = computed(() => coursesData.value?.total_pages || 1);
const loading = computed(() => coursesLoading.value && blogsLoading.value);
const blogs = computed(() => blogsData.value?.results || []);
const categories = ref<{ id: number; title: string }[]>([]);

const sortOption = ref("newest");
const sortOptions = [
  { label: t("explore.newest"), value: "newest" },
  { label: t("explore.oldest"), value: "oldest" },
  { label: t("explore.mostLiked"), value: "most_liked" },
];

const filters = ref({
  selectedCategoryIds: [] as number[],
  isFree: false,
  hasDiscount: false,
});

const currentLocale = computed(() =>
  locales.value.find((l) => l.code === locale.value)
);

const tabItems = [
  {
    name: "courses",
    label: t("explore.courses"),
    icon: "i-heroicons-academic-cap",
    slot: "courses" as const,
  },
  {
    name: "blogs",
    label: t("explore.blogs"),
    icon: "i-heroicons-document-text",
    slot: "blogs" as const,
  },
];

// Unique key for useAsyncData cache & refetch
const fetchKey = computed(
  () =>
    `${activeTab.value}-${page.value}-${searchQuery.value}-${
      filters.value.isFree
    }-${filters.value.hasDiscount}-${filters.value.selectedCategoryIds.join(
      ","
    )}-${sortOption.value}`
);
const api = useApi(false); // false = optional token, true = require token

// Main fetch for courses/blogs
// Courses
const {
  data: coursesData,
  pending: coursesLoading,
  refresh: refreshCourses,
} = await useLazyAsyncData(
  `courses-${page.value}-${searchQuery.value}-${filters.value.isFree}-${
    filters.value.hasDiscount
  }-${filters.value.selectedCategoryIds.join(",")}-${sortOption.value}`,
  async () => {
    const params = new URLSearchParams();
    params.append("page", page.value.toString());
    if (searchQuery.value) params.append("search", searchQuery.value);
    if (filters.value.isFree) params.append("is_free", "true");
    if (filters.value.hasDiscount) params.append("is_discount", "true");
    if (filters.value.selectedCategoryIds.length > 0) {
      params.append("categories", filters.value.selectedCategoryIds.join(","));
    }
    if (sortOption.value) {
      params.append(
        "ordering",
        sortOption.value === "newest"
          ? "-created_at"
          : sortOption.value === "oldest"
          ? "created_at"
          : sortOption.value === "most_liked"
          ? "-likes_count"
          : "-created_at"
      );
    }
    return await api<{ results: CourseListItem[]; total_pages: number }>(
      `/course/SearchCourse/?${params.toString()}`
    );
  },
  { immediate: activeTab.value === "courses" }
);

// Blogs
const {
  data: blogsData,
  pending: blogsLoading,
  refresh: refreshBlogs,
} = await useLazyAsyncData(
  `blogs-${searchQuery.value}`,
  async () => {
    const params = new URLSearchParams();
    if (searchQuery.value) params.append("search", searchQuery.value);
    return await api<{ results: any[] }>(`/blog/?${params.toString()}`);
  },
  { immediate: true }
);

function refreshData() {
  refreshCourses();
  refreshBlogs();
}
// Fetch categories (SSR)
const { data: categoryData } = useAsyncData("categories", async () => {
  return await api<{ id: number; title: string }[]>(
    "/course/CourseCategoryPopular/"
  );
});
watchEffect(() => {
  if (categoryData.value) categories.value = categoryData.value;
});

// Category search (client-side for autocomplete)
async function searchCategories(query: string) {
  try {
    if (query && query.trim() !== "") {
      const params = new URLSearchParams();
      params.append("search", query);
      return await api<{ id: number; title: string }[]>(
        `/course/CourseCategory/?${params.toString()}`
      );
    } else {
      return categories.value;
    }
  } catch (error) {
    console.error("Error searching categories:", error);
    return [];
  }
}

// UI interactions
function toggleCategory(id: number) {
  const index = filters.value.selectedCategoryIds.indexOf(id);
  if (index === -1) {
    filters.value.selectedCategoryIds.push(id);
  } else {
    filters.value.selectedCategoryIds.splice(index, 1);
  }
  refreshData();
}

function clearSearch() {
  searchQuery.value = "";
  refreshData();
}

function resetFilters() {
  filters.value = {
    selectedCategoryIds: [],
    isFree: false,
    hasDiscount: false,
  };
  refreshData();
}

// Trigger refetch when filters/tab/page change
watch(
  [activeTab, page, searchQuery, sortOption, () => filters.value],
  () => refreshData(),
  { deep: true }
);

// Initial route params setup (SSR-safe)
const route = useRoute();
if (route.query.search) searchQuery.value = route.query.search as string;
if (route.query.tab) activeTab.value = route.query.tab as "courses" | "blogs";
if (route.query.category) {
  const categoryId = parseInt(route.query.category as string);
  if (!isNaN(categoryId)) {
    filters.value.selectedCategoryIds = [categoryId];
  }
}
</script>
