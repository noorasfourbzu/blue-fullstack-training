<script setup>
import SiteHeader from "./components/SiteHeader.vue";
//import HeroSection from "./components/HeroSection.vue";
//import ServicesSection from "./components/ServicesSection.vue";
//import PostsSection from "./components/PostsSection.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { onMounted } from "vue";
import { usePostsStore } from "./stores/posts";
import {useAuthStore} from "./stores/auth";

const postsStore = usePostsStore();
const authStore = useAuthStore();

onMounted(() => {
  postsStore.restoreFavorites();
  authStore.restoreSession();
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