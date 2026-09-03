<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const initials = computed(() => {
  const name = authStore.user?.name ?? "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
});

onMounted(async () => {
  try {
    await authStore.fetchUser();
  } catch (error) {
    router.push({ name: "login" });
  }
});

async function handleLogout() {
  await authStore.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <section id="account" class="section">
    <div class="container">
      <div v-if="authStore.user" id="account-card" class="account-card">
        <div class="account-avatar" aria-hidden="true">{{ initials }}</div>

        <header class="account-header">
          <h2 class="section-title">My Account</h2>
        </header>

        <dl class="account-details">
          <div class="account-detail">
            <dt>Name</dt>
            <dd>{{ authStore.user.name }}</dd>
          </div>
          <div class="account-detail">
            <dt>Email</dt>
            <dd>{{ authStore.user.email }}</dd>
          </div>
        </dl>

        <p class="account-message">You are successfully logged in to your account.</p>

        <button type="button" class="button account-logout" @click="handleLogout">
          Logout
        </button>
      </div>

      <div v-else class="account-loading">
        <p>Loading your account...</p>
      </div>
    </div>
  </section>
</template>