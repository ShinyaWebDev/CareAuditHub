import { auditLogMock } from '@/mocks/auditLogMock'
import type { AuditLogResponse } from '@/types/auditLog'
import { httpClient } from './httpClient'

export const auditLogApi = {
  async getAuditLog(): Promise<{ data: AuditLogResponse; fromMock: boolean; error?: string }> {
    try {
      return { data: await httpClient.get<AuditLogResponse>('/audit-log'), fromMock: false }
    } catch (error) {
      return {
        data: auditLogMock,
        fromMock: true,
        error: error instanceof Error ? error.message : 'Unable to load audit log',
      }
    }
  },
}
