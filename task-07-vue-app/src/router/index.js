import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import {ref} from 'vue'

export const previousRouteName = ref(null)

const router = createRouter({
  history: createWebHistory(),
  routes: [
     { path: '/', name: 'home',
         component: HomeView },

     {path: '/services', name: 'services', 
        component: () => import('../views/ServicesView.vue') },

 { path: '/posts', name: 'posts', 
    component: () => import('../views/PostsView.vue') },

 { path: '/posts/:id', name: 'post-details', 
    component: () => import('../views/PostDetailsView.vue') },
    {path: '/posts/create',
      name: 'create-post',
      component: CreatePostView
    },
{ path: '/favorites', name: 'favorites',
    component: () => import('../views/FavoritesView.vue') },

  { path: '/contact', name: 'contact', 
    component: () => import('../views/ContactView.vue') },

 { path: '/:pathMatch(.*)*', name: 'not-found',
     component: () => import('../views/NotFoundView.vue') }
  ]
})
router.beforeEach((to, from) => {
  previousRouteName.value = from.name
})


export default router