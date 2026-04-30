<template>
  <PageHeader
    description="A live executive view of resident compliance risk, reporting readiness, and connected system health across Harbourview Aged Care."
    eyebrow="Harbourview Aged Care"
    title="Compliance Dashboard"
  >
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-file-download-outline">Export Board Pack</v-btn>
      <v-btn prepend-icon="mdi-calendar-range" variant="outlined">This Week</v-btn>
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
      <v-btn size="small" variant="text" @click="loadDashboard">Retry</v-btn>
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
    <v-col v-for="kpi in kpis" :key="kpi.label" cols="12" md="6" xl>
      <MetricCard
        :change="kpi.change"
        :color="kpi.color"
        :icon="kpi.icon"
        :label="kpi.label"
        :trend="kpi.trend"
        :trend-direction="kpi.trendDirection"
        :value="kpi.value"
      />
    </v-col>
  </v-row>

  <v-row class="mt-1">
    <v-col cols="12" lg="8">
      <v-card class="dashboard-card" elevation="0">
        <v-card-title class="section-title">Compliance Status</v-card-title>
        <v-card-subtitle>Quality standards, clinical governance, and evidence readiness</v-card-subtitle>
        <v-card-text>
          <div class="grid gap-4">
            <div
              v-for="status in complianceStatuses"
              :key="status.area"
              class="rounded-lg border border-solid border-[rgba(var(--v-theme-outline-variant),0.7)] p-4"
            >
              <div class="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div class="flex items-center gap-3">
                  <v-avatar :color="status.color" size="34" variant="tonal">
                    <v-icon :icon="status.icon" size="18" />
                  </v-avatar>
                  <div>
                    <div class="font-semibold">{{ status.area }}</div>
                    <div class="text-sm text-medium-emphasis">{{ status.summary }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <StatusChip :label="status.indicator" />
                  <v-chip :color="status.trendColor" label size="small" variant="tonal">
                    <v-icon :icon="status.trendIcon" size="15" start />
                    {{ status.trend }}
                  </v-chip>
                </div>
              </div>
              <v-progress-linear
                :color="status.color"
                height="9"
                :model-value="status.progress"
                rounded
              />
              <div class="mt-2 flex justify-between text-xs text-medium-emphasis">
                <span>{{ status.progress }}% complete</span>
                <span>{{ status.openItems }} open items</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" lg="4">
      <v-card class="dashboard-card h-full" elevation="0">
        <v-card-title class="section-title">System Health</v-card-title>
        <v-card-subtitle>Operational readiness for compliance reporting</v-card-subtitle>
        <v-card-text>
          <div class="grid gap-4">
            <div v-for="item in systemHealth" :key="item.label" class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3">
                <v-avatar :color="item.color" size="34" variant="tonal">
                  <v-icon :icon="item.icon" size="18" />
                </v-avatar>
                <div>
                  <div class="font-semibold">{{ item.label }}</div>
                  <div class="text-sm text-medium-emphasis">{{ item.detail }}</div>
                </div>
              </div>
              <StatusChip :label="item.status" />
            </div>
          </div>
          <v-divider class="my-5" />
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-surface p-3">
              <div class="text-xs uppercase tracking-wide text-medium-emphasis">Last successful sync</div>
              <div class="mt-1 text-lg font-bold">{{ lastSuccessfulSync }}</div>
            </div>
            <div class="rounded-lg bg-surface p-3">
              <div class="text-xs uppercase tracking-wide text-medium-emphasis">Failed records</div>
              <div class="mt-1 text-lg font-bold text-error">{{ failedRecords }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" xl="8">
      <v-card class="dashboard-card" elevation="0">
        <v-card-title class="section-title">Recent Activity</v-card-title>
        <v-data-table
          :headers="activityHeaders"
          :items="recentActivity"
          density="comfortable"
          items-per-page="5"
        >
          <template #[`item.area`]="{ item }">
            <span class="font-medium">{{ item.area }}</span>
          </template>
          <template #[`item.event`]="{ item }">
            <div>
              <div class="font-semibold">{{ item.event }}</div>
              <div class="text-xs text-medium-emphasis">{{ item.reference }}</div>
            </div>
          </template>
          <template #[`item.severity`]="{ item }">
            <StatusChip :label="item.severity" />
          </template>
          <template #[`item.status`]="{ item }">
            <StatusChip :label="item.status" />
          </template>
          <template #[`item.action`]="{ item }">
            <v-btn color="primary" size="small" variant="text">{{ item.action }}</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <v-col cols="12" xl="4">
      <v-card class="dashboard-card" elevation="0">
        <v-card-title class="section-title">Upcoming Reporting Deadlines</v-card-title>
        <v-card-text>
          <div class="grid gap-3">
            <div
              v-for="deadline in reportingDeadlines"
              :key="deadline.name"
              class="rounded-lg border border-solid border-[rgba(var(--v-theme-outline-variant),0.7)] p-4"
            >
              <div class="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div class="font-semibold">{{ deadline.name }}</div>
                  <div class="mt-1 text-sm text-medium-emphasis">{{ deadline.team }}</div>
                </div>
                <StatusChip :label="deadline.status" />
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-medium-emphasis">Due date</span>
                <span class="font-semibold">{{ deadline.dueDate }}</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import MetricCard from '@/components/MetricCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { dashboardApi } from '@/services/dashboardApi'
import { dashboardMock } from '@/mocks/dashboardMock'
import type {
  ComplianceStatus,
  DashboardActivity,
  DashboardKpi,
  ReportingDeadline,
  SystemHealthItem,
} from '@/types/dashboard'

const loading = ref(false)
const loadError = ref('')
const kpis = ref<DashboardKpi[]>(dashboardMock.kpis)
const complianceStatuses = ref<ComplianceStatus[]>(dashboardMock.complianceStatuses)
const recentActivity = ref<DashboardActivity[]>(dashboardMock.recentActivity)
const reportingDeadlines = ref<ReportingDeadline[]>(dashboardMock.reportingDeadlines)
const systemHealth = ref<SystemHealthItem[]>(dashboardMock.systemHealth)
const lastSuccessfulSync = ref(dashboardMock.lastSuccessfulSync)
const failedRecords = ref(dashboardMock.failedRecords)

const activityHeaders = [
  { title: 'Time', key: 'time' },
  { title: 'Organisation Area', key: 'area' },
  { title: 'Event', key: 'event' },
  { title: 'Severity', key: 'severity' },
  { title: 'Status', key: 'status' },
  { title: 'Action', key: 'action', align: 'end' },
] as const

async function loadDashboard () {
  loading.value = true
  const result = await dashboardApi.getDashboard()

  kpis.value = result.data.kpis
  complianceStatuses.value = result.data.complianceStatuses
  recentActivity.value = result.data.recentActivity
  reportingDeadlines.value = result.data.reportingDeadlines
  systemHealth.value = result.data.systemHealth
  lastSuccessfulSync.value = result.data.lastSuccessfulSync
  failedRecords.value = result.data.failedRecords
  loadError.value = result.fromMock ? (result.error ?? 'Unable to reach backend.') : ''
  loading.value = false
}

onMounted(loadDashboard)
</script>
