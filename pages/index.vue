<template>
  <div>
   
    <SectionHomeHero />
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ClientOnly>
        <SectionYourCourses v-if="userStore.isAuthenticated" :username="userStore.username || ''" />
        <SectionHomeLink v-else />
      </ClientOnly>
      <SectionHomeFeature />
      <SectionHomeMarketing />
      <SectionHomeCourses :title="$t('coursesList.bestSeller')" />
      <SectionHomeCategory />
      <SectionHomeCourses :title="$t('coursesList.skill')" api-url="/course/HomeCourses/?ordering=?&exclude_category_slug=تحصیلی" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
});

const userStore = useUserStore();
</script>