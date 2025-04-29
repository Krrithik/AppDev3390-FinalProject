import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LikesPage from '@/views/LikesPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import DiaryPage from '@/views/DiaryPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/diary',
      name: 'diary',
      component: DiaryPage,
    },
    {
      path: '/likes',
      name: 'likes',
      component: LikesPage,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutPage.vue'),
    },
  ],
})

export default router
