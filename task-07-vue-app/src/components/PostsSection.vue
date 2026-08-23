<script setup>
import { ref, computed, onUnmounted, watch } from "vue";
import PostCard from "./PostCard.vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  posts: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  error: { type: Boolean, required: true },
  fetchPosts: { type: Function, required: true },
});

// how many cards get added per batch
const CARDS_PER_BATCH = 10;

const route = useRoute();
const router =  useRouter();

// const searchWord = ref(typeof route.query.q === "string" ? route.query.q : "");
// // how many posts from the (filtered) list are currently revealed
// const currentIndex = ref(CARDS_PER_BATCH);

// // template ref for the sentinel element the IntersectionObserver watches
// const sentinelRef = ref(null);
// let scrollObserver = null;


// // title only search filter derived automatically from posts/searchWord
// const filteredPosts = computed(() => {
//   const query = searchWord.value.trim().toLowerCase();
//   if (!query) return props.posts;
//   return props.posts.filter((post) => post.title.toLowerCase().includes(query));
// });

// const isSearching = computed(() => searchWord.value.trim().length > 0);

// what the user is currently typing
const searchInput = ref(typeof route.query.q === "string" ? route.query.q : "");
// the term that has actually been searched - only this drives filtering,
// the URL query, and highlighting in PostCard
const appliedSearch = ref(searchInput.value);
// how many posts from the (filtered) list are currently revealed
const currentIndex = ref(CARDS_PER_BATCH);





// template ref for the sentinel element the IntersectionObserver watches
const sentinelRef = ref(null);
let scrollObserver = null;

// title only search filter derived from posts/appliedSearch
const filteredPosts = computed(() => {
  const query = appliedSearch.value.trim().toLowerCase();
  if (!query) return props.posts;
  return props.posts.filter((post) => post.title.toLowerCase().includes(query));
});
// while searching show every match at once 
// while browsing normally only reveal posts up to currentIndex 
const visiblePosts = computed(() => {
  if (isSearching.value) return filteredPosts.value;
  return filteredPosts.value.slice(0, currentIndex.value);
});

const isSearching = computed(() => appliedSearch.value.trim().length > 0);

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

// function clearSearch() {
//   searchWord.value = "";
//   currentIndex.value = CARDS_PER_BATCH; // restart lazy loading from the first batch
// }

// watch(() => props.posts, () => {
//   currentIndex.value = CARDS_PER_BATCH; 
// });

// // user types -> push the new value into the URL query string
// // (router.replace = no extra history entry per keystroke)
// watch(searchWord, (newValue) => {
//   const trimmed = newValue.trim();
//   const currentQ = typeof route.query.q === "string" ? route.query.q : "";
//   if (trimmed === currentQ) return;

//   const nextQuery = { ...route.query };
//   if (trimmed) nextQuery.q = trimmed;
//   else delete nextQuery.q;

//   router.replace({ query: nextQuery });
// });

// // URL query changes from outside typing (Back/Forward, shared link)
// // -> update the search box to match
// watch(
//   () => route.query.q,
//   (newQ) => {
//     const value = typeof newQ === "string" ? newQ : "";
//     if (value !== searchWord.value) {
//       searchWord.value = value;
//     }
//   }
// );

// runs the search: only called when the Search button is clicked
function runSearch() {
  appliedSearch.value = searchInput.value.trim();
  currentIndex.value = CARDS_PER_BATCH;
}

function clearSearch() {
  searchInput.value = "";
  appliedSearch.value = "";
  currentIndex.value = CARDS_PER_BATCH; // restart lazy loading from the first batch
}


watch(() => props.posts, () => {
  currentIndex.value = CARDS_PER_BATCH; 
});

// search is applied (button clicked / cleared) -> push it into the URL query string
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
  }
);

</script>

<template>
  <section id="latest-posts" class="section">
    <div class="container">
      <h2 class="section-title">Latest Posts</h2>

      <div class="latest-posts-search-container">
        <textarea
          id="search-word"
          v-model="searchInput"
          name="search-word"
          rows="1"
          placeholder="Search posts by title..."
          maxlength="200"
          :disabled="loading || error"
          @keydown.enter.prevent="runSearch"
        ></textarea>

        <button id = "search-button"  class ="button" type="button" @click="runSearch">
          Search
        </button>

        <button  id = "clear-search" class = "button" type="button" @click="clearSearch">
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
        <p>No posts match "{{ searchInput }}".</p>
       
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
            :search-term="appliedSearch"
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
