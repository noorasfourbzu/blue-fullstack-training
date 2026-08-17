<script setup>
import SiteHeader from "./components/SiteHeader.vue";
//import HeroSection from "./components/HeroSection.vue";
//import ServicesSection from "./components/ServicesSection.vue";
//import PostsSection from "./components/PostsSection.vue";
import SiteFooter from "./components/SiteFooter.vue";
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