<script setup>
defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="text-block">
    <p>{{ block.data.content }}</p>
  </section>
</template>

<style scoped>
.text-block {
  line-height: 1.7;
}

.text-block p {
  margin: 0;
  white-space: pre-line;
}
</style>