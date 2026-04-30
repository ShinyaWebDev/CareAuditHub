export interface DashboardKpi {
  label: string
  value: string | number
  change: string
  trend: string
  trendDirection: 'up' | 'down' | 'flat'
  color: string
  icon: string
}

export interface ComplianceStatus {
  area: string
  summary: string
  indicator: string
  progress: number
  openItems: number
  trend: string
  trendIcon: string
  trendColor: string
  color: string
  icon: string
}

export interface DashboardActivity {
  time: string
  area: string
  event: string
  reference: string
  severity: string
  status: string
  action: string
}

export interface ReportingDeadline {
  name: string
  dueDate: string
  team: string
  status: string
}

export interface SystemHealthItem {
  label: string
  detail: string
  status: string
  color: string
  icon: string
}

export interface DashboardResponse {
  id?: string
  kpis: DashboardKpi[]
  complianceStatuses: ComplianceStatus[]
  recentActivity: DashboardActivity[]
  reportingDeadlines: ReportingDeadline[]
  systemHealth: SystemHealthItem[]
  complianceSignals?: Array<{ label: string; value: string | number; change: string; color: string }>
  complianceFocus?: string[]
  lastSuccessfulSync: string
  failedRecords: number
}
