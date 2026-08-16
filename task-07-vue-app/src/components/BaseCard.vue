<script setup>
// Generic reusable card shell used by both the services grid and the
// posts grid. Callers pass their own heading/body markup through the
// default slot and pick an optional modifier class for styling.
defineProps({
  variant: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <article class="card" :class="variant">
    <slot />
  </article>
</template>
