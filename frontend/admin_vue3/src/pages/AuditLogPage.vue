<template>
  <PageHeader
    description="Trace every regulated data change, validation outcome, API event, and access update with source and before/after values."
    eyebrow="Accuracy & Auditability"
    title="Audit Log"
  >
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-download-outline">Download CSV</v-btn>
      <v-btn prepend-icon="mdi-shield-search" variant="outlined">Review Exceptions</v-btn>
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
      <v-btn size="small" variant="text" @click="loadAuditLog">Retry</v-btn>
    </template>
  </v-alert>

  <v-progress-linear
    v-if="loading"
    class="mb-4"
    color="primary"
    indeterminate
    rounded
  />

  <v-row class="mb-1">
    <v-col v-for="metric in auditMetrics" :key="metric.label" cols="12" sm="6" lg="3">
      <v-card class="dashboard-card h-full" elevation="0">
        <v-card-text>
          <div class="mb-3 flex items-center justify-between gap-3">
            <span class="text-sm font-medium text-medium-emphasis">{{ metric.label }}</span>
            <v-avatar :color="metric.color" size="32" variant="tonal">
              <v-icon :icon="metric.icon" size="17" />
            </v-avatar>
          </div>
          <div class="text-2xl font-bold">{{ metric.value }}</div>
          <div class="mt-1 text-sm text-medium-emphasis">{{ metric.detail }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-card class="dashboard-card" elevation="0">
    <v-card-text class="pb-2">
      <v-row align="center">
        <v-col cols="12" lg="3" md="6">
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            hide-details
            label="Search audit log"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" lg="2" md="6">
          <v-text-field
            v-model="dateFrom"
            density="comfortable"
            hide-details
            label="Date from"
            type="date"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" lg="2" md="6">
          <v-text-field
            v-model="dateTo"
            density="comfortable"
            hide-details
            label="Date to"
            type="date"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" lg="2" md="6">
          <v-select
            v-model="userFilter"
            :items="userOptions"
            density="comfortable"
            hide-details
            label="User"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" lg="3" md="6">
          <v-select
            v-model="eventTypeFilter"
            :items="eventTypeOptions"
            density="comfortable"
            hide-details
            label="Event type"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" lg="2" md="6">
          <v-select
            v-model="severityFilter"
            :items="severityOptions"
            density="comfortable"
            hide-details
            label="Severity"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <div class="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="text-sm text-medium-emphasis">
          Showing <strong>{{ filteredEvents.length }}</strong> immutable audit entries.
        </div>
        <div class="flex flex-wrap gap-2">
          <v-chip color="primary" label size="small" variant="tonal">
            Expand rows for change details
          </v-chip>
          <v-chip color="info" label size="small" variant="tonal">
            Mock regulated data only
          </v-chip>
        </div>
      </div>
    </v-card-text>

    <v-data-table
      v-model:expanded="expanded"
      :headers="headers"
      :items="filteredEvents"
      density="comfortable"
      expand-on-click
      item-value="id"
      items-per-page="10"
      show-expand
    >
      <template #[`item.timestamp`]="{ item }">
        <div>
          <div class="font-semibold">{{ item.time }}</div>
          <div class="text-xs text-medium-emphasis">{{ item.date }}</div>
        </div>
      </template>

      <template #[`item.user`]="{ item }">
        <div>
          <div class="font-semibold">{{ item.user }}</div>
          <div class="text-xs text-medium-emphasis">{{ item.id }}</div>
        </div>
      </template>

      <template #[`item.action`]="{ item }">
        <div class="min-w-56">
          <div class="font-semibold">{{ item.action }}</div>
          <div class="mt-1">
            <StatusChip :label="item.eventType" />
          </div>
        </div>
      </template>

      <template #[`item.entityId`]="{ item }">
        <span class="font-mono text-sm">{{ item.entityId }}</span>
      </template>

      <template #[`item.previousValue`]="{ item }">
        <span class="line-clamp-2 text-sm text-medium-emphasis">{{ item.previousValue }}</span>
      </template>

      <template #[`item.newValue`]="{ item }">
        <span class="line-clamp-2 text-sm">{{ item.newValue }}</span>
      </template>

      <template #[`item.severity`]="{ item }">
        <StatusChip :label="item.severity" />
      </template>

      <template #[`item.source`]="{ item }">
        <v-chip label size="small" variant="tonal">
          {{ item.source }}
        </v-chip>
      </template>

      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="bg-surface">
            <div class="grid gap-4 px-2 py-5 lg:grid-cols-[1.2fr_1fr_1fr]">
              <div>
                <div class="mb-2 text-xs font-medium uppercase tracking-wide text-medium-emphasis">
                  Change details
                </div>
                <div class="rounded-lg border border-solid border-[rgba(var(--v-theme-outline-variant),0.7)] p-4">
                  <p class="text-sm leading-6">{{ item.details }}</p>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <StatusChip :label="item.eventType" />
                    <StatusChip :label="item.severity" />
                    <v-chip label size="small" variant="tonal">{{ item.source }}</v-chip>
                  </div>
                </div>
              </div>

              <div>
                <div class="mb-2 text-xs font-medium uppercase tracking-wide text-medium-emphasis">
                  Previous value
                </div>
                <pre class="overflow-auto rounded-lg bg-background p-4 text-xs leading-5">{{ item.previousValue }}</pre>
              </div>

              <div>
                <div class="mb-2 text-xs font-medium uppercase tracking-wide text-medium-emphasis">
                  New value
                </div>
                <pre class="overflow-auto rounded-lg bg-background p-4 text-xs leading-5">{{ item.newValue }}</pre>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { auditLogMock } from '@/mocks/auditLogMock'
import { auditLogApi } from '@/services/auditLogApi'
import type { AuditEntry } from '@/types/auditLog'

const search = ref('')
const dateFrom = ref('2026-04-24')
const dateTo = ref('2026-04-28')
const userFilter = ref('All')
const eventTypeFilter = ref('All')
const severityFilter = ref('All')
const expanded = ref<string[]>([])
const loading = ref(false)
const loadError = ref('')
const auditEntries = ref<AuditEntry[]>(auditLogMock.auditEntries)

const headers = [
  { title: 'Timestamp', key: 'timestamp' },
  { title: 'User', key: 'user' },
  { title: 'Role', key: 'role' },
  { title: 'Action', key: 'action' },
  { title: 'Entity Type', key: 'entityType' },
  { title: 'Entity ID', key: 'entityId' },
  { title: 'Previous Value', key: 'previousValue' },
  { title: 'New Value', key: 'newValue' },
  { title: 'Severity', key: 'severity' },
  { title: 'Source', key: 'source' },
] as const

const userOptions = computed(() => [
  'All',
  ...Array.from(new Set(auditEntries.value.map(entry => entry.user))).sort(),
])

const eventTypeOptions = ['All', 'Assessment', 'Validation', 'API Submission', 'Document', 'Access', 'System']
const severityOptions = ['All', 'Info', 'Low', 'Medium', 'High', 'Critical']

const filteredEvents = computed(() => {
  const term = search.value.toLowerCase()
  const from = dateFrom.value ? new Date(dateFrom.value + 'T00:00:00').getTime() : Number.NEGATIVE_INFINITY
  const to = dateTo.value ? new Date(dateTo.value + 'T23:59:59').getTime() : Number.POSITIVE_INFINITY

  return auditEntries.value.filter(entry => {
    const entryTime = new Date(entry.timestamp).getTime()
    const matchesDate = entryTime >= from && entryTime <= to
    const matchesUser = userFilter.value === 'All' || entry.user === userFilter.value
    const matchesType = eventTypeFilter.value === 'All' || entry.eventType === eventTypeFilter.value
    const matchesSeverity = severityFilter.value === 'All' || entry.severity === severityFilter.value
    const matchesSearch = [
      entry.user,
      entry.role,
      entry.action,
      entry.entityType,
      entry.entityId,
      entry.previousValue,
      entry.newValue,
      entry.source,
      entry.details,
    ].some(value => value.toLowerCase().includes(term))

    return matchesDate && matchesUser && matchesType && matchesSeverity && matchesSearch
  })
})

const auditMetrics = computed(() => [
  {
    label: 'Events in range',
    value: filteredEvents.value.length,
    detail: 'After active filters',
    color: 'primary',
    icon: 'mdi-history',
  },
  {
    label: 'Critical events',
    value: filteredEvents.value.filter(entry => entry.severity === 'Critical').length,
    detail: 'Requires governance review',
    color: 'error',
    icon: 'mdi-alert-decagram-outline',
  },
  {
    label: 'System generated',
    value: filteredEvents.value.filter(entry => entry.user === 'System').length,
    detail: 'Automation and integration actions',
    color: 'info',
    icon: 'mdi-cog-sync-outline',
  },
  {
    label: 'Access changes',
    value: filteredEvents.value.filter(entry => entry.eventType === 'Access').length,
    detail: 'Role and permission updates',
    color: 'warning',
    icon: 'mdi-account-key-outline',
  },
])

async function loadAuditLog () {
  loading.value = true
  const result = await auditLogApi.getAuditLog()

  auditEntries.value = result.data.auditEntries
  loadError.value = result.fromMock ? (result.error ?? 'Unable to reach backend.') : ''
  loading.value = false
}

onMounted(loadAuditLog)
</script>
