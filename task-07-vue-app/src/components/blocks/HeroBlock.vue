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
  padding: 30px 24px;
  border: 1px solid var(--color-primary);
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary), #dceaff);
}

.hero-block h3 {
  margin: 0 0 0.75rem;
  color: var(--color-text);
  font-size: clamp(1.5rem, 4vw, 2.15rem);
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.hero-block p {
  margin: 0;
  color: var(--color-muted-text);
  line-height: 1.6;
  overflow-wrap: anywhere;
}

@media (max-width: 480px) {
  .hero-block {
    padding: 24px 18px;
  }
}
</style>