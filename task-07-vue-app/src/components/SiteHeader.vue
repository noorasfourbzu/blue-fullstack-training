
<script>
import logo from "../images/final-logo.webp";
</script>
<template>

  <header class="site-header">
    <div class="container header-content">

      <a href="#main" class="skip">
        Skip to main content
      </a>

      <a href="#home" class="brand">
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
        aria-label="Open navigation menu"
        aria-controls="main-navigation"
        aria-expanded="false"
      >
        <span class="hamburger-icon" aria-hidden="true">☰</span>
        <span class="close-icon" aria-hidden="true">x</span>
      </button>

      <nav
        id="main-navigation"
        class="main-navigation"
        aria-label="Main navigation"
      >
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#services">Services</a>
        <a href="#statistics">Statistics</a>
        <a href="#contact">Contact</a>
      </nav>

    </div>
  </header>
</template>