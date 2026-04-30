export type ComplianceStatus = 'Compliant' | 'Review due' | 'Documents missing' | 'Pending review'
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

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

export interface ResidentRecord {
  residentId: string
  name: string
  facility: string
  careLevel: string
  lastAssessmentDate: string
  complianceStatus: ComplianceStatus
  riskLevel: RiskLevel
  missingDocuments: string[]
  lastUpdated: string
  room: string
  primaryContact: string
  documentation: DocumentationItem[]
  events: ResidentEvent[]
  notes: string
  auditTrail: string[]
}

export interface ResidentsResponse {
  residents: ResidentRecord[]
  metrics?: {
    residentsInView: number
    missingDocuments: number
    highOrCriticalRisk: number
    compliantRecords: number
  }
  filters?: {
    facilities: string[]
    riskLevels: string[]
    complianceStatuses: string[]
  }
}
