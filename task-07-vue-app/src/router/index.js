import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CreatePostView from "../views/CreatePostView.vue";
import AccountView from "../views/AccountView.vue";
import PageView from "../views/PageView.vue";
import { ref } from "vue";

import { useAuthStore } from "../stores/auth.js";

export const previousRouteName = ref(null);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    {
      path: "/services",
      name: "services",
      component: () => import("../views/ServicesView.vue"),
    },

    {
      path: "/posts",
      name: "posts",
      component: () => import("../views/PostsView.vue"),
    },

    {
      path: "/my-posts",
      name: "my-posts",
      component: () => import("../views/PostsView.vue"),
      meta: { requiresAuth: true },
    },
    { path: '/posts/:id/edit', name: 'edit-post',
    component: () => import('../views/EditPostView.vue'),
    meta: { requiresAuth: true } },

    {
      path: "/posts/:id",
      name: "post-details",
      component: () => import("../views/PostDetailsView.vue"),
    },

    {
      path: "/posts/create",
      name: "create-post",
      component: CreatePostView,
      meta: { requiresAuth: true },
    },

    {
      path: "/favorites",
      name: "favorites",
      component: () => import("../views/FavoritesView.vue"),
    },

    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },

    {
      path: "/account",
      name: "account",
      component: AccountView,
    },

{
  path: "/pages",
  name: "pages",
  component: () => import("../views/PageView.vue"),
  meta: { requiresAuth: true },
},
{
  path: "/pages/create",
  name: "create-page",
  component: () => import("../views/CreatePageView.vue"),
  meta: { requiresAuth: true },
},

{
  path: "/pages/:id/edit",
  name: "edit-page",
  component: () => import("../views/EditPageView.vue"),
  meta: { requiresAuth: true },
},

{
  path: "/p/:slug",
  name: "public-page",
  component: () => import("../views/PublicPageView.vue"),
},
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});
router.beforeEach((to, from) => {
  previousRouteName.value = from.name;
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }
});

export default router;
