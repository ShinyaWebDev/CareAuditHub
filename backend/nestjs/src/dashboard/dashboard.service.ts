import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DRIZZLE_DB, type DrizzleDb } from '../db/db.provider'
import { dashboardMetrics } from '../db/schema'

@Injectable()
export class DashboardService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async getDashboard() {
    const [dashboard] = await this.db
      .select()
      .from(dashboardMetrics)
      .where(eq(dashboardMetrics.id, 'default'))
      .limit(1)

    return dashboard
  }
}
