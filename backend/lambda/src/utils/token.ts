import { createHmac, timingSafeEqual } from 'node:crypto'
import type { User, UserRole } from '../db/schema'

const TOKEN_SECRET = process.env.MOCK_AUTH_SECRET ?? 'care-audit-hub-local-auth-secret'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

type TokenPayload = AuthUser & {
  iat: number
}

function signPayload(payload: string) {
  return createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url')
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export function createMockToken(user: AuthUser) {
  // Demo-only signed token. Production should verify Cognito-issued JWTs instead.
  const payload = Buffer.from(JSON.stringify({ ...user, iat: Date.now() } satisfies TokenPayload)).toString('base64url')
  return `${payload}.${signPayload(payload)}`
}

export function verifyMockToken(token: string): AuthUser | null {
  const [payload, signature] = token.split('.')

  if (!payload || !signature) {
    return null
  }

  const expectedSignature = signPayload(payload)
  const actual = Buffer.from(signature)
  const expected = Buffer.from(expectedSignature)

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenPayload

    if (!parsed.id || !parsed.email || !parsed.role) {
      return null
    }

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
    }
  } catch {
    return null
  }
}

export function parseBearerToken(authorizationHeader: string | undefined) {
  const [scheme, token] = authorizationHeader?.split(' ') ?? []
  return scheme?.toLowerCase() === 'bearer' ? token : undefined
}
