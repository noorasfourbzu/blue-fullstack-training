<script setup>
import BaseCard from "./BaseCard.vue";

// Props:this card only ever reads data handed to it by the parent,
// it never reaches out for its own state
const props = defineProps({
  service: {
    type: Object,
    required: true
  }
});

// Child to parent event : clicking the button doesnt change anything inside this component it just reports the action upward
const emit = defineEmits(["view-details"]);

function handleViewDetails() {
  emit("view-details", props.service);
}
</script>

<template>
  <BaseCard variant="service-card">
    <h3>{{ service.title }}</h3>

    
    <button
      type="button"
      class="card-details-button"
      @click="handleViewDetails"
    >
      View Details
    </button>
  </BaseCard>
</template>
