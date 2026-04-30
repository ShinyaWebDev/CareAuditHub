import { asc, desc, eq } from 'drizzle-orm'
import { db } from '../db/client'
import { auditLogs, reports } from '../db/schema'
import { notFound } from '../utils/errors'

const mockCurrentUser = {
  name: 'Avery McKenna',
  role: 'Compliance Lead',
}

export async function getReports() {
  const rows = await db.select().from(reports).orderBy(asc(reports.dueDateValue))
  const statuses = ['Draft', 'Ready for Review', 'Submitted', 'Failed Validation', 'Overdue'] as const

  return {
    reports: rows,
    groups: statuses.map(status => ({
      status,
      reports: rows.filter(report => report.status === status),
    })),
    metrics: {
      openObligations: rows.filter(report => report.status !== 'Submitted').length,
      readyForReview: rows.filter(report => report.status === 'Ready for Review').length,
      failedValidation: rows.filter(report => report.status === 'Failed Validation').length,
      submitted: rows.filter(report => report.status === 'Submitted').length,
    },
  }
}

export async function getReportById(id: string) {
  const [report] = await db.select().from(reports).where(eq(reports.id, id)).limit(1)

  if (!report) {
    throw notFound('Report', id)
  }

  return report
}

export async function validateReportById(id: string) {
  const report = await getReportById(id)
  const blockingChecks = report.validationChecks.filter(check => check.status === 'Blocking')
  const warningChecks = report.validationChecks.filter(check => check.status === 'Warning')
  const validationStatus = blockingChecks.length ? 'Failed Validation' : warningChecks.length ? 'Warning' : 'Validated'
  const apiReadiness = blockingChecks.length ? 'Failed Validation' : warningChecks.length ? 'Partial' : 'Ready to submit'
  const status = blockingChecks.length ? 'Failed Validation' : report.status === 'Draft' ? 'Ready for Review' : report.status
  const timestamp = new Date()

  const [updated] = await db
    .update(reports)
    .set({
      validationStatus,
      apiReadiness,
      status,
      lastUpdated: 'just now',
      updatedAt: timestamp,
    })
    .where(eq(reports.id, id))
    .returning()

  await db.insert(auditLogs).values({
    id: `AUD-${Date.now()}`,
    timestamp,
    date: timestamp.toISOString().slice(0, 10),
    time: timestamp.toISOString().slice(11, 16),
    user: mockCurrentUser.name,
    role: mockCurrentUser.role,
    action: 'Report validation run',
    eventType: 'Validation',
    entityType: 'Compliance Report',
    entityId: id,
    previousValue: `Validation status: ${report.validationStatus}`,
    newValue: `Validation status: ${validationStatus}; blocking errors: ${blockingChecks.length}`,
    severity: blockingChecks.length ? 'Critical' : warningChecks.length ? 'Medium' : 'Low',
    source: 'Local Lambda API',
    details: `Validation run completed for ${report.name}.`,
  })

  const latestAudit = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(5)

  return {
    report: updated,
    validation: {
      status: validationStatus,
      blockingChecks: blockingChecks.length,
      warningChecks: warningChecks.length,
      canSubmit: blockingChecks.length === 0,
    },
    recentAuditEvents: latestAudit,
  }
}
