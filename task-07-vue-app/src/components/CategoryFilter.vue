<script setup>
// reusable filter control: the parent owns the actual selection state
// this component only displays the options its given and reports clicks
defineProps({
  categories: {
    type: Array,
    required: true
  },
  selected: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["filter-change"]);

function selectCategory(category) {
  emit("filter-change", category);
}
</script>

<template>
  <div class="category-buttons-container">
    <button
      v-for="category in categories"
      :key="category"
      type="button"
      class="category-capsule"
      :class="{ 'is-active': category === selected }"
      :aria-pressed="category === selected"
      @click="selectCategory(category)"
    >
      {{ category }}
    </button>
  </div>
</template>
