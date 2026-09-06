<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import PostCard from "./PostCard.vue";
import { useRoute, useRouter } from "vue-router";
import CategoryFilter from "./CategoryFilter.vue";
import { usePostsStore } from "../stores/posts";


const props = defineProps({
  posts: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  error: { type: Boolean, required: true },
  fetchPosts: { type: Function, required: true },
  pagination: { type: Object, required: true },
  // goToPage: {type: Function,  required:true},
  categories: { type: Array, default: () => [] },
  selectedCategory: { type: [String, Number], default: null },
  selectCategory: { type: Function, required: true },
  myPosts: { type: Array, default: () => [] },
  myPostsLoading: { type: Boolean, default: false },
  myPostsError: { type: Boolean, default: false },
  myPostsPagination: {
    type: Object,
    default: () => ({ currentPage: 1, lastPage: 1, perPage: 0, total: 0 }),
  },
});

const postCategories = computed(() => [
  { id: null, name: "All" },
  ...props.categories,
]);

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();


// what the user is currently typing
const searchInput = ref(typeof route.query.q === "string" ? route.query.q : "");
// the term that has actually been searched - only this drives filtering,
// the URL query, and highlighting in PostCard
const appliedSearch = ref(searchInput.value);


const isMyPosts = computed(() => route.name === "my-posts");
const activePosts = computed(() =>
  isMyPosts.value ? props.myPosts : props.posts,
);
const activeLoading = computed(() =>
  isMyPosts.value ? props.myPostsLoading : props.loading,
);
const activeError = computed(() =>
  isMyPosts.value ? props.myPostsError : props.error,
);
const activePagination = computed(() =>
  isMyPosts.value ? props.myPostsPagination : props.pagination,
);

watch(isMyPosts, () => {
  loadPosts(1);
});
function loadPosts(page = 1) {
  props.fetchPosts(page, isMyPosts.value);
}


function goToMyPosts() {
  router.push({ name: "my-posts" });
}

function goToAllPosts() {
  router.push({ name: "posts" });
}

// drives the My Posts / All Posts slider switch; same navigation as before,
// just triggered from a toggle input instead of two separate buttons
function toggleMyPosts(event) {
  if (event.target.checked) {
    goToMyPosts();
  } else {
    goToAllPosts();
  }
}

// Filters panel: expanded by default on desktop, collapsed by default on
// tablet/mobile. Controlled explicitly with a ref (not native <details>)
// so visibility doesn't depend on CSS cascade/origin tricks.
const DESKTOP_QUERY = "(min-width: 769px)";
const showFilters = ref(
  typeof window !== "undefined" ? window.matchMedia(DESKTOP_QUERY).matches : true,
);

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

// if the window is resized (or rotated) into desktop width, force the
// panel open; on mobile/tablet widths we leave whatever the user chose
function syncFiltersOnResize() {
  if (window.matchMedia(DESKTOP_QUERY).matches) {
    showFilters.value = true;
  }
}

onMounted(() => {
  window.addEventListener("resize", syncFiltersOnResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", syncFiltersOnResize);
});

function goToPage(page) {
  props.fetchPosts(page, isMyPosts.value);
}

onMounted(() => {
    postsStore.setSearchTerm(appliedSearch.value);
  loadPosts();

});

const isSearching = computed(() => appliedSearch.value.trim().length > 0);

// runs the search: only called when the Search button is clicked
function runSearch() {
  appliedSearch.value = searchInput.value.trim();
   postsStore.setSearchTerm(appliedSearch.value);
  loadPosts(1);
}

function clearSearch() {
  searchInput.value = "";
  appliedSearch.value = "";
    postsStore.setSearchTerm("");
  loadPosts(1);
}
function selectCategory(categoryId) {
  props.selectCategory(categoryId);
  loadPosts(1);
}


const statusOptions = [
  { id: "", name: "All" },
  { id: "published", name: "Published" },
  { id: "draft", name: "Draft" },
];

function selectStatus(status) {
  postsStore.setMyPostsStatus(status);
  loadPosts(1);
}

watch(appliedSearch, (newValue) => {
  const trimmed = newValue.trim();
  const currentQ = typeof route.query.q === "string" ? route.query.q : "";
  if (trimmed === currentQ) return;

  const nextQuery = { ...route.query };
  if (trimmed) nextQuery.q = trimmed;
  else delete nextQuery.q;

  router.replace({ query: nextQuery });
});

// URL query changes from outside the search box
watch(
  () => route.query.q,
  (newQ) => {
    const value = typeof newQ === "string" ? newQ : "";
    if (value !== appliedSearch.value) {
      searchInput.value = value;
      appliedSearch.value = value;
      postsStore.setSearchTerm(value);
      loadPosts(1);
    }
  },
);
</script>

<template>
  <section id="latest-posts" class="section">
    <div class="container">
      <h2 class="section-title">
        {{ isMyPosts ? "My Posts" : "Latest Posts" }}
      </h2>

      <div class="posts-navigation">
        <label class="posts-toggle-switch">
          <input
            type="checkbox"
            class="posts-toggle-input"
            role="switch"
            :checked="isMyPosts"
            :aria-checked="isMyPosts"
            aria-label="Show only my posts"
            @change="toggleMyPosts"
          />
          <span class="posts-toggle-track" aria-hidden="true"></span>
          <span class="posts-toggle-label">{{
            isMyPosts ? "My Posts" : "All Posts"
          }}</span>
        </label>
      </div>

      <!-- Filters: always expanded on desktop; collapses behind a small
           icon toggle on tablet/mobile so the page doesn't feel crowded -->
      <div class="filters-panel">
        <button
          type="button"
          class="filters-toggle"
          :aria-expanded="showFilters"
          aria-controls="filters-panel-body"
          @click="toggleFilters"
        >
          <span aria-hidden="true">☰</span> Filters

        </button>



             <div
          v-show="showFilters"
          id="filters-panel-body"
          class="filters-panel-body"
        >
          <div class="filters-primary-row">
            <CategoryFilter
              :categories="postCategories"
              :selected="selectedCategory"
              @filter-change="selectCategory"
            />

            <div class="latest-posts-search-container">
              <textarea
                id="search-word"
                v-model="searchInput"
                name="search-word"
                rows="1"
                placeholder="Search posts by title..."
                maxlength="200"
                :disabled="activeLoading || activeError"
                @keydown.enter.prevent="runSearch"
              ></textarea>

              <button
                id="search-button"
                class="button"
                type="button"
                @click="runSearch"
              >
                Search
              </button>

              <button
                id="clear-search"
                class="button"
                type="button"
                @click="clearSearch"
              >
                Clear
              </button>
            </div>
          </div>

          <CategoryFilter
            v-if="isMyPosts"
            :categories="statusOptions"
            :selected="postsStore.myPostsStatus"
            @filter-change="selectStatus"
            class="status-filter-row"
          />
        </div>
      </div>

      <!-- Loading state -->
      <p v-if="activeLoading" class="posts-status">Loading posts...</p>

      <!-- Error state with Retry -->
      <div v-else-if="activeError" class="posts-status posts-status--error">
        <p>Something went wrong while loading posts.</p>
        <button type="button" @click="loadPosts(activePagination.currentPage)">
          Retry
        </button>
      </div>

            <!-- Success: no posts returned by the API at all -->
      <p
        v-else-if="!isSearching && activePosts.length === 0"
        class="posts-status posts-status--empty"
      >
        No posts are available right now.
      </p>

      <!-- Success: posts loaded, but the search matched nothing -->
      <div
        v-else-if="isSearching && activePosts.length === 0"
        class="posts-status posts-status--empty"
      >
        <p>No posts match "{{ appliedSearch }}".</p>
      </div>

      <!-- Success: posts to show -->
      <template v-else>               
        <p class="results-count" aria-live="polite">
          <span v-if="isSearching">
            {{ activePagination.total }} result{{
              activePagination.total === 1 ? "" : "s"
            }} for "{{appliedSearch}}"
          </span>
          <span v-else>
            Page {{ activePagination.currentPage }} of
            {{ activePagination.lastPage }} ---
            {{ activePagination.total }} posts total
          </span>
        </p>

        <div class="latest-posts-container">
          <PostCard
            v-for="post in activePosts"
            :key="post.id"
            :post="post"
            :search-term="appliedSearch"
          />
        </div>

        <div v-if="activePagination.lastPage > 1" class="pagination">
          <button
            type="button"
            :disabled="activePagination.currentPage === 1 || activeLoading"
            @click="goToPage(activePagination.currentPage - 1)"
          >
            Previous
          </button>

          <button
            v-for="page in activePagination.lastPage"
            :key="page"
            type="button"
            :class="{ active: page === activePagination.currentPage }"
            :disabled="activeLoading"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            type="button"
            :disabled="
              activePagination.currentPage === activePagination.lastPage ||
              activeLoading
            "
            @click="goToPage(activePagination.currentPage + 1)"
          >
            Next
          </button>
        </div>
      </template>
    </div>
  </section>
</template>