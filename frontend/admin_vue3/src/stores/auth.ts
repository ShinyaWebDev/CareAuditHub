import { defineStore } from 'pinia'
import { authApi } from '@/services/authApi'
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from '@/services/authStorage'
import type { AuthUser } from '@/types/auth'

function readStoredUser() {
  const value = localStorage.getItem(AUTH_USER_STORAGE_KEY)

  if (!value) return null

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Demo-only local auth state. Production should use Cognito-hosted auth and secure token/session handling.
    token: localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
    user: readStoredUser(),
  }),
  getters: {
    role: state => state.user?.role,
    isAuthenticated: state => Boolean(state.token && state.user),
    canCreateReports: state => state.user?.role === 'Admin' || state.user?.role === 'ComplianceManager',
    canValidateReports: state => state.user?.role === 'Admin' || state.user?.role === 'ComplianceManager',
    canRetrySync: state => state.user?.role === 'Admin',
  },
  actions: {
    async login(email: string, password: string) {
      const result = await authApi.login(email, password)

      this.token = result.token
      this.user = result.user

      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token)
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(result.user))
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
      localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    },
  },
})
