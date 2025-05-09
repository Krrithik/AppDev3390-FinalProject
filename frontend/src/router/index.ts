import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import LikesPage from '@/views/LikesPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import DiaryPage from '@/views/DiaryPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignupPage from '@/views/SignupPage.vue'
import { supabase } from '@/supabase/supabase.init'
import SearchPage from '@/views/SearchPage.vue'

// NAVIGATION CODE
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
      // ROUTE LEVEL CODE-SPLITTING
      // THIS GENERATES A SEPERATE CHUNK (About.[hash].js) FOR THIS ROUTE
      // WHICH IS LAZY-LOADED WHEN THE ROUTE IS VISITED
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


// LISTS OF ROUTES THAT DONT REQUIRE AUTHENTICATION
const publicPages = ['/login', '/signup', '/about']
const authOnlyPages = ['/login', '/signup']

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuth = !!session?.user
  const isPublic = publicPages.includes(to.path)
  const isAuthOnly = authOnlyPages.includes(to.path)


  // NOT LOGGED IN AND TRYING TO ACCESS A PROTECTED PAGE
  if (!isAuth && !isPublic) {
    return next('/login')
  }
  // LOGGED IN AND TRYING TO ACCESS LOGIN/SIGNUP
  if (isAuth && isAuthOnly) {
    return next('/')
  }
  next()
})

export default router