<template>
  <div>
   
    <SectionHomeHero />
    <div class="container mx-auto max-w-7xl">
      <SectionHomeFeature />
      <SectionHomeLink />
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
</script>