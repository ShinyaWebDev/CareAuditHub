import { Module } from '@nestjs/common'
import { ApiSyncController } from './api-sync.controller'
import { ApiSyncService } from './api-sync.service'

@Module({
  controllers: [ApiSyncController],
  providers: [ApiSyncService],
})
export class ApiSyncModule {}
