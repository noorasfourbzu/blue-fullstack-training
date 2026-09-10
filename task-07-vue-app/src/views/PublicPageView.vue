<script setup>
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePagesStore } from "../stores/pages.js";

import HeroBlock from "../components/blocks/HeroBlock.vue";
import TextBlock from "../components/blocks/TextBlock.vue";
import CtaBlock from "../components/blocks/CtaBlock.vue";

const route = useRoute();
const router = useRouter();
const pagesStore = usePagesStore();

const page = computed(() => pagesStore.currentPage);

// Map backend block types to reusable Vue components.
const blockComponents = {
  hero: HeroBlock,
  text: TextBlock,
  cta: CtaBlock,
};

onMounted(() => {
  pagesStore.fetchPublicPage(route.params.slug);
});

function goHome() {
  router.push("/");
}
</script>

<template>
  <section id="public-page" class="section">
    <div class="container">
      <p
        v-if="pagesStore.pageLoading"
        class="posts-status"
      >
        Loading page...
      </p>

      <div
        v-else-if="pagesStore.notFound"
        class="posts-status posts-status--empty"
      >
        <p>
          We couldn't find a page at "{{ route.params.slug }}".
        </p>

        <button
          type="button"
          @click="goHome"
        >
          Back Home
        </button>
      </div>

      <div
        v-else-if="pagesStore.pageError"
        class="posts-status posts-status--error"
      >
        <p>
          Something went wrong while loading this page.
        </p>

        <button
          type="button"
          :disabled="pagesStore.pageLoading"
          @click="pagesStore.fetchPublicPage(route.params.slug)"
        >
          {{ pagesStore.pageLoading ? "Retrying..." : "Retry" }}
        </button>
      </div>

      <template v-else-if="page">
        <h2 class="section-title">
          {{ page.title }}
        </h2>

        <div class="page-content">
          {{ page.content }}
        </div>

        <div
          v-if="page.blocks?.length"
          class="page-blocks"
        >
          <div
            v-for="block in page.blocks"
            :key="block.id"
            class="content-block"
          >
            <component
              v-if="blockComponents[block.type]"
              :is="blockComponents[block.type]"
              :block="block"
            />

            <p
              v-else
              class="unsupported-block"
            >
              Unsupported content block type:
              {{ block.type }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.page-content {
  white-space: pre-line;
  line-height: 1.6;
}

.page-blocks {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.content-block {
  border-radius: 10px;
}

.unsupported-block {
  margin: 0;
  padding: 1rem;
}
</style>