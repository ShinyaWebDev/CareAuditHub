import { reportsMock } from '@/mocks/reportsMock'
import type { ComplianceReport, ReportsResponse, ValidateReportResponse } from '@/types/report'
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

  async validateReport(id: string): Promise<ValidateReportResponse> {
    try {
      return await httpClient.post<ValidateReportResponse>(`/reports/${encodeURIComponent(id)}/validate`)
    } catch {
      const report = reportsMock.reports.find(item => item.id === id)

      if (!report) {
        throw new Error('Report not found')
      }

      const blockingChecks = report.validationChecks.filter(check => check.status === 'Blocking')
      const warningChecks = report.validationChecks.filter(check => check.status === 'Warning')
      const status = blockingChecks.length ? 'Failed Validation' : warningChecks.length ? 'Warning' : 'Validated'

      return {
        report: {
          ...report,
          validationStatus: status,
          apiReadiness: blockingChecks.length ? 'Failed Validation' : warningChecks.length ? 'Partial' : 'Ready to submit',
        },
        validation: {
          status,
          blockingChecks: blockingChecks.length,
          warningChecks: warningChecks.length,
          canSubmit: blockingChecks.length === 0,
        },
      }
    }
  },
}
