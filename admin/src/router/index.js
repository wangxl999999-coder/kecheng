import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/', component: () => import('../views/Dashboard.vue') },
  { path: '/users', component: () => import('../views/Users.vue') },
  { path: '/courses', component: () => import('../views/Courses.vue') },
  { path: '/coupons', component: () => import('../views/Coupons.vue') },
  { path: '/seckills', component: () => import('../views/Seckills.vue') },
  { path: '/orders', component: () => import('../views/Orders.vue') },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken')
  if (to.path === '/login') {
    if (token) return next('/')
    return next()
  }
  if (!token) return next('/login')
  next()
})

export default router
