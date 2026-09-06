<script setup>
import { ref, computed, watch, onMounted } from "vue";
import PostCard from "./PostCard.vue";
import { useRoute, useRouter } from "vue-router";
import CategoryFilter from "./CategoryFilter.vue";

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

// what the user is currently typing
const searchInput = ref(typeof route.query.q === "string" ? route.query.q : "");
// the term that has actually been searched - only this drives filtering,
// the URL query, and highlighting in PostCard
const appliedSearch = ref(searchInput.value);

//******* come to fix it later: this only filters the current page not all pages together */
// title only search filter derived from posts/appliedSearch
const filteredPosts = computed(() => {
  const query = appliedSearch.value.trim().toLowerCase();
  if (!query) return activePosts.value;
  return activePosts.value.filter((post) =>
    post.title.toLowerCase().includes(query),
  );
});
const visiblePosts = computed(() => {
  return filteredPosts.value;
});

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

function goToPage(page) {
  props.fetchPosts(page, isMyPosts.value);
}

onMounted(() => {
  loadPosts();
});

const isSearching = computed(() => appliedSearch.value.trim().length > 0);

// runs the search: only called when the Search button is clicked
function runSearch() {
  appliedSearch.value = searchInput.value.trim();
}

function clearSearch() {
  searchInput.value = "";
  appliedSearch.value = "";
}
function selectCategory(categoryId) {
  props.selectCategory(categoryId);
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
        <button
          v-if="!isMyPosts"
          type="button"
          class="button"
          @click="goToMyPosts"
        >
          My Posts
        </button>
        <button v-else type="button" class="button" @click="goToAllPosts">
          All Posts
        </button>
      </div>
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
        v-else-if="activePosts.length === 0"
        class="posts-status posts-status--empty"
      >
        No posts are available right now.
      </p>

      <!-- Success: posts loaded, but the search matched nothing -->
      <div
        v-else-if="filteredPosts.length === 0"
        class="posts-status posts-status--empty"
      >
        <p>No posts match "{{ searchInput }}".</p>
      </div>

      <!-- Success: posts to show -->
      <template v-else>
        <p class="results-count" aria-live="polite">
          <span v-if="isSearching">
            {{ filteredPosts.length }} result{{
              filteredPosts.length === 1 ? "" : "s"
            }}
          </span>
          <span v-else>
            Page {{ activePagination.currentPage }} of
            {{ activePagination.lastPage }} ---
            {{ activePagination.total }} posts total
          </span>
        </p>

        <div class="latest-posts-container">
          <PostCard
            v-for="post in visiblePosts"
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
