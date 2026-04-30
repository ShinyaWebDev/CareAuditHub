export type SyncStatus = 'Connected' | 'Degraded' | 'Paused'

export interface ApiConnection {
  id: string
  name: string
  vendor: string
  status: SyncStatus
  lastSync: string
  records: number
  failedRecords?: number
  enabled?: boolean
}

export interface ApiSyncHistoryEvent {
  id: string
  connectionId: string
  timestamp: string
  status: 'Succeeded' | 'Failed' | 'Retried'
  recordsProcessed: number
  failedRecords: number
  message: string
}

export interface ApiSyncResponse {
  apiConnections: ApiConnection[]
  history?: ApiSyncHistoryEvent[]
  metrics?: {
    totalConnections: number
    connected: number
    degraded: number
    paused: number
    failedRecords: number
  }
}

export interface RetryApiSyncResponse {
  connection: ApiConnection
  history: ApiSyncHistoryEvent[]
}
