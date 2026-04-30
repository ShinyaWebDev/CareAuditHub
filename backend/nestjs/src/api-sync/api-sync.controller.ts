import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiSyncService } from './api-sync.service'

@Controller('api-sync')
export class ApiSyncController {
  constructor(private readonly apiSyncService: ApiSyncService) {}

  @Get()
  getApiSync() {
    return this.apiSyncService.getApiSyncOverview()
  }

  @Post(':id/retry')
  retryApiSync(@Param('id') id: string) {
    return this.apiSyncService.retryApiSyncConnection(id)
  }
}
