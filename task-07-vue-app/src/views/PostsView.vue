<script setup>
import { onMounted } from "vue";
import PostsSection from "../components/PostsSection.vue";
import { usePostsStore } from "../stores/posts.js";


const store = usePostsStore();
onMounted(()=>{
  store.fetchPosts();
  
});
</script>

<template>
 <PostsSection
    :posts="store.posts"
    :loading="store.loading"
    :error="store.error"
    :fetch-posts="store.fetchPosts"
  />
  </template>