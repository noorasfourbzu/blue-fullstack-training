<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import PostCard from "./PostCard.vue";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// how many cards get added per batch
const CARDS_PER_BATCH = 10;

// reactive state 
const posts = ref([]);
const searchWord = ref("");
const loading = ref(false);
const error = ref(false);

// how many posts from the (filtered) list are currently revealed
const currentIndex = ref(CARDS_PER_BATCH);

// template ref for the sentinel element the IntersectionObserver watches
const sentinelRef = ref(null);
let scrollObserver = null;

async function fetchPosts() {
  loading.value = true;
  error.value = false;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch posts");
    posts.value = await response.json();
    currentIndex.value = CARDS_PER_BATCH; // start lazy loading from the first batch
  } catch (err) {
    error.value = true;
    posts.value = [];
  } finally {
    loading.value = false;
  }
}

// title only search filter derived automatically from posts/searchWord
const filteredPosts = computed(() => {
  const query = searchWord.value.trim().toLowerCase();
  if (!query) return posts.value;
  return posts.value.filter((post) => post.title.toLowerCase().includes(query));
});

const isSearching = computed(() => searchWord.value.trim().length > 0);

// while searching show every match at once 
// while browsing normally only reveal posts up to currentIndex 
const visiblePosts = computed(() => {
  if (isSearching.value) return filteredPosts.value;
  return filteredPosts.value.slice(0, currentIndex.value);
});

const hasMore = computed(
  () => !isSearching.value && currentIndex.value < filteredPosts.value.length
);

function loadMore() {
  if (!hasMore.value) return;
  currentIndex.value = Math.min(
    currentIndex.value + CARDS_PER_BATCH,
    filteredPosts.value.length
  );
}

// re create the observer whenever the sentinel element mounts/unmounts.
// the sentinel only exists in the DOM while hasMore is true so this runs again automatically once more posts are revealed
watch(sentinelRef, (el) => {
  if (scrollObserver) scrollObserver.disconnect();
  if (!el) return;

  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) loadMore();
      });
    },
    { rootMargin: "0px 0px 200px 0px", threshold: 0.1 }
  );
  scrollObserver.observe(el);
});

onUnmounted(() => {
  if (scrollObserver) scrollObserver.disconnect();
});

function clearSearch() {
  searchWord.value = "";
  currentIndex.value = CARDS_PER_BATCH; // restart lazy loading from the first batch
}

onMounted(fetchPosts);
</script>

<template>
  <section id="latest-posts" class="section">
    <div class="container">
      <h2 class="section-title">Latest Posts</h2>

      <div class="latest-posts-search-container">
        <textarea
          id="search-word"
          v-model="searchWord"
          name="search-word"
          rows="1"
          placeholder="Search posts by title..."
          maxlength="200"
          :disabled="loading || error"
        ></textarea>

        <button id = "search-button" type="button" @click="searchWord = searchWord.trim()">
          Search
        </button>

        <button  id = "clear-search" type="button" @click="clearSearch">
          Clear
        </button>
      </div>

      <!-- Loading state -->
      <p v-if="loading" class="posts-status">
        Loading posts...
      </p>

      <!-- Error state with Retry -->
      <div v-else-if="error" class="posts-status posts-status--error">
        <p>Something went wrong while loading posts.</p>
        <button type="button" @click="fetchPosts">
          Retry
        </button>
      </div>

      <!-- Success: no posts returned by the API at all -->
      <p v-else-if="posts.length === 0" class="posts-status posts-status--empty">
        No posts are available right now.
      </p>

      <!-- Success: posts loaded, but the search matched nothing -->
      <div v-else-if="filteredPosts.length === 0" class="posts-status posts-status--empty">
        <p>No posts match "{{ searchWord }}".</p>
        <button type="button" @click="clearSearch">
          Clear search
        </button>
      </div>

      <!-- Success: posts to show -->
      <template v-else>
        <p class="results-count" aria-live="polite">
          <span v-if="isSearching">
            {{ filteredPosts.length }} result{{ filteredPosts.length === 1 ? "" : "s" }}
          </span>
          <span v-else>
            {{ visiblePosts.length }} of {{ filteredPosts.length }} posts shown
          </span>
        </p>

        <div class="latest-posts-container">
          <PostCard
            v-for="post in visiblePosts"
            :key="post.id"
            :post="post"
          />
        </div>

        <!-- Sentinel the IntersectionObserver watches to trigger the next batch -->
        <div
          v-if="hasMore"
          ref="sentinelRef"
          class="posts-loading-more"
        >
          Loading more…
        </div>
        <p v-else-if="!isSearching" class="posts-end-message">
          You've reached the end of the list
        </p>
      </template>
    </div>
  </section>
</template>
