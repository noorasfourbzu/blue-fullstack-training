<script setup>
import { usePostsStore } from "../stores/posts";
import PostCard from "../components/PostCard.vue";

const store = usePostsStore();
</script>

<template>
  <section id="favorites" class="section">
    <div class="container">
      <h2 class="section-title">Favorite Posts</h2>

      <!-- Empty state: no favorites yet -->
      <p v-if="store.favoritePosts.length === 0" class="posts-status posts-status--empty">
        You haven't favorited any posts yet. Browse the
        <RouterLink to="/posts">posts list</RouterLink>
        and tap the heart on a post to add it here.
      </p>

      <!-- Favorited posts -->
      <template v-else>
        <p class="results-count" aria-live="polite">
          {{ store.favoritePosts.length }} favorite{{ store.favoritePosts.length === 1 ? "" : "s" }}
        </p>

        <div class="latest-posts-container">
          <PostCard
            v-for="post in store.favoritePosts"
            :key="post.id"
            :post="post"
          />
        </div>
      </template>
    </div>
  </section>
</template>