import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'
import { LoginDto } from './dto/login.dto'
import type { AuthUser } from './token'

type RequestWithUser = {
  user: AuthUser
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password)
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getCurrentUser(@Req() request: RequestWithUser) {
    return { user: request.user }
  }
}
