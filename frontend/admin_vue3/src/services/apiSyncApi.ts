import { apiSyncMock } from '@/mocks/apiSyncMock'
import type { ApiSyncResponse, RetryApiSyncResponse } from '@/types/apiSync'
import { httpClient } from './httpClient'

export const apiSyncApi = {
  async getApiSync(): Promise<{ data: ApiSyncResponse; fromMock: boolean; error?: string }> {
    try {
      return { data: await httpClient.get<ApiSyncResponse>('/api-sync'), fromMock: false }
    } catch (error) {
      return {
        data: apiSyncMock,
        fromMock: true,
        error: error instanceof Error ? error.message : 'Unable to load API sync status',
      }
    }
  },

  async retryConnection(id: string): Promise<RetryApiSyncResponse> {
    return httpClient.post<RetryApiSyncResponse>(`/api-sync/${encodeURIComponent(id)}/retry`)
  },
}
