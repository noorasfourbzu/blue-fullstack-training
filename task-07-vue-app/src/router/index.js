import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
     { path: '/', name: 'home', component: HomeView },
     {path: '/services', name: 'services', component: () => import('../views/ServicesView.vue') },
 { path: '/posts', name: 'posts', component: () => import('../views/PostsView.vue') },
  { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
 { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
  ]
})

export default router