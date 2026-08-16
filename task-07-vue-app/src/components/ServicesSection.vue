<script setup>
import { ref, computed, nextTick } from "vue";
import ServiceCard from "./ServiceCard.vue";
import CategoryFilter from "./CategoryFilter.vue";

// 8 service records, each tagged with a category so they can be filtered.
const services = [
  {
    id: 1,
    title: "Browser Puzzle Games",
    category: "Web",
    description:
      "Clever browser-based challenges that reward curiosity, observation, and unusual ways of thinking."
  },
  {
    id: 2,
    title: "Web Maze Worlds",
    category: "Web",
    description:
      "Twisting spaces, hidden paths, and worlds that challenge the player's sense of direction, playable straight in the browser."
  },
  {
    id: 3,
    title: "Narrative Web Experiences",
    category: "Web",
    description:
      "Stories shaped by choices, consequences, and details that are not always what they seem."
  },
  {
    id: 4,
    title: "Experimental Web Games",
    category: "Web",
    description:
      "Unusual mechanics and playful risks that transform simple ideas into unexpected browser experiences."
  },
  {
    id: 5,
    title: "Mobile Puzzle Adventures",
    category: "Mobile",
    description:
      "Bite-sized puzzle adventures built for touchscreens and short play sessions on the go."
  },
  {
    id: 6,
    title: "Mobile Arcade Runners",
    category: "Mobile",
    description:
      "Fast-paced arcade mechanics tuned for one-handed play and quick mobile sessions."
  },
  {
    id: 7,
    title: "Game UI Design",
    category: "UI/UX",
    description:
      "Menus, HUDs, and interface systems designed to stay clear without breaking a game's strange visual identity."
  },
  {
    id: 8,
    title: "Player Onboarding & UX",
    category: "UI/UX",
    description:
      "Onboarding flows and UX research that help players understand unusual mechanics without losing the sense of discovery."
  }
];

// category controls: "All" plus every unique category found in the data
const categories = ["All", ...new Set(services.map((service) => service.category))];

// reactive state for the currently selected category
const selectedCategory = ref("All");

// reactive state for whichever card the user last asked to view
const selectedService = ref(null);

// template ref for the details panel + a brief "just updated" flag
// used together so the panel is impossible to miss when it appears
// below the user current scroll position
const panelRef = ref(null);
const panelPulse = ref(false);
let pulseTimeout = null;

// derived list: recomputed automatically whenever selectedCategory changes
const filteredServices = computed(() => {
  if (selectedCategory.value === "All") return services;
  return services.filter((service) => service.category === selectedCategory.value);
});

// handles the CategoryFilter "filter-change" event.
function handleFilterChange(category) {
  selectedCategory.value = category;
}

// the panel already sits above the grid so a click on a card further down the page would
// otherwise update state the user cant see without scrolling up
// themselves Scroll it into view and pulse it so the update is obvious
async function handleViewDetails(service) {
  selectedService.value = service;

  await nextTick();
  panelRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });

  panelPulse.value = false;
  await nextTick();
  panelPulse.value = true;
  window.clearTimeout(pulseTimeout);
  pulseTimeout = window.setTimeout(() => {
    panelPulse.value = false;
  }, 900);
}

function clearSelectedService() {
  selectedService.value = null;
}
</script>

<template>
  <section id="services" class="section">
    <div class="container">

      <h2 class="section-title">Our Services</h2>

      <CategoryFilter
        :categories="categories"
        :selected="selectedCategory"
        @filter-change="handleFilterChange"
      />

      <p class="results-count" aria-live="polite">
        {{ filteredServices.length }} service{{ filteredServices.length === 1 ? "" : "s" }}
        in "{{ selectedCategory }}"
      </p>

      <div
        v-if="selectedService"
        ref="panelRef"
        class="selected-service-panel"
        :class="{ 'is-pulsing': panelPulse }"
        aria-live="polite"
      >
        <div>
          <p class="selected-service-label">Selected service</p>
          <h3>{{ selectedService.title }}</h3>
          <p>{{ selectedService.description }}</p>
        </div>
        <button type="button" class="selected-service-close" @click="clearSelectedService">
          Close
        </button>
      </div>

      <div class="services-container">
        <ServiceCard
          v-for="service in filteredServices"
          :key="service.id"
          :service="service"
          @view-details="handleViewDetails"
        />
      </div>

    </div>
  </section>
</template>
