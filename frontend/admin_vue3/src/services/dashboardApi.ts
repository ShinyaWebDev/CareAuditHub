import { dashboardMock } from '@/mocks/dashboardMock'
import type { DashboardResponse } from '@/types/dashboard'
import { httpClient } from './httpClient'

export const dashboardApi = {
  async getDashboard(): Promise<{ data: DashboardResponse; fromMock: boolean; error?: string }> {
    try {
      return { data: await httpClient.get<DashboardResponse>('/dashboard'), fromMock: false }
    } catch (error) {
      return {
        data: dashboardMock,
        fromMock: true,
        error: error instanceof Error ? error.message : 'Unable to load dashboard',
      }
    }
  },
}
