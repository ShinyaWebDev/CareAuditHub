<template>
  <PageHeader
    description="Monitor source-system health before compliance reporting depends on stale records."
    title="API Sync"
  >
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-sync">Sync Now</v-btn>
    </template>
  </PageHeader>

  <v-alert
    v-if="loadError"
    class="mb-4"
    color="warning"
    density="comfortable"
    icon="mdi-database-alert-outline"
    variant="tonal"
  >
    {{ loadError }} Showing fallback data.
    <template #append>
      <v-btn size="small" variant="text" @click="loadApiSync">Retry</v-btn>
    </template>
  </v-alert>

  <v-progress-linear
    v-if="loading"
    class="mb-4"
    color="primary"
    indeterminate
    rounded
  />

  <v-row>
    <v-col v-for="connection in apiConnections" :key="connection.id" cols="12" md="6">
      <v-card class="dashboard-card h-full" elevation="0">
        <v-card-text>
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="section-title">{{ connection.name }}</h2>
              <div class="mt-1 text-sm text-medium-emphasis">{{ connection.vendor }}</div>
            </div>
            <StatusChip :label="connection.status" />
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div>
              <div class="text-xs uppercase tracking-wide text-medium-emphasis">Last sync</div>
              <div class="mt-1 font-semibold">{{ connection.lastSync }}</div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wide text-medium-emphasis">Records</div>
              <div class="mt-1 font-semibold">{{ connection.records.toLocaleString() }}</div>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="primary" variant="text">View Payloads</v-btn>
          <v-spacer />
          <v-btn
            v-if="connection.status === 'Degraded'"
            color="warning"
            :loading="retryingId === connection.id"
            size="small"
            variant="text"
            @click="retryConnection(connection.id)"
          >
            Retry
          </v-btn>
          <v-switch
            :model-value="connection.status !== 'Paused'"
            color="primary"
            density="compact"
            hide-details
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { apiSyncApi } from '@/services/apiSyncApi'
import { apiSyncMock } from '@/mocks/apiSyncMock'
import type { ApiConnection } from '@/types/apiSync'

const loading = ref(false)
const loadError = ref('')
const retryingId = ref('')
const apiConnections = ref<ApiConnection[]>(apiSyncMock.apiConnections)

async function loadApiSync () {
  loading.value = true
  const result = await apiSyncApi.getApiSync()

  apiConnections.value = result.data.apiConnections
  loadError.value = result.fromMock ? (result.error ?? 'Unable to reach backend.') : ''
  loading.value = false
}

async function retryConnection (id: string) {
  retryingId.value = id

  try {
    const result = await apiSyncApi.retryConnection(id)
    apiConnections.value = apiConnections.value.map(connection =>
      connection.id === id ? result.connection : connection,
    )
    loadError.value = ''
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Unable to retry connection.'
  } finally {
    retryingId.value = ''
  }
}

onMounted(loadApiSync)
</script>
