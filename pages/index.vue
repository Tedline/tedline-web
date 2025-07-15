<template>
  <div>
   
    <SectionHomeHero />
    <div class="container mx-auto">
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