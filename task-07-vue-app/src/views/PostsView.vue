<script setup>
import { onMounted } from "vue";
import PostsSection from "../components/PostsSection.vue";
import { usePostsStore } from "../stores/posts.js";

const store = usePostsStore();

onMounted(() => {
  store.fetchCategories();
});
</script>

<template>
  <PostsSection
    :posts="store.posts"
    :loading="store.loading"
    :error="store.error"
    :fetch-posts="store.fetchPosts"
    :my-posts="store.myPosts"
    :my-posts-loading="store.myPostsLoading"
    :my-posts-error="store.myPostsError"
    :my-posts-pagination="store.myPostsPagination"
    :pagination="store.pagination"
    :categories="store.categories"
    :selected-category="store.selectedCategory"
    :select-category="store.selectCategory"
  />
</template>
