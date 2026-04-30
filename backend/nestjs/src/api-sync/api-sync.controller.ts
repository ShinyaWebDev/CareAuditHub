import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { Roles } from '../auth/roles.decorator'
import { ApiSyncService } from './api-sync.service'

@Controller('api-sync')
export class ApiSyncController {
  constructor(private readonly apiSyncService: ApiSyncService) {}

  @Get()
  getApiSync() {
    return this.apiSyncService.getApiSyncOverview()
  }

  @Post(':id/retry')
  @UseGuards(AuthGuard)
  @Roles('Admin')
  retryApiSync(@Param('id') id: string) {
    return this.apiSyncService.retryApiSyncConnection(id)
  }
}
