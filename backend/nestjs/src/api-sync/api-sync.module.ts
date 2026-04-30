import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ApiSyncController } from './api-sync.controller'
import { ApiSyncService } from './api-sync.service'

@Module({
  imports: [AuthModule],
  controllers: [ApiSyncController],
  providers: [ApiSyncService],
})
export class ApiSyncModule {}
