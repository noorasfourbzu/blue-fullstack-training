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
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-surface);
  color: var(--color-muted-text);
  line-height: 1.7;
}

.text-block p {
  margin: 0;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

@media (max-width: 480px) {
  .text-block {
    padding: 18px 16px;
  }
}
</style>