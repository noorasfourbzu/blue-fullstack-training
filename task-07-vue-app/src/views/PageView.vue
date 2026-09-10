<script setup>
import { onMounted, computed } from "vue";
import { usePagesStore } from "../stores/pages.js";
import { useRouter } from "vue-router";
import FormStatusBanner from "../components/FormStatusBanner.vue";


const store = usePagesStore();
const router = useRouter();

onMounted(() => {
  store.fetchPages();
});


function goToCreate() {
  router.push({ name: "create-page" });
}

function goToEdit(page) {
  router.push({ name: "edit-page", params: { id: page.id } });
}

async function handleDelete(page) {
  if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return;

  try {
    await store.deletePage(page.id);
  } catch (err) {
  }}

  const deleteMessage = computed(() => {
  if (store.deleteForbidden) return "You are not allowed to delete this page. It belongs to another user.";
  if (store.deleteError) return "Something went wrong while deleting the page. Please try again.";
  return "";
});

const deleteBannerVariant = computed(() => (deleteMessage.value ? "error" : ""));
</script>

<template>
  <main class="pages-view">
    <section class="pages-header">
      <div>
        <h1>My Pages</h1>
        <p>Manage your website pages.</p>
      </div>

      <button class="button page-ui-button create-page-btn" @click="goToCreate">
        Create Page
      </button>
    </section>

    <!-- Loading -->
    <div v-if="store.loading" class="pages-state pages-state--loading">
      <p>Loading pages...</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="pages-state pages-state--error">
      <p>Failed to load pages.</p>

      <button class="button page-ui-button" @click="store.retryFetch">
        Try Again
      </button>
    </div>

    <!-- Empty -->
    <div v-else-if="store.pages.length === 0" class="pages-state pages-state--empty">
      <h2>No pages yet</h2>
      <p>Create your first page to get started.</p>

      <button class="button page-ui-button create-page-btn" @click="goToCreate">
        Create Page
      </button>
    </div>

    <!-- Pages -->
    <section v-else class="pages-list">
      <article
        v-for="page in store.pages"
        :key="page.id"
        class="page-card"
      >
        <div class="page-card-content">
          <h2>{{ page.title }}</h2>

          <p class="page-slug">
            /{{ page.slug }}
          </p>

          <span
            class="page-status"
            :class="`status-${page.status}`"
          >
            {{ page.status }}
          </span>
        </div>
    <div class="page-card-actions">
  <RouterLink
    v-if="page.status === 'published'"
    :to="`/p/${page.slug}`"
    class="button page-ui-button page-ui-button--secondary page-view-link"
  >
    View
  </RouterLink>

  <button class="button page-ui-button page-ui-button--secondary" @click="goToEdit(page)">
    Edit
  </button>

  <button
    class="button page-ui-button page-ui-button--danger"
    :disabled="store.deleting"
    @click="handleDelete(page)"
  >
    {{ store.deleting ? "Deleting..." : "Delete" }}
  </button>
</div>
      </article>
    </section>
    <FormStatusBanner :status="deleteBannerVariant" :message="deleteMessage" />
  </main>
</template>

<style scoped>
.pages-view {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 0;
}

.pages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.pages-header h1 {
  margin: 0 0 8px;
  color: var(--color-text);
  font-size: 2rem;
  line-height: 1.2;
}

.pages-header p {
  margin: 0;
  color: var(--color-muted-text);
}

.create-page-btn {
  flex-shrink: 0;
}

.pages-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 60px 20px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-surface);
  color: var(--color-muted-text);
  text-align: center;
}

.pages-state h2 {
  color: var(--color-text);
}

.pages-list {
  display: grid;
  gap: 20px;
}

.page-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-surface);
  box-shadow: 0 4px 15px rgba(37, 37, 37, 0.08);
}

.page-card-content {
  min-width: 0;
}

.page-card-content h2 {
  margin: 0 0 8px;
  color: var(--color-text);
  font-size: 1.25rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.page-slug {
  margin: 0 0 10px;
  color: var(--color-muted-text);
  font-size: 0.95rem;
  overflow-wrap: anywhere;
}

.page-status {
  display: inline-block;
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-published {
  border: none;
  border-radius: 0;
  color: #1e7e34;
}

.status-draft {
  color: var(--color-muted-text);
}

.page-card-actions {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

@media (max-width: 600px) {
  .pages-view {
    padding: 50px 0;
  }

  .pages-header,
  .page-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-card-actions {
    width: 100%;
  }

  .page-card-actions .page-ui-button,
  .page-card-actions .page-view-link {
    flex: 1 1 0;
  }
}

@media (max-width: 480px) {
  .pages-view {
    padding: 40px 0;
  }

  .pages-header {
    gap: 16px;
  }

  .create-page-btn {
    width: 100%;
  }

  .page-card {
    padding: 16px;
  }

  .page-card-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .page-card-actions .page-ui-button,
  .page-card-actions .page-view-link {
    width: 100%;
  }
}
</style>7 