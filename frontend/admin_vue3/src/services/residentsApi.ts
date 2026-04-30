import { residentsMock } from '@/mocks/residentsMock'
import type { ResidentRecord, ResidentsResponse } from '@/types/resident'
import { httpClient } from './httpClient'

export const residentApi = {
  async getResidents(): Promise<{ data: ResidentsResponse; fromMock: boolean; error?: string }> {
    try {
      return { data: await httpClient.get<ResidentsResponse>('/residents'), fromMock: false }
    } catch (error) {
      return {
        data: residentsMock,
        fromMock: true,
        error: error instanceof Error ? error.message : 'Unable to load residents',
      }
    }
  },

  async getResident(id: string): Promise<ResidentRecord> {
    return httpClient.get<ResidentRecord>(`/residents/${encodeURIComponent(id)}`)
  },
}
