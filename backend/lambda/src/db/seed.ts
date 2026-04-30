import 'dotenv/config'
import { desc } from 'drizzle-orm'
import { db, sql } from './client'
import {
  apiSyncConnections,
  apiSyncHistory,
  auditLogs,
  dashboardMetrics,
  reports,
  residents,
  users,
} from './schema'
import { createPasswordHash } from '../utils/password'

const now = new Date()

async function seed() {
  await db.delete(apiSyncHistory)
  await db.delete(apiSyncConnections)
  await db.delete(auditLogs)
  await db.delete(reports)
  await db.delete(residents)
  await db.delete(dashboardMetrics)
  await db.delete(users)

  await db.insert(users).values([
    {
      id: 'USR-ADMIN',
      name: 'CareHub Admin',
      email: 'admin@carehub.test',
      passwordHash: createPasswordHash('password123', 'admin@carehub.test'),
      role: 'Admin',
    },
    {
      id: 'USR-MANAGER',
      name: 'Compliance Manager',
      email: 'manager@carehub.test',
      passwordHash: createPasswordHash('password123', 'manager@carehub.test'),
      role: 'ComplianceManager',
    },
    {
      id: 'USR-VIEWER',
      name: 'CareHub Viewer',
      email: 'viewer@carehub.test',
      passwordHash: createPasswordHash('password123', 'viewer@carehub.test'),
      role: 'Viewer',
    },
    {
      id: 'USR-AUDITOR',
      name: 'CareHub Auditor',
      email: 'auditor@carehub.test',
      passwordHash: createPasswordHash('password123', 'auditor@carehub.test'),
      role: 'Auditor',
    },
  ])

  await db.insert(residents).values([
    {
      residentId: 'RES-1042',
      name: 'Margaret Ellis',
      facility: 'Harbourview Aged Care',
      careLevel: 'High care',
      lastAssessmentDate: '24 Apr 2026',
      complianceStatus: 'Documents missing',
      riskLevel: 'Critical',
      missingDocuments: ['Wound chart', 'Updated consent form', 'Falls prevention review'],
      lastUpdated: '28 Apr 2026 09:18',
      room: 'A-018',
      primaryContact: 'Clinical Lead: Priya Nair',
      documentation: [
        { name: 'Care plan review', owner: 'RN team', complete: true },
        { name: 'Medication chart', owner: 'Pharmacy', complete: true },
        { name: 'Wound chart', owner: 'Wound care nurse', complete: false },
        { name: 'Consent documentation', owner: 'Admissions', complete: false },
      ],
      events: [
        { time: '09:18 today', title: 'Missing wound chart detected', detail: 'Automated evidence scan', color: 'error' },
        { time: '16:44 yesterday', title: 'Falls risk escalated', detail: 'Clinical governance review', color: 'warning' },
        { time: '24 Apr', title: 'Assessment completed', detail: 'High-care pathway confirmed', color: 'success' },
      ],
      notes: 'Prioritize wound-care evidence before weekly clinical governance review. Family consent renewal is assigned to admissions.',
      auditTrail: [
        'System flagged missing wound chart · 28 Apr 2026 09:18',
        'Priya Nair updated falls risk category · 27 Apr 2026 16:44',
        'Assessment record locked for audit · 24 Apr 2026 14:02',
      ],
    },
    {
      residentId: 'RES-1187',
      name: 'Kenji Watanabe',
      facility: 'Harbourview Aged Care',
      careLevel: 'Memory support',
      lastAssessmentDate: '25 Apr 2026',
      complianceStatus: 'Review due',
      riskLevel: 'High',
      missingDocuments: ['Medication review sign-off'],
      lastUpdated: '28 Apr 2026 08:47',
      room: 'B-112',
      primaryContact: 'RN Lead: Daniel Brooks',
      documentation: [
        { name: 'Cognitive support plan', owner: 'Memory support team', complete: true },
        { name: 'Medication review sign-off', owner: 'Pharmacist', complete: false },
        { name: 'Behaviour support notes', owner: 'Clinical lead', complete: true },
      ],
      events: [
        { time: '08:47 today', title: 'Medication review pending', detail: 'Pharmacist sign-off required', color: 'warning' },
        { time: '25 Apr', title: 'Assessment updated', detail: 'Memory support care level confirmed', color: 'success' },
      ],
      notes: 'Medication review has been completed clinically but requires final pharmacist attestation for audit evidence.',
      auditTrail: [
        'Daniel Brooks uploaded behaviour support notes · 28 Apr 2026 08:47',
        'System requested medication review sign-off · 26 Apr 2026 10:13',
      ],
    },
    {
      residentId: 'RES-1270',
      name: 'Lorna Singh',
      facility: 'Riverside Manor',
      careLevel: 'Respite',
      lastAssessmentDate: '26 Apr 2026',
      complianceStatus: 'Pending review',
      riskLevel: 'Medium',
      missingDocuments: ['Respite discharge checklist'],
      lastUpdated: '27 Apr 2026 15:21',
      room: 'C-044',
      primaryContact: 'Care Coordinator: Helen Zhao',
      documentation: [
        { name: 'Entry assessment', owner: 'Admissions', complete: true },
        { name: 'Respite discharge checklist', owner: 'Care coordinator', complete: false },
        { name: 'Medication reconciliation', owner: 'RN team', complete: true },
      ],
      events: [
        { time: '15:21 yesterday', title: 'Discharge checklist opened', detail: 'Respite workflow started', color: 'info' },
        { time: '26 Apr', title: 'Medication reconciliation verified', detail: 'RN attestation complete', color: 'success' },
      ],
      notes: 'Short-stay respite record is in good shape. Discharge checklist is not overdue yet but should be completed before transfer.',
      auditTrail: [
        'Helen Zhao created discharge checklist task · 27 Apr 2026 15:21',
        'RN team verified medication reconciliation · 26 Apr 2026 12:07',
      ],
    },
    {
      residentId: 'RES-1325',
      name: 'Arthur Dawson',
      facility: 'Riverside Manor',
      careLevel: 'Standard',
      lastAssessmentDate: '27 Apr 2026',
      complianceStatus: 'Compliant',
      riskLevel: 'Low',
      missingDocuments: [],
      lastUpdated: '28 Apr 2026 07:55',
      room: 'A-031',
      primaryContact: 'Care Manager: Omar Haddad',
      documentation: [
        { name: 'Care plan review', owner: 'Care manager', complete: true },
        { name: 'Consent documentation', owner: 'Admissions', complete: true },
        { name: 'Medication chart', owner: 'RN team', complete: true },
      ],
      events: [
        { time: '07:55 today', title: 'Resident profile synchronized', detail: 'All required fields validated', color: 'success' },
        { time: '27 Apr', title: 'Assessment completed', detail: 'No compliance gaps found', color: 'success' },
      ],
      notes: 'All required documents are current. Continue normal monthly monitoring cycle.',
      auditTrail: [
        'System synchronized resident profile · 28 Apr 2026 07:55',
        'Omar Haddad locked care plan review · 27 Apr 2026 11:03',
      ],
    },
    {
      residentId: 'RES-1411',
      name: 'Elena Moretti',
      facility: 'Wattle Grove Care Suites',
      careLevel: 'Palliative',
      lastAssessmentDate: '22 Apr 2026',
      complianceStatus: 'Review due',
      riskLevel: 'High',
      missingDocuments: ['Advance care directive review', 'Pain management reassessment'],
      lastUpdated: '27 Apr 2026 13:09',
      room: 'D-006',
      primaryContact: 'Clinical Lead: Amara Reed',
      documentation: [
        { name: 'Advance care directive review', owner: 'Clinical lead', complete: false },
        { name: 'Pain management reassessment', owner: 'Palliative team', complete: false },
        { name: 'Family meeting notes', owner: 'Social worker', complete: true },
      ],
      events: [
        { time: '13:09 yesterday', title: 'Palliative documentation review due', detail: 'Two items approaching deadline', color: 'warning' },
        { time: '22 Apr', title: 'Family meeting notes verified', detail: 'Social work evidence attached', color: 'success' },
      ],
      notes: 'Palliative documentation is clinically sensitive and time-bound. Review due before end-of-week governance huddle.',
      auditTrail: [
        'Amara Reed added family meeting notes · 22 Apr 2026 15:36',
        'System scheduled palliative review task · 22 Apr 2026 09:12',
      ],
    },
    {
      residentId: 'RES-1518',
      name: 'Grace Osei',
      facility: 'Wattle Grove Care Suites',
      careLevel: 'High care',
      lastAssessmentDate: '23 Apr 2026',
      complianceStatus: 'Compliant',
      riskLevel: 'Medium',
      missingDocuments: [],
      lastUpdated: '28 Apr 2026 10:04',
      room: 'B-027',
      primaryContact: 'RN Lead: Mia Fraser',
      documentation: [
        { name: 'Nutrition plan', owner: 'Dietitian', complete: true },
        { name: 'Mobility assessment', owner: 'Physiotherapist', complete: true },
        { name: 'Care plan review', owner: 'RN team', complete: true },
      ],
      events: [
        { time: '10:04 today', title: 'Nutrition plan verified', detail: 'Dietitian evidence accepted', color: 'success' },
        { time: '23 Apr', title: 'Assessment completed', detail: 'Medium risk monitoring continued', color: 'success' },
      ],
      notes: 'Stable record with current allied health evidence. Continue weekly monitoring.',
      auditTrail: [
        'Mia Fraser verified care plan review · 28 Apr 2026 10:04',
        'Dietitian uploaded nutrition evidence · 23 Apr 2026 13:40',
      ],
    },
    {
      residentId: 'RES-1633',
      name: 'Thomas Nguyen',
      facility: 'Harbourview Aged Care',
      careLevel: 'Dementia support',
      lastAssessmentDate: '21 Apr 2026',
      complianceStatus: 'Documents missing',
      riskLevel: 'Critical',
      missingDocuments: ['Behaviour support review', 'Restrictive practice approval'],
      lastUpdated: '28 Apr 2026 06:39',
      room: 'B-009',
      primaryContact: 'Behaviour Support Lead: Noel Kim',
      documentation: [
        { name: 'Behaviour support review', owner: 'Behaviour support lead', complete: false },
        { name: 'Restrictive practice approval', owner: 'Clinical governance', complete: false },
        { name: 'Family communication log', owner: 'Care team', complete: true },
      ],
      events: [
        { time: '06:39 today', title: 'Restrictive practice evidence missing', detail: 'Governance escalation generated', color: 'error' },
        { time: '21 Apr', title: 'Dementia support assessment completed', detail: 'Critical monitoring pathway active', color: 'warning' },
      ],
      notes: 'Escalated for governance attention. Missing restrictive practice approval must be resolved before accreditation evidence export.',
      auditTrail: [
        'System escalated restrictive practice evidence gap · 28 Apr 2026 06:39',
        'Noel Kim updated behaviour support notes · 21 Apr 2026 10:11',
      ],
    },
    {
      residentId: 'RES-1744',
      name: 'Irene Campbell',
      facility: 'Northbank Lodge',
      careLevel: 'Standard',
      lastAssessmentDate: '26 Apr 2026',
      complianceStatus: 'Compliant',
      riskLevel: 'Low',
      missingDocuments: [],
      lastUpdated: '27 Apr 2026 17:14',
      room: 'E-021',
      primaryContact: 'Care Manager: Sofia Lin',
      documentation: [
        { name: 'Care plan review', owner: 'Care manager', complete: true },
        { name: 'Lifestyle preferences', owner: 'Lifestyle team', complete: true },
        { name: 'Consent documentation', owner: 'Admissions', complete: true },
      ],
      events: [
        { time: '17:14 yesterday', title: 'Lifestyle evidence attached', detail: 'Preference record complete', color: 'success' },
        { time: '26 Apr', title: 'Assessment completed', detail: 'No open actions', color: 'success' },
      ],
      notes: 'Compliant record. Suitable as a clean evidence example for interview demo walkthrough.',
      auditTrail: [
        'Sofia Lin verified lifestyle preferences · 27 Apr 2026 17:14',
        'Assessment completed and locked · 26 Apr 2026 09:32',
      ],
    },
  ])

  await db.insert(reports).values([
    {
      id: 'ACQSC-2026-04-HV',
      name: 'Aged Care Quality Standards Evidence Return',
      status: 'Ready for Review',
      reportingPeriod: 'April 2026',
      facility: 'Harbourview Aged Care',
      dueDate: '1 May 2026',
      dueDateValue: '2026-05-01',
      completion: 92,
      validationStatus: 'Warning',
      lastUpdated: '28 Apr 2026 09:42',
      owner: 'Avery McKenna',
      apiReadiness: 'Partial',
      validationChecks: [
        { name: 'Resident census reconciliation', status: 'Passed', detail: '148 residents reconciled against source registry.' },
        { name: 'Clinical governance evidence', status: 'Warning', detail: 'Two incident follow-ups need final reviewer attestation.' },
        { name: 'Provider identifier mapping', status: 'Passed', detail: 'Facility and organisation identifiers match submission profile.' },
        { name: 'Attachment metadata', status: 'Passed', detail: 'All PDF evidence has owner, timestamp, and retention label.' },
      ],
      warnings: [
        'Two clinical incident records are awaiting reviewer attestation.',
        'Medication variance trend note is present but not yet approved.',
      ],
      auditEvents: [
        { time: '09:42 today', title: 'Evidence return marked ready for review', actor: 'Avery McKenna', color: 'warning' },
        { time: '08:18 today', title: 'Government API schema check completed', actor: 'System', color: 'success' },
        { time: '27 Apr', title: 'Clinical evidence bundle refreshed', actor: 'Priya Nair', color: 'info' },
      ],
    },
    {
      id: 'MED-INC-2026-04',
      name: 'Medication Incident Summary',
      status: 'Failed Validation',
      reportingPeriod: 'April 2026',
      facility: 'Harbourview Aged Care',
      dueDate: '3 May 2026',
      dueDateValue: '2026-05-03',
      completion: 76,
      validationStatus: 'Failed Validation',
      lastUpdated: '28 Apr 2026 08:51',
      owner: 'Jaya Patel',
      apiReadiness: 'Failed Validation',
      validationChecks: [
        { name: 'Incident severity coding', status: 'Blocking', detail: 'Three incidents have unmapped severity codes.' },
        { name: 'Medication chart linkage', status: 'Warning', detail: 'One chart attachment is missing source-system reference.' },
        { name: 'Duplicate incident detection', status: 'Passed', detail: 'No duplicate incident identifiers detected.' },
        { name: 'Submission payload schema', status: 'Blocking', detail: 'Validation failed against medication incident payload schema.' },
      ],
      warnings: ['Three severity codes must be mapped before submission.', 'One chart attachment needs source-system reference.'],
      auditEvents: [
        { time: '08:51 today', title: 'Validation failed', actor: 'System', color: 'error' },
        { time: '08:43 today', title: 'Medication source data refreshed', actor: 'MediTrack API', color: 'info' },
        { time: '27 Apr', title: 'Report owner assigned', actor: 'Avery McKenna', color: 'success' },
      ],
    },
    {
      id: 'WORK-2026-Q2',
      name: 'Workforce Credential Compliance Return',
      status: 'Submitted',
      reportingPeriod: 'Q2 2026',
      facility: 'All Facilities',
      dueDate: '26 Apr 2026',
      dueDateValue: '2026-04-26',
      completion: 100,
      validationStatus: 'Submitted',
      lastUpdated: '26 Apr 2026 15:20',
      owner: 'Mina Chen',
      apiReadiness: 'Ready to submit',
      validationChecks: [
        { name: 'Staff credential completeness', status: 'Passed', detail: 'All mandatory credentials verified.' },
        { name: 'Police check currency', status: 'Passed', detail: 'No expired checks in reporting period.' },
        { name: 'Training evidence metadata', status: 'Passed', detail: 'Evidence includes source, date, and reviewer.' },
        { name: 'Government receipt', status: 'Passed', detail: 'Submission receipt GOV-847193 stored.' },
      ],
      warnings: [],
      auditEvents: [
        { time: '26 Apr', title: 'Report submitted successfully', actor: 'Mina Chen', color: 'success' },
        { time: '26 Apr', title: 'Government receipt stored', actor: 'System', color: 'success' },
        { time: '25 Apr', title: 'Final validation passed', actor: 'System', color: 'success' },
      ],
    },
    {
      id: 'CONSENT-2026-04',
      name: 'Resident Consent Exceptions',
      status: 'Draft',
      reportingPeriod: 'April 2026',
      facility: 'Riverside Manor',
      dueDate: '8 May 2026',
      dueDateValue: '2026-05-08',
      completion: 41,
      validationStatus: 'Draft',
      lastUpdated: '27 Apr 2026 16:07',
      owner: 'Helen Zhao',
      apiReadiness: 'Partial',
      validationChecks: [
        { name: 'Resident exception list', status: 'Warning', detail: 'Draft list generated from admissions data.' },
        { name: 'Consent attachment review', status: 'Warning', detail: 'Five attachments not yet reviewed.' },
        { name: 'Submission payload schema', status: 'Warning', detail: 'Payload cannot be finalized until required fields are complete.' },
        { name: 'Audit ownership', status: 'Passed', detail: 'Owner and reviewer workflow has been assigned.' },
      ],
      warnings: ['Five consent attachments are awaiting review.', 'Two residents do not yet have exception rationale notes.'],
      auditEvents: [
        { time: '27 Apr', title: 'Draft report created', actor: 'Helen Zhao', color: 'info' },
        { time: '27 Apr', title: 'Admissions data imported', actor: 'System', color: 'success' },
      ],
    },
    {
      id: 'WOUND-2026-04-NB',
      name: 'Pressure Injury Monitoring Report',
      status: 'Overdue',
      reportingPeriod: 'April 2026',
      facility: 'Northbank Lodge',
      dueDate: '27 Apr 2026',
      dueDateValue: '2026-04-27',
      completion: 68,
      validationStatus: 'Warning',
      lastUpdated: '28 Apr 2026 07:30',
      owner: 'Amara Reed',
      apiReadiness: 'Partial',
      validationChecks: [
        { name: 'Wound chart completeness', status: 'Blocking', detail: 'Two wound charts are missing required staging fields.' },
        { name: 'Care plan linkage', status: 'Warning', detail: 'One care plan is linked manually and requires verification.' },
        { name: 'RN attestation', status: 'Passed', detail: 'Responsible RN attestation has been captured.' },
        { name: 'Overdue escalation', status: 'Blocking', detail: 'Report is overdue and requires governance acknowledgement.' },
      ],
      warnings: ['Report is overdue by one day.', 'Two wound charts are missing required staging fields.'],
      auditEvents: [
        { time: '07:30 today', title: 'Overdue escalation raised', actor: 'System', color: 'error' },
        { time: '27 Apr', title: 'RN attestation captured', actor: 'Amara Reed', color: 'success' },
        { time: '26 Apr', title: 'Missing wound chart fields detected', actor: 'System', color: 'warning' },
      ],
    },
    {
      id: 'GOV-2026-05',
      name: 'Monthly Clinical Governance Pack',
      status: 'Ready for Review',
      reportingPeriod: 'May 2026',
      facility: 'Wattle Grove Care Suites',
      dueDate: '6 May 2026',
      dueDateValue: '2026-05-06',
      completion: 87,
      validationStatus: 'Validated',
      lastUpdated: '28 Apr 2026 10:12',
      owner: 'Daniel Brooks',
      apiReadiness: 'Ready to submit',
      validationChecks: [
        { name: 'Incident trend summary', status: 'Passed', detail: 'Trend analysis includes falls, medications, wounds, and complaints.' },
        { name: 'Consumer feedback evidence', status: 'Passed', detail: 'Feedback artifacts meet metadata requirements.' },
        { name: 'Reviewer sign-off', status: 'Passed', detail: 'Clinical governance lead sign-off captured.' },
        { name: 'API payload preview', status: 'Passed', detail: 'Payload can be generated for government submission channel.' },
      ],
      warnings: [],
      auditEvents: [
        { time: '10:12 today', title: 'Validation passed', actor: 'System', color: 'success' },
        { time: '09:54 today', title: 'Reviewer sign-off captured', actor: 'Daniel Brooks', color: 'success' },
        { time: '27 Apr', title: 'Consumer feedback evidence refreshed', actor: 'Mia Fraser', color: 'info' },
      ],
    },
  ])

  await db.insert(auditLogs).values([
    audit('AUD-10042', '2026-04-28T09:42:00+10:00', 'Priya Nair', 'Clinical Governance Lead', 'Resident assessment updated', 'Assessment', 'Resident Assessment', 'RES-1042', 'Falls risk: Medium; wound chart: not reviewed', 'Falls risk: High; wound chart: review required', 'High', 'Care Plan UI', 'Clinical assessment was updated after review of recent wound-care notes and falls-prevention observations.'),
    audit('AUD-10039', '2026-04-28T08:51:00+10:00', 'System', 'Validation Service', 'Report validation failed', 'Validation', 'Compliance Report', 'MED-INC-2026-04', 'Validation status: Warning', 'Validation status: Failed Validation; blocking errors: 3', 'Critical', 'Validation Engine', 'Medication incident report failed schema validation because three severity codes were not mapped to the government reporting taxonomy.'),
    audit('AUD-10036', '2026-04-27T15:20:00+10:00', 'Mina Chen', 'Workforce Compliance Manager', 'API submission completed', 'API Submission', 'Government Submission', 'WORK-2026-Q2', 'Submission status: Ready to submit', 'Submission status: Submitted; receipt: GOV-847193', 'Low', 'Government API', 'Workforce credential compliance return was submitted successfully and the government receipt was attached to the audit trail.'),
    audit('AUD-10031', '2026-04-27T13:04:00+10:00', 'System', 'Evidence Monitor', 'Missing document flagged', 'Document', 'Resident Document', 'RES-1633', 'Restrictive practice approval: present=false; escalation=false', 'Restrictive practice approval: present=false; escalation=true', 'Critical', 'Evidence Scanner', 'Restrictive practice approval evidence was missing for a critical-risk dementia support resident and was escalated for governance review.'),
    audit('AUD-10027', '2026-04-26T16:12:00+10:00', 'Avery McKenna', 'Compliance Lead', 'User role changed', 'Access', 'User Account', 'USR-204', 'Role: Report Viewer; facility scope: Harbourview', 'Role: Report Reviewer; facility scope: Harbourview, Riverside Manor', 'High', 'Admin Console', 'Access role was elevated to allow report review across two facilities. Change requires periodic access review.'),
    audit('AUD-10022', '2026-04-26T10:28:00+10:00', 'System', 'Integration Worker', 'Data sync retry triggered', 'System', 'API Sync Job', 'SYNC-MEDITRACK-8842', 'Status: Failed; failed records: 42', 'Status: Retrying; failed records: 17', 'Medium', 'Integration Service', 'Medication data pipeline retry was triggered after transient vendor API timeout. Failed record count reduced after retry.'),
    audit('AUD-10018', '2026-04-25T14:38:00+10:00', 'Helen Zhao', 'Care Coordinator', 'Missing document flagged', 'Document', 'Consent Evidence', 'RES-1270', 'Respite discharge checklist: not required', 'Respite discharge checklist: required before transfer', 'Medium', 'Resident Registry', 'Respite workflow moved resident into discharge preparation, making the discharge checklist mandatory for compliance evidence.'),
    audit('AUD-10011', '2026-04-24T11:03:00+10:00', 'Omar Haddad', 'Care Manager', 'Resident assessment updated', 'Assessment', 'Care Plan', 'RES-1325', 'Assessment state: Draft', 'Assessment state: Locked for audit; risk: Low', 'Info', 'Care Plan UI', 'Care plan review was completed and locked, making the record available for evidence export.'),
  ])

  await db.insert(apiSyncConnections).values([
    { id: 'api-1', name: 'Resident Management System', vendor: 'CareCloud', status: 'Connected', lastSync: '6 minutes ago', lastSyncAt: new Date('2026-04-28T09:46:00+10:00'), records: 1284, failedRecords: 0, enabled: true },
    { id: 'api-2', name: 'Medication Administration', vendor: 'MediTrack', status: 'Degraded', lastSync: '42 minutes ago', lastSyncAt: new Date('2026-04-28T09:10:00+10:00'), records: 438, failedRecords: 17, enabled: true },
    { id: 'api-3', name: 'Incident Register', vendor: 'RiskBase', status: 'Connected', lastSync: '12 minutes ago', lastSyncAt: new Date('2026-04-28T09:40:00+10:00'), records: 213, failedRecords: 0, enabled: true },
    { id: 'api-4', name: 'Staff Credentialing', vendor: 'WorkforceOne', status: 'Paused', lastSync: '2 days ago', lastSyncAt: new Date('2026-04-26T10:12:00+10:00'), records: 96, failedRecords: 0, enabled: false },
  ])

  await db.insert(apiSyncHistory).values([
    history('sync-1', 'api-1', '2026-04-28T09:46:00+10:00', 'Succeeded', 1284, 0, 'Resident profile sync completed and all required fields validated.'),
    history('sync-2', 'api-2', '2026-04-28T09:10:00+10:00', 'Failed', 438, 17, 'Medication variance feed returned unmapped severity codes.'),
    history('sync-3', 'api-2', '2026-04-26T10:28:00+10:00', 'Retried', 421, 17, 'Retry reduced failed records after transient vendor timeout.'),
    history('sync-4', 'api-3', '2026-04-28T09:40:00+10:00', 'Succeeded', 213, 0, 'Incident register sync completed.'),
    history('sync-5', 'api-4', '2026-04-26T10:12:00+10:00', 'Succeeded', 96, 0, 'Staff credential evidence imported before connection was paused.'),
  ])

  await db.insert(dashboardMetrics).values({
    id: 'default',
    kpis: [
      { label: 'Total Residents', value: 148, change: 'Across 4 care communities', trend: '+3', trendDirection: 'up', color: 'primary', icon: 'mdi-account-group-outline' },
      { label: 'Open Compliance Issues', value: 28, change: '11 due within 48 hours', trend: '-6%', trendDirection: 'down', color: 'warning', icon: 'mdi-clipboard-alert-outline' },
      { label: 'Reports Due This Week', value: 9, change: '4 awaiting clinical sign-off', trend: '+2', trendDirection: 'up', color: 'info', icon: 'mdi-file-clock-outline' },
      { label: 'API Sync Health', value: '92%', change: '1 degraded source', trend: 'Stable', trendDirection: 'flat', color: 'success', icon: 'mdi-cloud-check-outline' },
      { label: 'High Risk Flags', value: 7, change: 'Medication and wound care', trend: '+2', trendDirection: 'up', color: 'error', icon: 'mdi-alert-decagram-outline' },
    ],
    complianceStatuses: [
      { area: 'Aged Care Quality Standards', summary: 'Evidence register and consumer dignity controls are on track.', indicator: 'Green', progress: 88, openItems: 6, trend: '+4%', trendIcon: 'mdi-trending-up', trendColor: 'success', color: 'success', icon: 'mdi-shield-check-outline' },
      { area: 'Clinical Governance', summary: 'Incident follow-ups need additional RN review before Friday.', indicator: 'Amber', progress: 72, openItems: 14, trend: '-3%', trendIcon: 'mdi-trending-down', trendColor: 'warning', color: 'warning', icon: 'mdi-stethoscope' },
      { area: 'Medication Safety', summary: 'Two high-risk medication reviews are overdue for pharmacist sign-off.', indicator: 'Red', progress: 59, openItems: 8, trend: '+2 flags', trendIcon: 'mdi-trending-up', trendColor: 'error', color: 'error', icon: 'mdi-pill' },
    ],
    recentActivity: [
      { time: '09:42', area: 'Clinical Governance', event: 'Falls incident review completed', reference: 'Resident R-1187 · RN sign-off captured', severity: 'Medium', status: 'Complete', action: 'Open' },
      { time: '09:18', area: 'Medication Safety', event: 'Missed medication variance detected', reference: 'MediTrack variance MT-4428', severity: 'High', status: 'Action required', action: 'Review' },
      { time: '08:57', area: 'Consumer Dignity', event: 'Consent form expiry warning', reference: '3 residents require updated consent evidence', severity: 'Medium', status: 'Due soon', action: 'Assign' },
      { time: '08:31', area: 'Workforce', event: 'Credential audit evidence uploaded', reference: 'Manual handling certificates · 18 staff', severity: 'Low', status: 'On track', action: 'View' },
      { time: '07:55', area: 'Wound Care', event: 'Pressure injury care plan overdue', reference: 'Resident R-1042 · Stage 2 wound chart', severity: 'Critical', status: 'Overdue', action: 'Escalate' },
    ],
    reportingDeadlines: [
      { name: 'Monthly Clinical Governance Pack', dueDate: '1 May 2026', team: 'Clinical Quality', status: 'Ready' },
      { name: 'Medication Incident Summary', dueDate: '3 May 2026', team: 'Pharmacy & RN Leads', status: 'In review' },
      { name: 'ACQSC Evidence Register', dueDate: '6 May 2026', team: 'Compliance', status: 'At risk' },
      { name: 'Resident Consent Exceptions', dueDate: '8 May 2026', team: 'Admissions', status: 'Draft' },
    ],
    systemHealth: [
      { label: 'Government API connection', detail: 'ACQSC provider portal endpoint responding in 182ms', status: 'Connected', color: 'success', icon: 'mdi-lan-connect' },
      { label: 'Data pipeline status', detail: 'Resident, incident, medication, and workforce feeds active', status: 'Degraded', color: 'warning', icon: 'mdi-pipe' },
      { label: 'Exception queue', detail: '17 records failed validation and require mapping review', status: 'Action required', color: 'error', icon: 'mdi-database-alert-outline' },
    ],
    complianceSignals: [
      { label: 'Critical resident risks', value: 7, change: '+2 this week', color: 'error' },
      { label: 'Open actions', value: 28, change: '11 due in 48h', color: 'warning' },
      { label: 'Evidence readiness', value: '86%', change: '+9% vs last month', color: 'success' },
      { label: 'API sync health', value: '92%', change: '1 degraded source', color: 'info' },
    ],
    complianceFocus: [
      'Medication reviews pending clinical sign-off',
      'Consent documentation missing for 3 residents',
      'Pressure injury prevention plans due for refresh',
      'Staff credential evidence ready for accreditation audit',
    ],
    lastSuccessfulSync: '09:46 today',
    failedRecords: 17,
    updatedAt: now,
  })

  const seededAudit = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(1)
  console.log(`Seed complete. Latest audit event: ${seededAudit[0]?.id ?? 'none'}`)
}

function audit(
  id: string,
  timestamp: string,
  user: string,
  role: string,
  action: string,
  eventType: 'Assessment' | 'Validation' | 'API Submission' | 'Document' | 'Access' | 'System',
  entityType: string,
  entityId: string,
  previousValue: string,
  newValue: string,
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical',
  source: string,
  details: string,
) {
  const date = timestamp.slice(0, 10)
  const time = timestamp.slice(11, 16)

  return {
    id,
    timestamp: new Date(timestamp),
    date,
    time,
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

function history(
  id: string,
  connectionId: string,
  timestamp: string,
  status: 'Succeeded' | 'Failed' | 'Retried',
  recordsProcessed: number,
  failedRecords: number,
  message: string,
) {
  return {
    id,
    connectionId,
    timestamp: new Date(timestamp),
    status,
    recordsProcessed,
    failedRecords,
    message,
  }
}

seed()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await sql.end()
  })
