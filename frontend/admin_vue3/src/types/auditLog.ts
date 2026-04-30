export type Severity = 'Info' | 'Low' | 'Medium' | 'High' | 'Critical'
export type EventType = 'Assessment' | 'Validation' | 'API Submission' | 'Document' | 'Access' | 'System'

export interface AuditEntry {
  id: string
  timestamp: string
  date: string
  time: string
  user: string
  role: string
  action: string
  eventType: EventType
  entityType: string
  entityId: string
  previousValue: string
  newValue: string
  severity: Severity
  source: string
  details: string
}

export interface AuditLogResponse {
  auditEntries: AuditEntry[]
  metrics?: {
    eventsInRange: number
    criticalEvents: number
    systemGenerated: number
    accessChanges: number
  }
  filters?: {
    users: string[]
    eventTypes: string[]
    severities: string[]
  }
}
