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
      class="button page-ui-button"
    >
      {{ block.data.button_label }}
    </a>
  </section>
</template>

<style scoped>
.cta-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 26px 24px;
  border: 1px solid var(--color-secondary);
  border-radius: 10px;
  background-color: var(--color-secondary);
}

.cta-block h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.35rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.cta-block .button {
  align-self: flex-start;
}

@media (max-width: 480px) {
  .cta-block {
    padding: 22px 18px;
  }

  .cta-block .button {
    width: 100%;
  }
}
</style>