import { Inject, Injectable } from '@nestjs/common'
import { desc, eq } from 'drizzle-orm'
import { notFound } from '../common/utils/not-found'
import { DRIZZLE_DB, type DrizzleDb } from '../db/db.provider'
import { apiSyncConnections, apiSyncHistory, auditLogs } from '../db/schema'

@Injectable()
export class ApiSyncService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async getApiSyncOverview() {
    const connections = await this.db.select().from(apiSyncConnections).orderBy(apiSyncConnections.id)
    const history = await this.db.select().from(apiSyncHistory).orderBy(desc(apiSyncHistory.timestamp))

    return {
      apiConnections: connections,
      history,
      metrics: {
        totalConnections: connections.length,
        connected: connections.filter(connection => connection.status === 'Connected').length,
        degraded: connections.filter(connection => connection.status === 'Degraded').length,
        paused: connections.filter(connection => connection.status === 'Paused').length,
        failedRecords: connections.reduce((total, connection) => total + connection.failedRecords, 0),
      },
    }
  }

  async retryApiSyncConnection(id: string) {
    const [connection] = await this.db.select().from(apiSyncConnections).where(eq(apiSyncConnections.id, id)).limit(1)

    if (!connection) {
      notFound('API sync connection', id)
    }

    const timestamp = new Date()
    const failedRecords = Math.max(0, Math.floor(connection.failedRecords / 2))
    const status = failedRecords > 0 ? 'Degraded' : 'Connected'

    const [updated] = await this.db
      .update(apiSyncConnections)
      .set({
        status,
        failedRecords,
        lastSync: 'just now',
        lastSyncAt: timestamp,
        enabled: true,
        updatedAt: timestamp,
      })
      .where(eq(apiSyncConnections.id, id))
      .returning()

    await this.db.insert(apiSyncHistory).values({
      id: `sync-${Date.now()}`,
      connectionId: id,
      timestamp,
      status: 'Retried',
      recordsProcessed: connection.records,
      failedRecords,
      message: `Manual retry triggered for ${connection.vendor}.`,
    })

    await this.db.insert(auditLogs).values({
      id: `AUD-${Date.now()}`,
      timestamp,
      date: timestamp.toISOString().slice(0, 10),
      time: timestamp.toISOString().slice(11, 16),
      user: 'System',
      role: 'Integration Worker',
      action: 'Data sync retry triggered',
      eventType: 'System',
      entityType: 'API Sync Job',
      entityId: id,
      previousValue: `Status: ${connection.status}; failed records: ${connection.failedRecords}`,
      newValue: `Status: ${status}; failed records: ${failedRecords}`,
      severity: failedRecords > 0 ? 'Medium' : 'Low',
      source: 'Integration Service',
      details: `Local retry was triggered for ${connection.name}.`,
    })

    const history = await this.db
      .select()
      .from(apiSyncHistory)
      .where(eq(apiSyncHistory.connectionId, id))
      .orderBy(desc(apiSyncHistory.timestamp))

    return {
      connection: updated,
      history,
    }
  }
}
