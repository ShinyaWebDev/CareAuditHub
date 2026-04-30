import { desc } from 'drizzle-orm'
import { db } from '../db/client'
import { auditLogs } from '../db/schema'

export async function getAuditLog() {
  const rows = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp))

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
