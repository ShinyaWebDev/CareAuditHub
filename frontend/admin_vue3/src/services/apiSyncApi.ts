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
    try {
      return await httpClient.post<RetryApiSyncResponse>(`/api-sync/${encodeURIComponent(id)}/retry`)
    } catch {
      const connection = apiSyncMock.apiConnections.find(item => item.id === id)

      if (!connection) {
        throw new Error('API sync connection not found')
      }

      return {
        connection: {
          ...connection,
          status: connection.failedRecords ? 'Degraded' : 'Connected',
          lastSync: 'just now',
          enabled: true,
        },
        history: apiSyncMock.history ?? [],
      }
    }
  },
}
