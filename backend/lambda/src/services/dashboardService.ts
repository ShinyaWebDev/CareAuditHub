import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { dashboardMetrics } from '../db/schema'

export async function getDashboardData() {
  const [dashboard] = await db
    .select()
    .from(dashboardMetrics)
    .where(eq(dashboardMetrics.id, 'default'))
    .limit(1)

  return dashboard
}
