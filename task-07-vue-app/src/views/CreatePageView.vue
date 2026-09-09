<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { usePagesStore } from "../stores/pages.js";
import FormStatusBanner from "../components/FormStatusBanner.vue";

const pagesStore = usePagesStore();
const router = useRouter();

// form state
const form = reactive({
  title: "",
  slug: "",
  content: "",
  status: "draft",
});

// track which field user interacted with
const touched = reactive({
  title: false,
  slug: false,
  content: false,
  status: false,
});

function markTouched(field) {
  touched[field] = true;
}

// validation rules
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 255;
const MIN_CONTENT_LENGTH = 10;
const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

const titleError = computed(() => {
  const value = form.title.trim();
  if (!value) return "Title is required.";
  if (value.length < MIN_TITLE_LENGTH) {
    return `Title must be at least ${MIN_TITLE_LENGTH} characters.`;
  }
  if (value.length > MAX_TITLE_LENGTH) {
    return `Title must be under ${MAX_TITLE_LENGTH} characters.`;
  }
  return "";
});

const slugError = computed(() => {
  const value = form.slug.trim();
  if (!value) return "Slug is required.";
  if (!SLUG_PATTERN.test(value)) {
    return "Slug can only contain letters, numbers, dashes and underscores.";
  }
  return "";
});

const contentError = computed(() => {
  const value = form.content.trim();
  if (!value) return "Content is required.";
  if (value.length < MIN_CONTENT_LENGTH) {
    return `Content must be at least ${MIN_CONTENT_LENGTH} characters.`;
  }
  return "";
});

const statusError = computed(() => {
  if (!["draft", "published"].includes(form.status)) {
    return "Please select a valid status.";
  }
  return "";
});

// overall form validity
const isFormValid = computed(() => {
  return (
    !titleError.value &&
    !slugError.value &&
    !contentError.value &&
    !statusError.value
  );
});

// submission state
const isSubmitting = computed(() => pagesStore.submitting);
const formStatus = ref("");
const backendErrors = ref({});

const bannerVariant = computed(() => {
  if (formStatus.value === "success") return "success";
  if (
    formStatus.value === "validation-error" ||
    formStatus.value === "submit-error"
  )
    return "error";
  return "";
});

const statusMessage = computed(() => {
  if (formStatus.value === "success") {
    return "Page created successfully. Redirecting to your pages...";
  }
  if (formStatus.value === "validation-error") {
    return "Please check the highlighted fields above and make sure they match the required rules.";
  }
  if (formStatus.value === "submit-error") {
    return "Something went wrong. Please check your connection and try again.";
  }
  return "";
});

// auto-generate a slug suggestion from the title, but only while the
// user hasn't typed into the slug field themselves
function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function handleTitleInput() {
  if (!touched.slug) {
    form.slug = slugify(form.title);
  }
}

async function handleSubmit() {
  // mark all fields touched so all errors show if user tries to submit early
  touched.title = true;
  touched.slug = true;
  touched.content = true;
  touched.status = true;

  if (!isFormValid.value) {
    formStatus.value = "validation-error";
    return;
  }

  formStatus.value = "";
  backendErrors.value = {};

  try {
    const created = await pagesStore.createPage({
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content.trim(),
      status: form.status,
    });

    formStatus.value = "success";

    router.push({ name: "pages" });

    return created;
  } catch (err) {
    console.error(err);
    if (err.status === 422) {
      formStatus.value = "validation-error";
      backendErrors.value = err.errors || {};
    } else {
      formStatus.value = "submit-error";
    }
  }
}

function recheckIfInvalid(field) {
  touched[field] = touched[field] || false;
}
</script>

<template>
  <section id="create-page" class="section">
    <div class="container">
      <h2 class="section-title">Create New Page</h2>

      <form id="create-page-form" novalidate @submit.prevent="handleSubmit">
        <!-- title field -->
        <label for="page-title">Title</label>
        <input
          id="page-title"
          v-model="form.title"
          type="text"
          name="title"
          placeholder="Enter the page title"
          required
          class="form-control"
          :class="{ 'is-invalid': touched.title && titleError }"
          :aria-invalid="touched.title && titleError ? 'true' : 'false'"
          aria-describedby="page-title-error"
          :maxlength="MAX_TITLE_LENGTH"
          @input="
            recheckIfInvalid('title');
            handleTitleInput();
          "
          @blur="markTouched('title')"
        />
        <small id="page-title-error" class="error-message">
          {{ touched.title ? titleError : "" }}
        </small>
        <small v-if="backendErrors.title" class="error-message">
          {{ backendErrors.title[0] }}
        </small>

        <!-- slug field -->
        <label for="page-slug">Slug</label>
        <input
          id="page-slug"
          v-model="form.slug"
          type="text"
          name="slug"
          placeholder="e.g. about-us"
          required
          class="form-control"
          :class="{ 'is-invalid': touched.slug && slugError }"
          :aria-invalid="touched.slug && slugError ? 'true' : 'false'"
          aria-describedby="page-slug-error"
          @input="recheckIfInvalid('slug')"
          @blur="markTouched('slug')"
        />
        <small class="character-counter">
          This will be your page's public URL: /p/{{ form.slug || "your-slug" }}
        </small>
        <small id="page-slug-error" class="error-message">
          {{ touched.slug ? slugError : "" }}
        </small>
        <small v-if="backendErrors.slug" class="error-message">
          {{ backendErrors.slug[0] }}
        </small>

        <!-- content field -->
        <label for="page-content">Content</label>
        <textarea
          id="page-content"
          v-model="form.content"
          name="content"
          rows="8"
          placeholder="Write the page content here"
          required
          class="form-control"
          :class="{ 'is-invalid': touched.content && contentError }"
          :aria-invalid="touched.content && contentError ? 'true' : 'false'"
          aria-describedby="page-content-error"
          @input="recheckIfInvalid('content')"
          @blur="markTouched('content')"
        ></textarea>
        <small id="page-content-error" class="error-message">
          {{ touched.content ? contentError : "" }}
        </small>
        <small v-if="backendErrors.content" class="error-message">
          {{ backendErrors.content[0] }}
        </small>

        <!-- status field -->
        <fieldset>
          <legend>Save as</legend>
          <label>
            <input
              type="radio"
              value="draft"
              v-model="form.status"
              @change="touched.status = true"
            />
            Draft</label
          >
          <label>
            <input
              type="radio"
              value="published"
              v-model="form.status"
              @change="touched.status = true"
            />
            Publish</label
          >
        </fieldset>
        <small class="error-message">
          {{ touched.status ? statusError : "" }}
        </small>
        <small v-if="backendErrors.status" class="error-message">
          {{ backendErrors.status[0] }}
        </small>

        <button type="submit" class="button" :disabled="isSubmitting">
          {{
            isSubmitting
              ? "Submitting..."
              : formStatus === "submit-error"
                ? "Retry"
                : "Create Page"
          }}
        </button>

        <FormStatusBanner :status="bannerVariant" :message="statusMessage" />
      </form>
    </div>
  </section>
</template>