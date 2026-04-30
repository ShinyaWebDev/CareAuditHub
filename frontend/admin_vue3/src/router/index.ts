/**
 * router/index.ts
 *
 * Page-based routes for the dashboard prototype.
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
        },
        {
          path: 'residents',
          name: 'residents',
          component: () => import('@/pages/ResidentsPage.vue'),
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/pages/ReportsPage.vue'),
        },
        {
          path: 'audit-log',
          name: 'audit-log',
          component: () => import('@/pages/AuditLogPage.vue'),
        },
        {
          path: 'api-sync',
          name: 'api-sync',
          component: () => import('@/pages/ApiSyncPage.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/SettingsPage.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach(to => {
  const app = useAppStore()

  if (!to.meta.public && !app.authenticated) {
    return '/login'
  }

  if (to.meta.public && app.authenticated) {
    return '/dashboard'
  }

  return true
})

export default router
