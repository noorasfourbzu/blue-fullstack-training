<script setup>
import { usePosts } from "../composables/usePosts";
import { onMounted } from "vue";
import PostsSection from "../components/PostsSection.vue";
const { posts, loading, error, fetchPosts } = usePosts();

onMounted(fetchPosts);
</script>

<template>
 <PostsSection
    :posts="posts"
    :loading="loading"
    :error="error"
    :fetch-posts="fetchPosts"
  />
  </template>