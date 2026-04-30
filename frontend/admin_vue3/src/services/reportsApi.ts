import { reportsMock } from '@/mocks/reportsMock'
import type { ComplianceReport, CreateReportRequest, CreateReportResponse, ReportsResponse, ValidateReportResponse } from '@/types/report'
import { httpClient } from './httpClient'

export const reportApi = {
  async getReports(): Promise<{ data: ReportsResponse; fromMock: boolean; error?: string }> {
    try {
      return { data: await httpClient.get<ReportsResponse>('/reports'), fromMock: false }
    } catch (error) {
      return {
        data: reportsMock,
        fromMock: true,
        error: error instanceof Error ? error.message : 'Unable to load reports',
      }
    }
  },

  async getReport(id: string): Promise<ComplianceReport> {
    return httpClient.get<ComplianceReport>(`/reports/${encodeURIComponent(id)}`)
  },

  async createReport(input: CreateReportRequest): Promise<CreateReportResponse> {
    return httpClient.post<CreateReportResponse, CreateReportRequest>('/reports', input)
  },

  async validateReport(id: string): Promise<ValidateReportResponse> {
    return httpClient.post<ValidateReportResponse>(`/reports/${encodeURIComponent(id)}/validate`)
  },
}
