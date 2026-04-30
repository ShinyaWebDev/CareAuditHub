import { Inject, Injectable } from '@nestjs/common'
import { asc, desc, eq } from 'drizzle-orm'
import { notFound } from '../common/utils/not-found'
import { DRIZZLE_DB, type DrizzleDb } from '../db/db.provider'
import { auditLogs, reports } from '../db/schema'

const mockCurrentUser = {
  name: 'Avery McKenna',
  role: 'Compliance Lead',
}

@Injectable()
export class ReportsService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async getReports() {
    const rows = await this.db.select().from(reports).orderBy(asc(reports.dueDateValue))
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

  async getReportById(id: string) {
    const [report] = await this.db.select().from(reports).where(eq(reports.id, id)).limit(1)

    if (!report) {
      notFound('Report', id)
    }

    return report
  }

  async validateReportById(id: string) {
    const report = await this.getReportById(id)
    const blockingChecks = report.validationChecks.filter(check => check.status === 'Blocking')
    const warningChecks = report.validationChecks.filter(check => check.status === 'Warning')
    const validationStatus = blockingChecks.length ? 'Failed Validation' : warningChecks.length ? 'Warning' : 'Validated'
    const apiReadiness = blockingChecks.length ? 'Failed Validation' : warningChecks.length ? 'Partial' : 'Ready to submit'
    const status = blockingChecks.length ? 'Failed Validation' : report.status === 'Draft' ? 'Ready for Review' : report.status
    const timestamp = new Date()

    const [updated] = await this.db
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

    await this.db.insert(auditLogs).values({
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
      source: 'NestJS API',
      details: `Validation run completed for ${report.name}.`,
    })

    const latestAudit = await this.db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(5)

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
}
