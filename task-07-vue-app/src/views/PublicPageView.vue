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

// Map backend block types to reusable Vue components
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
      <p v-if="pagesStore.pageLoading" class="page-state page-state--loading">
        Loading page...
      </p>

      <div v-else-if="pagesStore.notFound" class="page-state page-state--empty">
        <p>
          We couldn't find a page at "{{ route.params.slug }}".
        </p>

        <button type="button" class="button page-ui-button page-ui-button--secondary" @click="goHome">
          Back Home
        </button>
      </div>

      <div v-else-if="pagesStore.pageError" class="page-state page-state--error">
        <p>
          Something went wrong while loading this page.
        </p>

        <button
          type="button"
          class="button page-ui-button"
          :disabled="pagesStore.pageLoading"
          @click="pagesStore.fetchPublicPage(route.params.slug)"
        >
          {{ pagesStore.pageLoading ? "Retrying..." : "Retry" }}
        </button>
      </div>

      <template v-else-if="page">
        <p class="page-eyebrow">Published page</p>
        <h2 class="section-title public-page-title">
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
.page-eyebrow {
  margin-bottom: 6px;
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-align: center;
  text-transform: uppercase;
}

.page-content {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-surface);
  color: var(--color-muted-text);
  white-space: pre-line;
  line-height: 1.6;
}

.page-blocks {
  max-width: 760px;
  margin: 28px auto 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-block {
  min-width: 0;
}

.unsupported-block {
  margin: 0;
  padding: 16px;
  border: 1px solid #f5c2c0;
  border-left: 4px solid #c62828;
  border-radius: 8px;
  color: #c62828;
  background-color: #fdecea;
}

.public-page-title {
  margin-bottom: 24px;
}

@media (max-width: 480px) {
  .page-content {
    padding: 18px 16px;
  }

  .page-blocks {
    margin-top: 20px;
  }
}
</style>