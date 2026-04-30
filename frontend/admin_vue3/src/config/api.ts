export type BackendMode = 'mock' | 'lambda-local' | 'nestjs-local' | 'aws-dev' | 'dotnet-local' | string
export type AuthMode = 'none' | 'cognito' | 'bearer' | string

const backendLabels: Record<string, string> = {
  mock: 'Mock Data',
  'lambda-local': 'Lambda Local',
  'nestjs-local': 'NestJS Local',
  'aws-dev': 'AWS Dev',
  'dotnet-local': 'DotNet Local',
}

export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '',
  backendMode: (import.meta.env.VITE_BACKEND_MODE ?? 'mock') as BackendMode,
  authMode: (import.meta.env.VITE_AUTH_MODE ?? 'none') as AuthMode,
  timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 8000),
}

export const backendModeLabel = backendLabels[apiConfig.backendMode] ?? apiConfig.backendMode

export const isApiConfigured = apiConfig.baseUrl.length > 0
