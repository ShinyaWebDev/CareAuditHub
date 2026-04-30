import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db/client'
import { users, type UserRole } from '../db/schema'
import { HttpError } from '../utils/errors'
import { createMockToken, parseBearerToken, toAuthUser, verifyMockToken } from '../utils/token'
import { verifyPassword } from '../utils/password'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function login(input: unknown) {
  const credentials = loginSchema.parse(input)
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, credentials.email.toLowerCase()))
    .limit(1)

  if (!user || !verifyPassword(credentials.password, user.passwordHash)) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const authUser = toAuthUser(user)

  return {
    token: createMockToken(authUser),
    user: authUser,
  }
}

export async function requireAuth(authorizationHeader: string | undefined) {
  const token = parseBearerToken(authorizationHeader)
  const tokenUser = token ? verifyMockToken(token) : null

  if (!tokenUser) {
    throw new HttpError(401, 'Authentication required')
  }

  const [user] = await db.select().from(users).where(eq(users.id, tokenUser.id)).limit(1)

  if (!user) {
    throw new HttpError(401, 'Authentication required')
  }

  return toAuthUser(user)
}

export async function requireRole(authorizationHeader: string | undefined, allowedRoles: UserRole[]) {
  const user = await requireAuth(authorizationHeader)

  if (!allowedRoles.includes(user.role)) {
    throw new HttpError(403, 'You do not have permission to perform this action')
  }

  return user
}
