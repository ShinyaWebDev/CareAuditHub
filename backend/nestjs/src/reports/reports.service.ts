import { Inject, Injectable } from '@nestjs/common'
import { asc, desc, eq } from 'drizzle-orm'
import { notFound } from '../common/utils/not-found'
import { DRIZZLE_DB, type DrizzleDb } from '../db/db.provider'
import { auditLogs, reports, type ValidationCheck } from '../db/schema'
import type { AuthUser } from '../auth/token'
import type { CreateReportDto } from './dto/create-report.dto'

function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Australia/Melbourne',
  }).format(new Date(`${date}T00:00:00+10:00`))
}

function createReportId(name: string, dueDate: string) {
  const prefix = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 18)

  return `${prefix}-${dueDate.replaceAll('-', '')}-${Date.now().toString().slice(-5)}`
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

  async createReport(input: CreateReportDto, actor: AuthUser) {
    const timestamp = new Date()
    const evidenceItems = (input.evidenceItems ?? []).map(item => ({
      name: item.name,
      source: item.source,
      attachedAt: 'just now',
    }))
    const warnings = evidenceItems.length
      ? ['Draft report needs validation before submission.']
      : ['No evidence has been attached yet.', 'Draft report needs validation before submission.']
    const validationChecks: ValidationCheck[] = [
      {
        name: 'Evidence attachments',
        status: evidenceItems.length ? 'Passed' : 'Warning',
        detail: evidenceItems.length
          ? `${evidenceItems.length} evidence item${evidenceItems.length === 1 ? '' : 's'} attached.`
          : 'Attach at least one evidence item before validation.',
      },
      { name: 'Due date', status: 'Passed', detail: `Due date set to ${formatDisplayDate(input.dueDate)}.` },
      { name: 'Owner assignment', status: 'Passed', detail: `${input.owner} is assigned as report owner.` },
      { name: 'Submission payload schema', status: 'Warning', detail: 'Payload will be checked when validation runs.' },
    ]
    const completion = Math.min(85, 35 + evidenceItems.length * 15)
    const reportId = createReportId(input.name, input.dueDate)

    const [created] = await this.db
      .insert(reports)
      .values({
        id: reportId,
        name: input.name,
        status: 'Draft',
        reportingPeriod: input.reportingPeriod,
        facility: input.facility,
        dueDate: formatDisplayDate(input.dueDate),
        dueDateValue: input.dueDate,
        completion,
        validationStatus: 'Draft',
        lastUpdated: 'just now',
        owner: input.owner,
        apiReadiness: 'Partial',
        validationChecks,
        warnings,
        evidenceItems,
        auditEvents: [
          {
            time: 'just now',
            title: 'Draft report created',
            actor: actor.name,
            color: 'info',
          },
        ],
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning()

    await this.db.insert(auditLogs).values({
      id: `AUD-${Date.now()}`,
      timestamp,
      date: timestamp.toISOString().slice(0, 10),
      time: timestamp.toISOString().slice(11, 16),
      user: actor.name,
      role: actor.role,
      action: 'Report created',
      eventType: 'Document',
      entityType: 'Compliance Report',
      entityId: reportId,
      previousValue: 'Report did not exist',
      newValue: `Draft report created with ${evidenceItems.length} evidence item${evidenceItems.length === 1 ? '' : 's'}`,
      severity: 'Info',
      source: 'NestJS API',
      details: `${actor.name} created ${input.name} for ${input.facility}.`,
    })

    return { report: created }
  }

  async validateReportById(id: string, actor: AuthUser) {
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
      user: actor.name,
      role: actor.role,
      action: 'Report validation run',
      eventType: 'Validation',
      entityType: 'Compliance Report',
      entityId: id,
      previousValue: `Validation status: ${report.validationStatus}`,
      newValue: `Validation status: ${validationStatus}; blocking errors: ${blockingChecks.length}`,
      severity: blockingChecks.length ? 'Critical' : warningChecks.length ? 'Medium' : 'Low',
      source: 'NestJS API',
      details: `${actor.name} ran validation for ${report.name}.`,
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
