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

      <button class="create-page-btn" @click="goToCreate">
  Create Page
  </button>
    </section>

    <!-- Loading -->
    <div v-if="store.loading" class="pages-state">
      <p>Loading pages...</p>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="pages-state">
      <p>Failed to load pages.</p>

      <button @click="store.retryFetch">
        Try Again
      </button>
    </div>

    <!-- Empty -->
    <div v-else-if="store.pages.length === 0" class="pages-state">
      <h2>No pages yet</h2>
      <p>Create your first page to get started.</p>

      <button class="create-page-btn">
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
    class="page-view-link"
  >
    View
  </RouterLink>

  <button @click="goToEdit(page)">
    Edit
  </button>

  <button :disabled="store.deleting" @click="handleDelete(page)">
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
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
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
}

.pages-header p {
  margin: 0;
}

.create-page-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.pages-state {
  text-align: center;
  padding: 60px 20px;
}

.pages-state button {
  margin-top: 15px;
}

.pages-list {
  display: grid;
  gap: 16px;
}

.page-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.page-card-content h2 {
  margin: 0 0 8px;
}

.page-slug {
  margin: 0 0 10px;
  opacity: 0.7;
}

.page-status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  text-transform: capitalize;
}

.status-published {
  background: #e7f7ed;
}

.status-draft {
  background: #f1f1f1;
}

.page-card-actions {
  display: flex;
  gap: 10px;
}

.page-card-actions button {
  padding: 8px 14px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .pages-header,
  .page-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-card-actions {
    width: 100%;
  }
}
</style>7 