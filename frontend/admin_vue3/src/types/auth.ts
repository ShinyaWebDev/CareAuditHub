export type UserRole = 'Admin' | 'ComplianceManager' | 'Viewer' | 'Auditor'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface MeResponse {
  user: AuthUser
}
