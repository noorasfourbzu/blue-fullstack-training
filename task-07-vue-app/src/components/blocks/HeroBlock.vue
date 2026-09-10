<script setup>
defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="hero-block">
    <h3>{{ block.data.heading }}</h3>

    <p v-if="block.data.subtitle">
      {{ block.data.subtitle }}
    </p>
  </section>
</template>

<style scoped>
.hero-block {
  padding: 2rem 1.5rem;
  border-radius: 10px;
}

.hero-block h3 {
  margin: 0 0 0.75rem;
}

.hero-block p {
  margin: 0;
  line-height: 1.6;
}
</style>