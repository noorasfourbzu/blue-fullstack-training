<script setup>
import { ref } from "vue";
import logo from "../../public/final-logo.webp";
import { usePostsStore } from "../stores/posts";
import { useAuthStore } from "../stores/auth";

const isMenuOpen = ref(false);
const postsStore = usePostsStore();
const authStore = useAuthStore();
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}
</script>
<template>
  <header class="site-header">
    <div class="container header-content">
      <a href="#main" class="skip"> Skip to main content </a>

      <RouterLink to="/" class="brand" @click="closeMenu">
        <img :src="logo" alt="AsfouraBandora company logo" class="brand-logo" />

        <h1>AsfouraBandora</h1>
      </RouterLink>

      <button
        type="button"
        class="menu-button"
        :aria-label="
          isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
        "
        aria-controls="main-navigation"
        :aria-expanded="isMenuOpen"
        @click="toggleMenu"
        @keydown.escape="closeMenu"
      >
        <span class="hamburger-icon" aria-hidden="true">☰</span>
        <span class="close-icon" aria-hidden="true">x</span>
      </button>

      <nav
        id="main-navigation"
        class="main-navigation"
        :class="{ 'is-open': isMenuOpen }"
        aria-label="Main navigation"
      >
        <RouterLink to="/" @click="closeMenu">Home</RouterLink>
        <RouterLink to="/services" @click="closeMenu">Services</RouterLink>
        <RouterLink to="/posts" @click="closeMenu">Posts</RouterLink>
        <RouterLink to="/contact" @click="closeMenu">Contact</RouterLink>
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/login"
          @click="closeMenu"
          >Login</RouterLink
        >
        <RouterLink v-else to="/account" @click="closeMenu">Account</RouterLink>
        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/posts/create"
          @click="closeMenu"
        >
          Create Post
        </RouterLink>
        <RouterLink to="/favorites" @click="closeMenu" class="favorites-link">
          Favorites
          <span class="favorite-badge">{{ postsStore.favoriteCount }}</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
