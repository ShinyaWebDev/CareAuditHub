import { Inject, Injectable } from '@nestjs/common'
import { desc } from 'drizzle-orm'
import { DRIZZLE_DB, type DrizzleDb } from '../db/db.provider'
import { auditLogs } from '../db/schema'

@Injectable()
export class AuditLogService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async getAuditLog() {
    const rows = await this.db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp))

    return {
      auditEntries: rows,
      metrics: {
        eventsInRange: rows.length,
        criticalEvents: rows.filter(entry => entry.severity === 'Critical').length,
        systemGenerated: rows.filter(entry => entry.user === 'System').length,
        accessChanges: rows.filter(entry => entry.eventType === 'Access').length,
      },
      filters: {
        users: Array.from(new Set(rows.map(entry => entry.user))).sort(),
        eventTypes: ['Assessment', 'Validation', 'API Submission', 'Document', 'Access', 'System'],
        severities: ['Info', 'Low', 'Medium', 'High', 'Critical'],
      },
    }
  }
}
