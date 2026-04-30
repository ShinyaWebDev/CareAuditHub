import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DRIZZLE_DB, type DrizzleDb } from '../db/db.provider'
import { users } from '../db/schema'
import { verifyPassword } from './password'
import { createMockToken, parseBearerToken, toAuthUser, verifyMockToken } from './token'

@Injectable()
export class AuthService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async login(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const authUser = toAuthUser(user)

    return {
      token: createMockToken(authUser),
      user: authUser,
    }
  }

  async resolveAuthorizationHeader(authorizationHeader: string | undefined) {
    const token = parseBearerToken(authorizationHeader)
    const tokenUser = token ? verifyMockToken(token) : null

    if (!tokenUser) {
      throw new UnauthorizedException('Authentication required')
    }

    const [user] = await this.db.select().from(users).where(eq(users.id, tokenUser.id)).limit(1)

    if (!user) {
      throw new UnauthorizedException('Authentication required')
    }

    return toAuthUser(user)
  }
}
