
<script setup>
import { ref } from "vue";
import logo from "../../public/final-logo.webp";

const isMenuOpen = ref(false);

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

      <a href="#main" class="skip">
        Skip to main content
      </a>

      <a href="#home" class="brand" @click="closeMenu">
     <img
    :src="logo"
    alt="AsfouraBandora company logo"
    class="brand-logo"
>

        <h1>AsfouraBandora</h1>
      </a>

      <button
        type="button"
        class="menu-button"
        :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
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
        <a href="#home" @click="closeMenu">Home</a>
        <a href="#about" @click="closeMenu">About Us</a>
        <a href="#services" @click="closeMenu">Services</a>
        <a href="#statistics" @click="closeMenu">Statistics</a>
        <a href="#contact" @click="closeMenu">Contact</a>
      </nav>

    </div>
  </header>
</template>
