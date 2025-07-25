<template>
  <div>
   
    <SectionHomeHero />
    <div class="container mx-auto max-w-7xl">
    <SectionHomeFeature />
      <SectionHomeSwiperCourses />
      <SectionHomeBlog />
  </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'home'
});
</script>