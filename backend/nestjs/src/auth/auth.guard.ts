import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { UserRole } from '../db/schema'
import { AuthService } from './auth.service'
import { ROLES_KEY } from './roles.decorator'
import type { AuthUser } from './token'

type RequestWithUser = {
  headers: {
    authorization?: string
  }
  user?: AuthUser
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = await this.authService.resolveAuthorizationHeader(request.headers.authorization)
    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    request.user = user

    if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to perform this action')
    }

    return true
  }
}
