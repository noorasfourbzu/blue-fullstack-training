<script setup>
import BaseCard from "./BaseCard.vue";

defineProps({
  post: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <BaseCard variant="post-card">
    <h3>{{ post.title }}</h3>
    <p>{{ post.body }}</p>
  </BaseCard>
</template>
