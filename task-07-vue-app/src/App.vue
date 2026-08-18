<script setup>
import SiteHeader from "./components/SiteHeader.vue";
//import HeroSection from "./components/HeroSection.vue";
//import ServicesSection from "./components/ServicesSection.vue";
//import PostsSection from "./components/PostsSection.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { onMounted } from "vue";
import { usePostsStore } from "./stores/posts";
const postsStore = usePostsStore();

onMounted(() => {
  postsStore.restoreFavorites();
});
</script>

<template>

  <SiteHeader />

  <main id="main">
    <RouterView />

    <!-- <HeroSection /> -->

    <!-- <ServicesSection /> -->

    <!-- <PostsSection /> -->

  </main>

     <SiteFooter/>

</template>