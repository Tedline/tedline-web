<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-700 dark:from-purple-500/50 dark:to-indigo-700/50 rounded-xl flex items-center justify-center">
        <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 class="text-md font-bold text-gray-900 dark:text-white">{{ t('explore.filters') }}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('explore.filterBlogsDesc') }}</p>
      </div>
    </div>

    <!-- Blog Categories Multi-select -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{{ t('explore.blogCategories') }}</h4>
      <USelectMenu
        v-model="selectedCategoryIds"
        value-key="id"
        :items="categoryItems"
        multiple
        :placeholder="t('explore.searchCategories')"
        class="w-full"
        :ui="{ base: 'rounded-xl' }"
        @update:model-value="onFilterChange"
      />

      <!-- Selected Category Badges -->
      <div v-if="selectedCategoryIds.length > 0" class="flex flex-wrap gap-1.5 mt-3">
        <UBadge
          v-for="id in selectedCategoryIds"
          :key="id"
          color="primary"
          variant="soft"
          size="sm"
          class="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
          @click="removeCategory(id)"
        >
          <span>{{ getCategoryTitle(id) }}</span>
          <UIcon name="i-heroicons-x-mark" class="w-3 h-3 ms-1" />
        </UBadge>
      </div>
    </div>

    <USeparator class="my-5" />

    <!-- Ordering / Sort Option -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{{ t('explore.ordering') }}</h4>
      <USelect
        v-model="ordering"
        :items="orderingOptions"
        size="lg"
        class="w-full"
        :ui="{ base: 'rounded-xl' }"
        @update:model-value="onFilterChange"
      />
    </div>

    <!-- Clear Filters Button -->
    <div v-if="hasActiveFilters" class="pt-2">
      <UButton
        color="neutral"
        variant="ghost"
        block
        size="sm"
        icon="i-heroicons-arrow-path"
        @click="clearFilters"
      >
        {{ t('explore.clearFilters') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface BlogCategory {
  id: number
  title: string
  position?: number
}

export interface BlogFilterModel {
  selectedCategoryIds: number[]
  ordering: string
}

interface Props {
  categories: BlogCategory[]
  modelValue: BlogFilterModel
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  modelValue: () => ({
    selectedCategoryIds: [],
    ordering: '-created_at',
  }),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: BlogFilterModel): void
  (e: 'update:filters'): void
}>()

const categoryItems = computed(() =>
  props.categories.map((item) => ({
    label: item.title,
    id: item.id,
  }))
)

const orderingOptions = computed(() => [
  { label: t('explore.newest'), value: '-created_at' },
  { label: t('explore.oldest'), value: 'created_at' },
  { label: t('explore.titleAsc'), value: 'title' },
])

const selectedCategoryIds = computed({
  get: () => props.modelValue.selectedCategoryIds || [],
  set: (val: number[]) => {
    emit('update:modelValue', {
      ...props.modelValue,
      selectedCategoryIds: val,
    })
  },
})

const ordering = computed({
  get: () => props.modelValue.ordering || '-created_at',
  set: (val: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      ordering: val,
    })
  },
})

const hasActiveFilters = computed(() => {
  return (
    (props.modelValue.selectedCategoryIds && props.modelValue.selectedCategoryIds.length > 0) ||
    props.modelValue.ordering !== '-created_at'
  )
})

function getCategoryTitle(id: number): string {
  const found = props.categories.find((c) => c.id === id)
  return found?.title || String(id)
}

function removeCategory(id: number) {
  const current = [...(props.modelValue.selectedCategoryIds || [])]
  const idx = current.indexOf(id)
  if (idx !== -1) {
    current.splice(idx, 1)
    emit('update:modelValue', {
      ...props.modelValue,
      selectedCategoryIds: current,
    })
    emit('update:filters')
  }
}

function onFilterChange() {
  emit('update:filters')
}

function clearFilters() {
  emit('update:modelValue', {
    selectedCategoryIds: [],
    ordering: '-created_at',
  })
  emit('update:filters')
}
</script>
