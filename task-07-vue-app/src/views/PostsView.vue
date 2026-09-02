<script setup>
import { onMounted } from "vue";
import PostsSection from "../components/PostsSection.vue";
import { usePostsStore } from "../stores/posts.js";


const store = usePostsStore();
onMounted(()=>{
  store.fetchCategories();
  store.fetchPosts();
  
});
</script>

<template>
 <PostsSection
    :posts="store.posts"
    :loading="store.loading"
    :error="store.error"
    :fetch-posts="store.fetchPosts"
    :pagination="store.pagination"
    :go-to-page="store.goToPage"
    :categories="store.categories"
    :selected-category="store.selectedCategory"
    :select-category="store.selectCategory"
  />
  </template>