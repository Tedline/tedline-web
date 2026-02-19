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
    <div class="space-y-4 my-5 ">
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

interface Props {
  categories: Category[]
  modelValue: {
    selectedCategoryIds: number[]
    isFree: boolean
    hasDiscount: boolean
  }
  searchCategories?: (query: string) => Promise<Category[]>
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'update:filters'])

const category_items = props.categories.map((item) => {return {'label':item.title, 'id':item.id}})

const selectedCategoryIds = computed({
  get: () => props.modelValue.selectedCategoryIds,
  set: (value) => emit('update:modelValue', { ...props.modelValue, selectedCategoryIds: value })
})

const isFree = computed({
  get: () => props.modelValue.isFree,
  set: (value) => emit('update:modelValue', { ...props.modelValue, isFree: value })
})

const hasDiscount = computed({
  get: () => props.modelValue.hasDiscount,
  set: (value) => emit('update:modelValue', { ...props.modelValue, hasDiscount: value })
})

// State for category search
const categorySearchResults = ref<Category[]>(props.categories)
const isSearching = ref(false)

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