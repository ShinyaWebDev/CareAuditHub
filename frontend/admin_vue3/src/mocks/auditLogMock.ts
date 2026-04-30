import type { AuditLogResponse, EventType, Severity } from '@/types/auditLog'

function audit(
  id: string,
  timestamp: string,
  user: string,
  role: string,
  action: string,
  eventType: EventType,
  entityType: string,
  entityId: string,
  previousValue: string,
  newValue: string,
  severity: Severity,
  source: string,
  details: string,
) {
  return {
    id,
    timestamp,
    date: timestamp.slice(0, 10),
    time: timestamp.slice(11, 16),
    user,
    role,
    action,
    eventType,
    entityType,
    entityId,
    previousValue,
    newValue,
    severity,
    source,
    details,
  }
}

export const auditLogMock: AuditLogResponse = {
  auditEntries: [
    audit('AUD-10042', '2026-04-28T09:42:00', 'Priya Nair', 'Clinical Governance Lead', 'Resident assessment updated', 'Assessment', 'Resident Assessment', 'RES-1042', 'Falls risk: Medium; wound chart: not reviewed', 'Falls risk: High; wound chart: review required', 'High', 'Care Plan UI', 'Clinical assessment was updated after review of recent wound-care notes and falls-prevention observations.'),
    audit('AUD-10039', '2026-04-28T08:51:00', 'System', 'Validation Service', 'Report validation failed', 'Validation', 'Compliance Report', 'MED-INC-2026-04', 'Validation status: Warning', 'Validation status: Failed Validation; blocking errors: 3', 'Critical', 'Validation Engine', 'Medication incident report failed schema validation because three severity codes were not mapped.'),
    audit('AUD-10036', '2026-04-27T15:20:00', 'Mina Chen', 'Workforce Compliance Manager', 'API submission completed', 'API Submission', 'Government Submission', 'WORK-2026-Q2', 'Submission status: Ready to submit', 'Submission status: Submitted; receipt: GOV-847193', 'Low', 'Government API', 'Workforce credential compliance return was submitted successfully.'),
    audit('AUD-10031', '2026-04-27T13:04:00', 'System', 'Evidence Monitor', 'Missing document flagged', 'Document', 'Resident Document', 'RES-1633', 'Restrictive practice approval: present=false; escalation=false', 'Restrictive practice approval: present=false; escalation=true', 'Critical', 'Evidence Scanner', 'Restrictive practice approval evidence was missing for a critical-risk dementia support resident.'),
    audit('AUD-10027', '2026-04-26T16:12:00', 'Avery McKenna', 'Compliance Lead', 'User role changed', 'Access', 'User Account', 'USR-204', 'Role: Report Viewer; facility scope: Harbourview', 'Role: Report Reviewer; facility scope: Harbourview, Riverside Manor', 'High', 'Admin Console', 'Access role was elevated to allow report review across two facilities.'),
    audit('AUD-10022', '2026-04-26T10:28:00', 'System', 'Integration Worker', 'Data sync retry triggered', 'System', 'API Sync Job', 'SYNC-MEDITRACK-8842', 'Status: Failed; failed records: 42', 'Status: Retrying; failed records: 17', 'Medium', 'Integration Service', 'Medication data pipeline retry was triggered after transient vendor API timeout.'),
    audit('AUD-10018', '2026-04-25T14:38:00', 'Helen Zhao', 'Care Coordinator', 'Missing document flagged', 'Document', 'Consent Evidence', 'RES-1270', 'Respite discharge checklist: not required', 'Respite discharge checklist: required before transfer', 'Medium', 'Resident Registry', 'Respite workflow moved resident into discharge preparation.'),
    audit('AUD-10011', '2026-04-24T11:03:00', 'Omar Haddad', 'Care Manager', 'Resident assessment updated', 'Assessment', 'Care Plan', 'RES-1325', 'Assessment state: Draft', 'Assessment state: Locked for audit; risk: Low', 'Info', 'Care Plan UI', 'Care plan review was completed and locked.'),
  ],
}
