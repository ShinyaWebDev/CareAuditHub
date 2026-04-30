import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type ComplianceStatus = 'Compliant' | 'Review due' | 'Documents missing' | 'Pending review'
export type ReportStatus = 'Draft' | 'Ready for Review' | 'Submitted' | 'Failed Validation' | 'Overdue'
export type ValidationStatus = 'Draft' | 'Validated' | 'Warning' | 'Failed Validation' | 'Submitted'
export type ApiReadiness = 'Ready to submit' | 'Partial' | 'Failed Validation'
export type CheckStatus = 'Passed' | 'Warning' | 'Blocking'
export type AuditSeverity = 'Info' | 'Low' | 'Medium' | 'High' | 'Critical'
export type AuditEventType = 'Assessment' | 'Validation' | 'API Submission' | 'Document' | 'Access' | 'System'
export type SyncStatus = 'Connected' | 'Degraded' | 'Paused'

export interface DocumentationItem {
  name: string
  owner: string
  complete: boolean
}

export interface ResidentEvent {
  time: string
  title: string
  detail: string
  color: string
}

export interface ValidationCheck {
  name: string
  status: CheckStatus
  detail: string
}

export interface ReportAuditEvent {
  time: string
  title: string
  actor: string
  color: string
}

export interface SyncHistoryEvent {
  id: string
  timestamp: string
  status: 'Succeeded' | 'Failed' | 'Retried'
  recordsProcessed: number
  failedRecords: number
  message: string
}

export const residents = pgTable('residents', {
  residentId: text('resident_id').primaryKey(),
  name: text('name').notNull(),
  facility: text('facility').notNull(),
  careLevel: text('care_level').notNull(),
  lastAssessmentDate: text('last_assessment_date').notNull(),
  complianceStatus: text('compliance_status').$type<ComplianceStatus>().notNull(),
  riskLevel: text('risk_level').$type<RiskLevel>().notNull(),
  missingDocuments: jsonb('missing_documents').$type<string[]>().notNull().default([]),
  lastUpdated: text('last_updated').notNull(),
  room: text('room').notNull(),
  primaryContact: text('primary_contact').notNull(),
  documentation: jsonb('documentation').$type<DocumentationItem[]>().notNull().default([]),
  events: jsonb('events').$type<ResidentEvent[]>().notNull().default([]),
  notes: text('notes').notNull(),
  auditTrail: jsonb('audit_trail').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').$type<ReportStatus>().notNull(),
  reportingPeriod: text('reporting_period').notNull(),
  facility: text('facility').notNull(),
  dueDate: text('due_date').notNull(),
  dueDateValue: date('due_date_value').notNull(),
  completion: integer('completion').notNull(),
  validationStatus: text('validation_status').$type<ValidationStatus>().notNull(),
  lastUpdated: text('last_updated').notNull(),
  owner: text('owner').notNull(),
  apiReadiness: text('api_readiness').$type<ApiReadiness>().notNull(),
  validationChecks: jsonb('validation_checks').$type<ValidationCheck[]>().notNull().default([]),
  warnings: jsonb('warnings').$type<string[]>().notNull().default([]),
  auditEvents: jsonb('audit_events').$type<ReportAuditEvent[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  user: text('user').notNull(),
  role: text('role').notNull(),
  action: text('action').notNull(),
  eventType: text('event_type').$type<AuditEventType>().notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  previousValue: text('previous_value').notNull(),
  newValue: text('new_value').notNull(),
  severity: text('severity').$type<AuditSeverity>().notNull(),
  source: text('source').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const apiSyncConnections = pgTable('api_sync_connections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  vendor: text('vendor').notNull(),
  status: text('status').$type<SyncStatus>().notNull(),
  lastSync: text('last_sync').notNull(),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }).notNull(),
  records: integer('records').notNull(),
  failedRecords: integer('failed_records').notNull().default(0),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const apiSyncHistory = pgTable('api_sync_history', {
  id: text('id').primaryKey(),
  connectionId: text('connection_id')
    .notNull()
    .references(() => apiSyncConnections.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  status: text('status').$type<SyncHistoryEvent['status']>().notNull(),
  recordsProcessed: integer('records_processed').notNull(),
  failedRecords: integer('failed_records').notNull(),
  message: text('message').notNull(),
})

export const dashboardMetrics = pgTable('dashboard_metrics', {
  id: text('id').primaryKey(),
  kpis: jsonb('kpis').notNull(),
  complianceStatuses: jsonb('compliance_statuses').notNull(),
  recentActivity: jsonb('recent_activity').notNull(),
  reportingDeadlines: jsonb('reporting_deadlines').notNull(),
  systemHealth: jsonb('system_health').notNull(),
  complianceSignals: jsonb('compliance_signals').notNull(),
  complianceFocus: jsonb('compliance_focus').notNull(),
  lastSuccessfulSync: text('last_successful_sync').notNull(),
  failedRecords: integer('failed_records').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Resident = typeof residents.$inferSelect
export type Report = typeof reports.$inferSelect
export type AuditLog = typeof auditLogs.$inferSelect
export type ApiSyncConnection = typeof apiSyncConnections.$inferSelect
export type ApiSyncHistory = typeof apiSyncHistory.$inferSelect
