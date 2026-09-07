<script setup>
import SiteHeader from "./components/SiteHeader.vue";
//import HeroSection from "./components/HeroSection.vue";
//import ServicesSection from "./components/ServicesSection.vue";
//import PostsSection from "./components/PostsSection.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { onMounted, onUnmounted , watch } from "vue";
import { usePostsStore } from "./stores/posts";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const postsStore = usePostsStore();
const authStore = useAuthStore();


function handleUnauthorized() {
  authStore.clearSession();
  router.push({ name: "login", query: { sessionExpired: "1" } });
}
onMounted( async () => {
    window.addEventListener("auth:unauthorized", handleUnauthorized);
  await authStore.restoreSession();
  postsStore.restoreFavorites();
});
watch(
  () => authStore.user?.id,
  () => {
    postsStore.restoreFavorites();
  }
);
onUnmounted(() => window.removeEventListener("auth:unauthorized", handleUnauthorized));
</script>

<template>
  <SiteHeader />

  <main id="main">
    <RouterView />

    <!-- <HeroSection /> -->

    <!-- <ServicesSection /> -->

    <!-- <PostsSection /> -->
  </main>

  <SiteFooter />
</template>
