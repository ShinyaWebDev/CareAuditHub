import type { DashboardResponse } from '@/types/dashboard'

export const dashboardMock: DashboardResponse = {
  id: 'mock-dashboard',
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
}
