<script setup>
defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="cta-block">
    <h3 v-if="block.data.heading">
      {{ block.data.heading }}
    </h3>

    <a
      :href="block.data.button_url"
      class="button"
    >
      {{ block.data.button_label }}
    </a>
  </section>
</template>

<style scoped>
.cta-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cta-block h3 {
  margin: 0;
}

.cta-block .button {
  align-self: flex-start;
}
</style>