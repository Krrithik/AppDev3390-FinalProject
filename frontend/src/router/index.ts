import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LikesPage from '@/views/LikesPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import DiaryPage from '@/views/DiaryPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignupPage from '@/views/SignupPage.vue'
import { supabase } from '@/supabase/supabase.init'
import SearchPage from '@/views/SearchPage.vue'


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
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage
    }
  ],
})


// List of routes that don't require authentication
const publicPages = ['/login', '/signup', '/about']
const authOnlyPages = ['/login', '/signup']

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuth = !!session?.user
  const isPublic = publicPages.includes(to.path)
  const isAuthOnly = authOnlyPages.includes(to.path)


  if (!isAuth && !isPublic) {
    // Not logged in and trying to access a protected page
    return next('/login')
  }
  if (isAuth && isAuthOnly) {
    // Logged in and trying to access login/signup
    return next('/')
  }
  next()
})

export default router
