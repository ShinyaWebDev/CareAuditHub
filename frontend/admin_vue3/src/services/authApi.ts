import type { LoginResponse, MeResponse } from '@/types/auth'
import { httpClient } from './httpClient'

export const authApi = {
  login(email: string, password: string) {
    return httpClient.post<LoginResponse>('/auth/login', { email, password })
  },

  me() {
    return httpClient.get<MeResponse>('/auth/me')
  },
}
