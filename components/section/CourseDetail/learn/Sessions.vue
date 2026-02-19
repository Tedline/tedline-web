<template>

    <div v-if="loading" class="mt-20 px-6 container mx-auto">
        <USkeleton v-for="n in 3" class=" h-15 mx-2  my-5"></USkeleton>
    </div>

    <!-- Main Content -->
    <div v-if="data" class="">
         
        <!-- Course Title -->
        <div class="px-5 text-lg font-bold text-gray-900 dark:text-gray-100 mt-3 mb-6">
            {{ data.title }}
        </div>

        <!-- Registration Alert -->
        <div class="px-3">
          <UAlert v-if="!data.registered" variant="subtle" color="neutral" orientation="horizontal" class=" mb-4 " :title="$t('sessions.registerInCourse')">
              <template #actions>
                  <UButton :to="`/course/${data.id}/?register=true`" color="primary"  size="sm" class="">
                      {{ $t('sessions.register') }}
                  </UButton>
              </template>
          </UAlert>
      </div>

        <!-- Accordion Sections -->
        <div class="space-y-4">
            <UAccordion
                :items="accordionItems"
                type="multiple"
                
                :ui="{
                    header:'mx-3 ',
                    leadingIcon:'h-4',
                    trailingIcon:'h-4'
                }"
                :default-value="defaultActiveValues"
            >
                <template #default="{ item, open }">
                    <div class="text-xs">
                    {{ item.type === 'sessions' ? $t('sessions.sessions') : $t('sessions.general') }}
                    </div>
                </template>
                <template #body="{ item }">
                    <div class="space-y-2">
                        <!-- Sessions Section Content -->
                        <div v-if="item.type === 'sessions'">
                            <div class="space-y-3">
                                <NuxtLinkLocale v-for="(sessionItem, i) in item.sessions" :key="sessionItem.id"
                                    :to="`/course/learn/${data.id}/${sessionItem.id}`">
                                    <div class="cursor-pointer transition-all duration-200 " :class="[
                                        ' px-5 py-2 my-3',
                                        $route.params.session === sessionItem.id.toString()
                                            ? 'bg-stone-500/10 border-s-[2px]  ps-5 border-blue-700 dark:border-gray-50'
                                            : ' hover:bg-gray-200 dark:hover:bg-stone-800 ',
                                        sessionItem.description ? '' : 'py-4'
                                    ]">
                                        <div class="  ">
                                            <h4 class="font-bold text-sm line-clamp-1">
                                                {{ sessionItem.title }}
                                            </h4>
                                            <p class="text-xs mt-1 opacity-80 line-clamp-1">
                                                {{ sessionItem.description }}
                                            </p>
                                        </div>
                                    </div>
                                </NuxtLinkLocale>
                            </div>
                        </div>

                        <!-- General Section Content -->
                        <div v-if="item.type === 'general'">
                            <NuxtLinkLocale :to="`/course/${data.id}`">
                                <div
                                    class="cursor-pointer transition-all duration-200 px-6 py-4  hover:bg-gray-200 dark:hover:bg-stone-800">
                                    <div class="  ">
                                        <h4 class="font-bold text-sm text-gray-900 dark:text-gray-100">
                                            {{ $t('sessions.courseDescription') }}
                                        </h4>
                                    </div>
                                </div>
                            </NuxtLinkLocale>
                        </div>
                    </div>
                </template>
            </UAccordion>
        </div>
    </div>

</template>


<script setup>
const route = useRoute()
const api = useApi(false)

const loading = ref(true)
const data = ref(null)

// Define props to allow parent to control drawer state
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: true
    }
})

// Accordion items computed property
const accordionItems = computed(() => {
    if (!data.value) return []
    
    const items = []
    
    // Sessions section
    if (data.value.session && data.value.session.length > 0) {
        items.push({
            label: 'Sessions',
            value: 'sessions',
            type: 'sessions',
            sessions: data.value.session
        })
    }
    
    // General section
    items.push({
        label: 'General',
        value: 'general',
        type: 'general'
    })
    
    return items
})

// Default active values - all sections open by default
const defaultActiveValues = computed(() => accordionItems.value.map(i => i.value))


const getData = async () => {
    try {
        loading.value = true
        const response = await api(`course/RetrieveCourses/${route.params.id}/`)
        data.value = response
        loading.value = false
    } catch (error) {
        console.error('Error fetching course data:', error)
        loading.value = false
    }
}

onMounted(async () => {
    await getData()
})
</script>