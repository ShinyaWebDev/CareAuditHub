import type { ApiSyncResponse } from '@/types/apiSync'

export const apiSyncMock: ApiSyncResponse = {
  apiConnections: [
    { id: 'api-1', name: 'Resident Management System', vendor: 'CareCloud', status: 'Connected', lastSync: '6 minutes ago', records: 1284, failedRecords: 0, enabled: true },
    { id: 'api-2', name: 'Medication Administration', vendor: 'MediTrack', status: 'Degraded', lastSync: '42 minutes ago', records: 438, failedRecords: 17, enabled: true },
    { id: 'api-3', name: 'Incident Register', vendor: 'RiskBase', status: 'Connected', lastSync: '12 minutes ago', records: 213, failedRecords: 0, enabled: true },
    { id: 'api-4', name: 'Staff Credentialing', vendor: 'WorkforceOne', status: 'Paused', lastSync: '2 days ago', records: 96, failedRecords: 0, enabled: false },
  ],
  history: [
    { id: 'sync-1', connectionId: 'api-1', timestamp: '2026-04-28T09:46:00', status: 'Succeeded', recordsProcessed: 1284, failedRecords: 0, message: 'Resident profile sync completed.' },
    { id: 'sync-2', connectionId: 'api-2', timestamp: '2026-04-28T09:10:00', status: 'Failed', recordsProcessed: 438, failedRecords: 17, message: 'Medication variance feed returned unmapped severity codes.' },
  ],
}
