<script setup>
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePagesStore } from "../stores/pages.js";

const route = useRoute();
const router = useRouter();
const pagesStore = usePagesStore();

onMounted(() => {
  pagesStore.fetchPublicPage(route.params.slug);
});

const page = computed(() => pagesStore.currentPage);

function goHome() {
  router.push("/");
}
</script>

<template>
  <section id="public-page" class="section">
    <div class="container">
      <p v-if="pagesStore.pageLoading" class="posts-status">Loading page...</p>

      <div v-else-if="pagesStore.notFound" class="posts-status posts-status--empty">
        <p>We couldn't find a page at "{{ route.params.slug }}".</p>
        <button type="button" @click="goHome">Back Home</button>
      </div>

      <div v-else-if="pagesStore.pageError" class="posts-status posts-status--error">
        <p>Something went wrong while loading this page.</p>
        <button
          type="button"
          :disabled="pagesStore.pageLoading"
          @click="pagesStore.fetchPublicPage(route.params.slug)"
        >
          {{ pagesStore.pageLoading ? "Retrying..." : "Retry" }}
        </button>
      </div>

      <template v-else-if="page">
        <h2 class="section-title">{{ page.title }}</h2>
        <div class="page-content">{{ page.content }}</div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.page-content {
  white-space: pre-line;
  line-height: 1.6;
}
</style>