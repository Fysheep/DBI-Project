import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/users',
      name: 'user-list',
      component: () => import('@/views/UserList.vue')
    },
    {
      path: '/skins',
      name: 'skin-list',
      component: () => import('@/views/SkinList.vue')
    }
  ]
})

export default router
