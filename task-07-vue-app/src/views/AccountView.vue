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
        <header class="account-header">
          <div class="account-avatar" aria-hidden="true">
            {{ initials }}
          </div>

          <div class="account-heading">
            <h2>My Account</h2>
            <p class="account-message">
              You are successfully logged in to your account.
            </p>
          </div>
        </header>

        <section
          class="account-details-panel"
          aria-labelledby="account-details-title"
        >
          <div class="account-panel-heading">
            <h3 id="account-details-title">Profile details</h3>
          </div>

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
        </section>

        <nav class="account-actions" aria-label="Account actions">
          <RouterLink to="/pages" class="button account-manage-pages">
            Manage My Pages
          </RouterLink>

          <button
            type="button"
            class="button account-logout"
            @click="handleLogout"
          >
            Logout
          </button>
        </nav>
      </div>

      <div v-else class="account-loading">
        <p>Loading your account...</p>
      </div>
    </div>
  </section>
</template>
