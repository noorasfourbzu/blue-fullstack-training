<script setup>
import { reactive, computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePagesStore } from "../stores/pages.js";
import FormStatusBanner from "../components/FormStatusBanner.vue";
import { useBlocksStore } from "../stores/blocks.js";
import PageBlocksManager from "../components/PageBlocksManager.vue";

const blocksStore = useBlocksStore();
const route = useRoute();
const router = useRouter();
const pagesStore = usePagesStore();

const form = reactive({
  title: "",
  slug: "",
  content: "",
  status: "draft",
});

const formStatus = ref(""); // '', 'success', 'validationerror', 'submiterror', 'forbidden'
const backendErrors = ref({});

onMounted(async () => {
  try {
    const page = await pagesStore.fetchPage(route.params.id);
    if (page) {
      form.title = page.title;
      form.slug = page.slug;
      form.content = page.content;
      form.status = page.status;
      blocksStore.setBlocks(page.blocks);
    }
  } catch (err) {
    // pageForbidden/notFound/pageError are already set inside the store.
    // Nothing else to do here ,the template reacts to those flags below.
  }
});

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 255;
const MIN_CONTENT_LENGTH = 10;
const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

const titleError = computed(() => {
  const value = form.title.trim();
  if (!value) return "Title is required.";
  if (value.length < MIN_TITLE_LENGTH) return `Title must be at least ${MIN_TITLE_LENGTH} characters.`;
  if (value.length > MAX_TITLE_LENGTH) return `Title must be under ${MAX_TITLE_LENGTH} characters.`;
  return "";
});

const slugError = computed(() => {
  const value = form.slug.trim();
  if (!value) return "Slug is required.";
  if (!SLUG_PATTERN.test(value)) return "Slug can only contain letters, numbers, dashes and underscores.";
  return "";
});

const contentError = computed(() => {
  const value = form.content.trim();
  if (!value) return "Content is required.";
  if (value.length < MIN_CONTENT_LENGTH) return `Content must be at least ${MIN_CONTENT_LENGTH} characters.`;
  return "";
});

const isFormValid = computed(() => !titleError.value && !slugError.value && !contentError.value);

const statusMessage = computed(() => {
  if (formStatus.value === "success") return "Page updated successfully.";
  if (formStatus.value === "validation-error") return "Please check the highlighted fields above.";
  if (formStatus.value === "forbidden") return "You are not allowed to edit this page. It belongs to another user.";
  if (formStatus.value === "submit-error") return "Something went wrong while updating the page. Please try again.";
  return "";
});

const bannerVariant = computed(() => (formStatus.value === "success" ? "success" : formStatus.value ? "error" : ""));

function goBack() {
  router.push({ name: "pages" });
}

async function handleSubmit() {
  if (!isFormValid.value) {
    formStatus.value = "validation-error";
    return;
  }

  formStatus.value = "";
  backendErrors.value = {};

  try {
    await pagesStore.updatePage(route.params.id, {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content.trim(),
      status: form.status,
    });
    formStatus.value = "success";
    setTimeout(() => router.push({ name: "pages" }), 800);
  } catch (err) {
    if (err.status === 403) {
      formStatus.value = "forbidden";
    } else if (err.status === 422) {
      formStatus.value = "validation-error";
      backendErrors.value = err.errors || {};
    } else {
      formStatus.value = "submit-error";
    }
  }
}
</script>

<template>
  <section id="edit-page" class="section">
    <div class="container">
      <p v-if="pagesStore.pageLoading" class="page-state page-state--loading">Loading page...</p>

      <div v-else-if="pagesStore.pageForbidden" class="page-state page-state--error">
        <p>You are not allowed to edit this page. It belongs to another user.</p>
        <button type="button" class="button page-ui-button" @click="goBack">Back to Pages</button>
      </div>

      <div v-else-if="pagesStore.notFound" class="page-state page-state--empty">
        <p>We couldn't find a page with id "{{ route.params.id }}".</p>
        <button type="button" class="button page-ui-button page-ui-button--secondary" @click="goBack">Back to Pages</button>
      </div>

      <div v-else-if="pagesStore.pageError" class="page-state page-state--error">
        <p>Something went wrong while loading the page.</p>
        <button
          type="button"
          class="button page-ui-button"
          :disabled="pagesStore.pageLoading"
          @click="pagesStore.fetchPage(route.params.id)"
        >
          {{ pagesStore.pageLoading ? "Retrying..." : "Retry" }}
        </button>
      </div>

      <template v-else>
        <h2 class="section-title">Edit Page</h2>
        <form id="edit-page-form" class="page-editor-form" novalidate @submit.prevent="handleSubmit">
          <div class="page-form-field">
            <label for="edit-page-title">Title</label>
            <input id="edit-page-title" v-model="form.title" type="text" class="form-control" :maxlength="MAX_TITLE_LENGTH" />
            <small class="error-message">{{ titleError }}</small>
            <small v-if="backendErrors.title" class="error-message">{{ backendErrors.title[0] }}</small>
          </div>

          <div class="page-form-field">
            <label for="edit-page-slug">Slug</label>
            <input id="edit-page-slug" v-model="form.slug" type="text" class="form-control" />
            <small class="character-counter">Public URL: /p/{{ form.slug }}</small>
            <small class="error-message">{{ slugError }}</small>
            <small v-if="backendErrors.slug" class="error-message">{{ backendErrors.slug[0] }}</small>
          </div>

          <div class="page-form-field">
            <label for="edit-page-content">Content</label>
            <textarea id="edit-page-content" v-model="form.content" rows="8" class="form-control"></textarea>
            <small class="error-message">{{ contentError }}</small>
            <small v-if="backendErrors.content" class="error-message">{{ backendErrors.content[0] }}</small>
          </div>

          <div class="page-form-field">
            <fieldset>
              <legend>Save as</legend>
              <label><input type="radio" value="draft" v-model="form.status" /> Draft</label>
              <label><input type="radio" value="published" v-model="form.status" /> Publish</label>
            </fieldset>
          </div>

          <div class="page-form-actions">
            <button type="submit" class="button page-ui-button" :disabled="pagesStore.updating">
              {{ pagesStore.updating ? "Saving..." : "Save Changes" }}
            </button>
            <button type="button" class="button page-ui-button page-ui-button--secondary" @click="goBack">Cancel</button>
          </div>

          <FormStatusBanner :status="bannerVariant" :message="statusMessage" />
        </form>
        <PageBlocksManager :page-id="route.params.id" :initial-blocks="pagesStore.currentPage?.blocks || []" />
      </template>
    </div>
  </section>
</template>