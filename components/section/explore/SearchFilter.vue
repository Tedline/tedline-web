<template>
  <div >
    <div class="flex items-center gap-3 mb-6">
      <div class="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-800 dark:from-blue-500/50 dark:to-blue-700/50 rounded-xl flex items-center justify-center">
        <UIcon name="i-heroicons-adjustments-horizontal" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 class="text-md font-bold text-gray-900 dark:text-white">{{ t('explore.filters') }}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('explore.filtersDesc') }}</p>
      </div>
    </div>

    <!-- Categories -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{{ t('explore.categories') }}</h4>
      <USelectMenu
        v-model="selectedCategoryIds"
        valueKey="id"
        :options="categorySearchResults"
        option-attribute="title"
        value-attribute="id"
        size="lg"
        :ui="{
          base:'rounded-xl'
        }"
        :items="category_items"
        searchable
        multiple
        placeholder="Search categories..."
        class="w-full"
        :loading="isSearching"
        :search-attributes="['title', 'id']"
        searchable-placeholder="Type to search categories..."
        @change="$emit('update:filters')"
        @search="handleCategorySearch"
      >
      
      </USelectMenu>
    </div>
    <USeparator />
    <!-- Filters -->
    <div class="space-y-5 my-5 ">
        <USwitch
          v-model="isFree"
          name="free"
          class="mb-4"
          :label="t('explore.freeCoursesOnly')"
          @change="$emit('update:filters')"
        />
   

        <USwitch
          v-model="hasDiscount"
          name="discount"
          :label="t('explore.discountedCourses')"
          @change="$emit('update:filters')"
        />
       
    </div>
    <USeparator />
    <div class="space-y-6 my-5">
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ t('explore.priceRange') }}</h4>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatNumber(priceRange[0]) }} - {{ formatNumber(priceRange[1]) }} {{ t('explore.currency') }}</span>
        </div>
        <USlider
          v-model="priceRange"
          :min="priceDefaults.min"
          :max="priceDefaults.max"
          :step="priceDefaults.step"
          :min-steps-between-thumbs="1"
          tooltip
          @update:model-value="emitFilters"
        />
        <div class="grid grid-cols-2 gap-3">
          <UInputNumber
            v-model="minPrice"
            :min="priceDefaults.min"
            :max="maxPrice"
            :step="priceDefaults.step"
            :placeholder="t('explore.minPrice')"
            size="sm"
            class="w-full"
            @update:model-value="emitFilters"
          />
          <UInputNumber
            v-model="maxPrice"
            :min="minPrice"
            :max="priceDefaults.max"
            :step="priceDefaults.step"
            :placeholder="t('explore.maxPrice')"
            size="sm"
            class="w-full"
            @update:model-value="emitFilters"
          />
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ t('explore.durationRange') }}</h4>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ durationRange[0] }} - {{ durationRange[1] }} {{ t('minute') }}</span>
        </div>
        <USlider
          v-model="durationRange"
          :min="durationDefaults.min"
          :max="durationDefaults.max"
          :step="durationDefaults.step"
          :min-steps-between-thumbs="1"
          tooltip
          @update:model-value="emitFilters"
        />
        <div class="grid grid-cols-2 gap-3">
          <UInputNumber
            v-model="minDuration"
            :min="durationDefaults.min"
            :max="maxDuration"
            :step="durationDefaults.step"
            :placeholder="t('explore.minDuration')"
            size="sm"
            class="w-full"
            @update:model-value="emitFilters"
          />
          <UInputNumber
            v-model="maxDuration"
            :min="minDuration"
            :max="durationDefaults.max"
            :step="durationDefaults.step"
            :placeholder="t('explore.maxDuration')"
            size="sm"
            class="w-full"
            @update:model-value="emitFilters"
          />
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ t('explore.minDiscount') }}</h4>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ minDiscount }}%</span>
        </div>
        <USlider
          v-model="minDiscount"
          :min="0"
          :max="100"
          :step="1"
          tooltip
          @update:model-value="emitFilters"
        />
        <UInputNumber
          v-model="minDiscount"
          :min="0"
          :max="100"
          :step="1"
          :placeholder="t('explore.minDiscount')"
          size="sm"
          class="w-full"
          @update:model-value="emitFilters"
        />
      </div>
    </div>
    <USeparator />
   
    <!-- <UInputMenu v-model="value" :avatar="value?.avatar" :items="items" /> -->
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Category {
  id: number
  title: string
}

interface FilterModel {
  selectedCategoryIds: number[]
  isFree: boolean
  hasDiscount: boolean
  priceRange: number[]
  durationRange: number[]
  minDiscount: number
  categorySlug: string
  excludeCategorySlug: string
}

interface Props {
  categories: Category[]
  modelValue: FilterModel
  searchCategories?: (query: string) => Promise<Category[]>
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'update:filters'])

const priceDefaults = {
  min: 0,
  max: 10_000_000,
  step: 100_000
}

const durationDefaults = {
  min: 0,
  max: 1_000,
  step: 10
}

const category_items = computed(() => props.categories.map((item) => ({ label: item.title, id: item.id })))

function updateFilters(value: Partial<FilterModel>) {
  emit('update:modelValue', { ...props.modelValue, ...value })
}

function emitFilters() {
  emit('update:filters')
}

const selectedCategoryIds = computed({
  get: () => props.modelValue.selectedCategoryIds,
  set: (value) => updateFilters({ selectedCategoryIds: value })
})

const isFree = computed({
  get: () => props.modelValue.isFree,
  set: (value) => updateFilters({ isFree: value })
})

const hasDiscount = computed({
  get: () => props.modelValue.hasDiscount,
  set: (value) => updateFilters({ hasDiscount: value })
})

const priceRange = computed({
  get: () => props.modelValue.priceRange,
  set: (value) => updateFilters({ priceRange: normalizeRange(value, priceDefaults.min, priceDefaults.max) })
})

const minPrice = computed({
  get: () => props.modelValue.priceRange[0],
  set: (value) => updateFilters({ priceRange: normalizeRange([value, props.modelValue.priceRange[1]], priceDefaults.min, priceDefaults.max) })
})

const maxPrice = computed({
  get: () => props.modelValue.priceRange[1],
  set: (value) => updateFilters({ priceRange: normalizeRange([props.modelValue.priceRange[0], value], priceDefaults.min, priceDefaults.max) })
})

const durationRange = computed({
  get: () => props.modelValue.durationRange,
  set: (value) => updateFilters({ durationRange: normalizeRange(value, durationDefaults.min, durationDefaults.max) })
})

const minDuration = computed({
  get: () => props.modelValue.durationRange[0],
  set: (value) => updateFilters({ durationRange: normalizeRange([value, props.modelValue.durationRange[1]], durationDefaults.min, durationDefaults.max) })
})

const maxDuration = computed({
  get: () => props.modelValue.durationRange[1],
  set: (value) => updateFilters({ durationRange: normalizeRange([props.modelValue.durationRange[0], value], durationDefaults.min, durationDefaults.max) })
})

const minDiscount = computed({
  get: () => props.modelValue.minDiscount,
  set: (value) => updateFilters({ minDiscount: clampNumber(value, 0, 100) })
})

const categorySlug = computed({
  get: () => props.modelValue.categorySlug,
  set: (value) => updateFilters({ categorySlug: value })
})

const excludeCategorySlug = computed({
  get: () => props.modelValue.excludeCategorySlug,
  set: (value) => updateFilters({ excludeCategorySlug: value })
})

// State for category search
const categorySearchResults = ref<Category[]>(props.categories)
const isSearching = ref(false)

watch(
  () => props.categories,
  (categories) => {
    categorySearchResults.value = categories
  }
)

function clampNumber(value: number | undefined, min: number, max: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

function normalizeRange(value: number[], min: number, max: number) {
  const start = clampNumber(value[0], min, max)
  const end = clampNumber(value[1], min, max)
  return start <= end ? [start, end] : [end, start]
}

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value)
}

// Handle category search
async function handleCategorySearch(query: string) {
  if (props.searchCategories) {
    isSearching.value = true
    try {
      categorySearchResults.value = await props.searchCategories(query)
    } catch (error) {
      console.error('Error searching categories:', error)
    } finally {
      isSearching.value = false
    }
  }
}
</script>
