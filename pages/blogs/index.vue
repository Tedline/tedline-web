<script setup lang="ts">
const localePath = useLocalePath();
await navigateTo(localePath('/explore?tab=blogs'), { redirectCode: 301 });
</script>

<template>
  <div></div>
</template>