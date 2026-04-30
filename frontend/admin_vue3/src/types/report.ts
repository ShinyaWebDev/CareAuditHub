export type ReportStatus = 'Draft' | 'Ready for Review' | 'Submitted' | 'Failed Validation' | 'Overdue'
export type ValidationStatus = 'Draft' | 'Validated' | 'Warning' | 'Failed Validation' | 'Submitted'
export type CheckStatus = 'Passed' | 'Warning' | 'Blocking'

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

export interface ReportEvidenceItem {
  name: string
  source: string
  attachedAt: string
}

export interface ComplianceReport {
  id: string
  name: string
  status: ReportStatus
  reportingPeriod: string
  facility: string
  dueDate: string
  completion: number
  validationStatus: ValidationStatus
  lastUpdated: string
  owner: string
  apiReadiness: 'Ready to submit' | 'Partial' | 'Failed Validation'
  validationChecks: ValidationCheck[]
  warnings: string[]
  auditEvents: ReportAuditEvent[]
  evidenceItems: ReportEvidenceItem[]
}

export interface ReportsResponse {
  reports: ComplianceReport[]
  groups?: Array<{ status: ReportStatus; reports: ComplianceReport[] }>
  metrics?: {
    openObligations: number
    readyForReview: number
    failedValidation: number
    submitted: number
  }
}

export interface ValidateReportResponse {
  report: ComplianceReport
  validation: {
    status: ValidationStatus
    blockingChecks: number
    warningChecks: number
    canSubmit: boolean
  }
}

export interface CreateReportRequest {
  name: string
  reportingPeriod: string
  facility: string
  dueDate: string
  owner: string
  evidenceItems: Array<{
    name: string
    source: string
  }>
}

export interface CreateReportResponse {
  report: ComplianceReport
}
