import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApiSyncModule } from './api-sync/api-sync.module'
import { AuditLogModule } from './audit-log/audit-log.module'
import { AuthModule } from './auth/auth.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { DbModule } from './db/db.module'
import { ReportsModule } from './reports/reports.module'
import { ResidentsModule } from './residents/residents.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    DashboardModule,
    ResidentsModule,
    ReportsModule,
    AuditLogModule,
    ApiSyncModule,
  ],
})
export class AppModule {}
