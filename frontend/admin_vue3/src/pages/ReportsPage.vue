<template>
  <PageHeader
    description="Track statutory reporting obligations, validation readiness, API submission status, and evidence ownership across care facilities."
    eyebrow="Government Reporting"
    title="Reports"
  >
    <template #actions>
      <v-btn
        v-if="auth.canCreateReports"
        color="primary"
        prepend-icon="mdi-plus"
        @click="createDialogOpen = true"
      >
        New Report
      </v-btn>
      <v-btn prepend-icon="mdi-shield-sync-outline" variant="outlined">Sync Obligations</v-btn>
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
      <v-btn size="small" variant="text" @click="loadReports">Retry</v-btn>
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
    <v-col v-for="metric in reportMetrics" :key="metric.label" cols="12" sm="6" lg="3">
      <v-card class="dashboard-card h-full" elevation="0">
        <v-card-text>
          <div class="mb-3 flex items-center justify-between gap-3">
            <div class="text-sm font-medium text-medium-emphasis">{{ metric.label }}</div>
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

  <div class="grid gap-5 xl:grid-cols-5">
    <section v-for="group in reportGroups" :key="group.status" class="min-w-0">
      <div class="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 class="section-title">{{ group.status }}</h2>
          <p class="text-sm text-medium-emphasis">{{ group.description }}</p>
        </div>
        <v-chip :color="group.color" label size="small" variant="tonal">
          {{ group.reports.length }}
        </v-chip>
      </div>

      <div class="grid gap-3">
        <v-card
          v-for="report in group.reports"
          :key="report.id"
          class="dashboard-card"
          elevation="0"
        >
          <v-card-text>
            <div class="mb-4 flex items-start justify-between gap-3">
              <v-avatar :color="group.color" size="38" variant="tonal">
                <v-icon icon="mdi-file-chart-outline" />
              </v-avatar>
              <StatusChip :label="report.validationStatus" />
            </div>

            <h3 class="text-base font-bold leading-snug">{{ report.name }}</h3>
            <div class="mt-2 text-sm text-medium-emphasis">
              {{ report.reportingPeriod }} · {{ report.facility }}
            </div>

            <div class="mt-4 grid gap-3 text-sm">
              <div class="flex items-center justify-between gap-3">
                <span class="text-medium-emphasis">Due date</span>
                <span class="font-semibold">{{ report.dueDate }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-medium-emphasis">Owner</span>
                <span class="font-semibold">{{ report.owner }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-medium-emphasis">Updated</span>
                <span class="font-semibold">{{ report.lastUpdated }}</span>
              </div>
            </div>

            <div class="mt-4">
              <div class="mb-2 flex items-center justify-between text-xs text-medium-emphasis">
                <span>Completion</span>
                <span>{{ report.completion }}%</span>
              </div>
              <v-progress-linear
                :color="progressColor(report)"
                height="8"
                :model-value="report.completion"
                rounded
              />
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="flex-wrap gap-1">
            <v-btn color="primary" size="small" variant="text" @click="selectedReport = report">
              View Details
            </v-btn>
            <v-btn
              v-if="auth.canValidateReports"
              :loading="validatingId === report.id"
              size="small"
              variant="text"
              @click="runValidation(report)"
            >
              Run Validation
            </v-btn>
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-horizontal" size="small" variant="text" />
              </template>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-file-delimited-outline" title="Export CSV" />
                <v-list-item prepend-icon="mdi-send-check-outline" title="Submit Report" />
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </div>
    </section>
  </div>

  <v-dialog v-model="dialogOpen" max-width="920">
    <v-card v-if="selectedReport" class="dashboard-card" elevation="0">
      <v-card-title class="pa-5">
        <div class="flex w-full flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div class="text-xs font-medium uppercase tracking-wide text-medium-emphasis">
              {{ selectedReport.id }} · {{ selectedReport.reportingPeriod }}
            </div>
            <h2 class="mt-1 text-xl font-bold">{{ selectedReport.name }}</h2>
            <div class="mt-1 text-sm text-medium-emphasis">
              {{ selectedReport.facility }} · Assigned to {{ selectedReport.owner }}
            </div>
          </div>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="selectedReport = null" />
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5">
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="dashboard-card h-full" elevation="0">
              <v-card-title class="section-title">API Submission Readiness</v-card-title>
              <v-card-text>
                <div class="mb-4 flex items-center justify-between gap-3">
                  <StatusChip :label="selectedReport.apiReadiness" />
                  <span class="text-sm font-semibold">{{ selectedReport.completion }}%</span>
                </div>
                <v-progress-linear
                  :color="progressColor(selectedReport)"
                  height="10"
                  :model-value="selectedReport.completion"
                  rounded
                />
                <div class="mt-4 grid gap-3 text-sm">
                  <div class="flex justify-between gap-3">
                    <span class="text-medium-emphasis">Due date</span>
                    <strong>{{ selectedReport.dueDate }}</strong>
                  </div>
                  <div class="flex justify-between gap-3">
                    <span class="text-medium-emphasis">Last updated</span>
                    <strong>{{ selectedReport.lastUpdated }}</strong>
                  </div>
                  <div class="flex justify-between gap-3">
                    <span class="text-medium-emphasis">Validation</span>
                    <StatusChip :label="selectedReport.validationStatus" />
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-card class="dashboard-card" elevation="0">
              <v-card-title class="section-title">Validation Checks</v-card-title>
              <v-card-text>
                <div class="grid gap-3 md:grid-cols-2">
                  <div
                    v-for="check in selectedReport.validationChecks"
                    :key="check.name"
                    class="rounded-lg border border-solid border-[rgba(var(--v-theme-outline-variant),0.7)] p-3"
                  >
                    <div class="mb-2 flex items-center justify-between gap-3">
                      <div class="font-semibold">{{ check.name }}</div>
                      <StatusChip :label="check.status" />
                    </div>
                    <div class="text-sm text-medium-emphasis">{{ check.detail }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="dashboard-card" elevation="0">
              <v-card-title class="section-title">Attached Evidence</v-card-title>
              <v-card-text>
                <div v-if="selectedReport.evidenceItems.length" class="grid gap-3 md:grid-cols-2">
                  <div
                    v-for="item in selectedReport.evidenceItems"
                    :key="item.name + item.source"
                    class="rounded-lg border border-solid border-[rgba(var(--v-theme-outline-variant),0.7)] p-3"
                  >
                    <div class="font-semibold">{{ item.name }}</div>
                    <div class="mt-1 text-sm text-medium-emphasis">
                      {{ item.source }} · {{ item.attachedAt }}
                    </div>
                  </div>
                </div>
                <v-alert v-else color="warning" density="compact" icon="mdi-paperclip" variant="tonal">
                  No evidence has been attached to this report yet.
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-card class="dashboard-card h-full" elevation="0">
              <v-card-title class="section-title">Missing Data Warnings</v-card-title>
              <v-card-text>
                <div v-if="selectedReport.warnings.length" class="grid gap-2">
                  <v-alert
                    v-for="warning in selectedReport.warnings"
                    :key="warning"
                    color="warning"
                    density="compact"
                    icon="mdi-alert-outline"
                    variant="tonal"
                  >
                    {{ warning }}
                  </v-alert>
                </div>
                <v-alert v-else color="success" density="compact" icon="mdi-check-circle-outline" variant="tonal">
                  No missing data warnings detected.
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="dashboard-card h-full" elevation="0">
              <v-card-title class="section-title">Recent Audit Events</v-card-title>
              <v-card-text>
                <v-timeline density="compact" side="end">
                  <v-timeline-item
                    v-for="event in selectedReport.auditEvents"
                    :key="event.time + event.title"
                    :dot-color="event.color"
                    size="small"
                  >
                    <div class="font-semibold">{{ event.title }}</div>
                    <div class="text-sm text-medium-emphasis">{{ event.time }} · {{ event.actor }}</div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-5">
        <v-btn prepend-icon="mdi-file-delimited-outline" variant="outlined">Export CSV</v-btn>
        <v-btn
          v-if="auth.canValidateReports"
          :loading="validatingId === selectedReport.id"
          prepend-icon="mdi-shield-sync-outline"
          variant="outlined"
          @click="runValidation(selectedReport)"
        >
          Run Validation
        </v-btn>
        <v-spacer />
        <v-btn color="primary" prepend-icon="mdi-send-check-outline">Submit Report</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="createDialogOpen" max-width="760">
    <v-card class="dashboard-card" elevation="0">
      <v-card-title class="pa-5">
        <div>
          <div class="text-xs font-medium uppercase tracking-wide text-medium-emphasis">
            Create report
          </div>
          <h2 class="mt-1 text-xl font-bold">Draft compliance report</h2>
        </div>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-5">
        <v-alert
          v-if="createError"
          class="mb-4"
          color="error"
          density="compact"
          variant="tonal"
        >
          {{ createError }}
        </v-alert>

        <v-form class="grid gap-3" @submit.prevent="createReport">
          <v-text-field v-model="createForm.name" label="Report name" variant="outlined" />
          <div class="grid gap-3 md:grid-cols-2">
            <v-text-field v-model="createForm.reportingPeriod" label="Reporting period" variant="outlined" />
            <v-text-field v-model="createForm.facility" label="Facility" variant="outlined" />
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <v-text-field v-model="createForm.dueDate" label="Due date" type="date" variant="outlined" />
            <v-text-field v-model="createForm.owner" label="Owner" variant="outlined" />
          </div>
          <v-textarea
            v-model="createForm.evidenceText"
            auto-grow
            hint="One item per line, e.g. Medication variance export | MediTrack"
            label="Attached evidence"
            persistent-hint
            rows="4"
            variant="outlined"
          />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-5">
        <v-btn variant="text" @click="createDialogOpen = false">Cancel</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="creatingReport"
          prepend-icon="mdi-file-plus-outline"
          @click="createReport"
        >
          Create Draft
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { reportsMock } from '@/mocks/reportsMock'
import { reportApi } from '@/services/reportsApi'
import { useAuthStore } from '@/stores/auth'
import type { ComplianceReport, ReportStatus } from '@/types/report'

const auth = useAuthStore()
const loading = ref(false)
const loadError = ref('')
const validatingId = ref('')
const selectedReport = ref<ComplianceReport | null>(null)
const reports = ref<ComplianceReport[]>(reportsMock.reports)
const createDialogOpen = ref(false)
const creatingReport = ref(false)
const createError = ref('')
const createForm = ref({
  name: 'Restrictive Practice Evidence Review',
  reportingPeriod: 'May 2026',
  facility: 'Harbourview Aged Care',
  dueDate: '2026-05-15',
  owner: 'CareHub Admin',
  evidenceText: 'Restrictive practice approval | Clinical Governance\nBehaviour support review | Care Plan UI',
})

const statuses: Array<{
  status: ReportStatus
  description: string
  color: string
}> = [
  { status: 'Draft', description: 'Being assembled', color: 'info' },
  { status: 'Ready for Review', description: 'Awaiting approval', color: 'warning' },
  { status: 'Submitted', description: 'Accepted or lodged', color: 'success' },
  { status: 'Failed Validation', description: 'Blocking issues', color: 'error' },
  { status: 'Overdue', description: 'Needs escalation', color: 'error' },
]

const dialogOpen = computed({
  get: () => selectedReport.value !== null,
  set: value => {
    if (!value) selectedReport.value = null
  },
})

const reportGroups = computed(() =>
  statuses.map(group => ({
    ...group,
    reports: reports.value.filter(report => report.status === group.status),
  })),
)

const reportMetrics = computed(() => [
  {
    label: 'Open obligations',
    value: reports.value.filter(report => report.status !== 'Submitted').length,
    detail: 'Across active reporting periods',
    color: 'primary',
    icon: 'mdi-file-document-multiple-outline',
  },
  {
    label: 'Ready for review',
    value: reports.value.filter(report => report.status === 'Ready for Review').length,
    detail: 'Validation complete or near complete',
    color: 'warning',
    icon: 'mdi-account-check-outline',
  },
  {
    label: 'Failed validation',
    value: reports.value.filter(report => report.status === 'Failed Validation').length,
    detail: 'Blocking API submission',
    color: 'error',
    icon: 'mdi-alert-circle-outline',
  },
  {
    label: 'Submitted',
    value: reports.value.filter(report => report.status === 'Submitted').length,
    detail: 'Receipt stored in audit trail',
    color: 'success',
    icon: 'mdi-send-check-outline',
  },
])

function progressColor (report: ComplianceReport) {
  if (report.status === 'Failed Validation' || report.status === 'Overdue') return 'error'
  if (report.completion < 80) return 'warning'

  return 'success'
}

async function loadReports () {
  loading.value = true
  const result = await reportApi.getReports()

  reports.value = result.data.reports
  loadError.value = result.fromMock ? (result.error ?? 'Unable to reach backend.') : ''
  loading.value = false
}

async function runValidation (report: ComplianceReport) {
  validatingId.value = report.id

  try {
    const result = await reportApi.validateReport(report.id)
    reports.value = reports.value.map(item => item.id === report.id ? result.report : item)
    selectedReport.value = selectedReport.value?.id === report.id ? result.report : selectedReport.value
    loadError.value = ''
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Unable to validate report.'
  } finally {
    validatingId.value = ''
  }
}

function parseEvidenceItems () {
  return createForm.value.evidenceText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [name, source] = line.split('|').map(part => part.trim())

      return {
        name,
        source: source || 'Manual upload',
      }
    })
    .filter(item => item.name)
}

async function createReport () {
  creatingReport.value = true
  createError.value = ''

  try {
    const result = await reportApi.createReport({
      name: createForm.value.name,
      reportingPeriod: createForm.value.reportingPeriod,
      facility: createForm.value.facility,
      dueDate: createForm.value.dueDate,
      owner: createForm.value.owner,
      evidenceItems: parseEvidenceItems(),
    })

    reports.value = [result.report, ...reports.value]
    selectedReport.value = result.report
    createDialogOpen.value = false
  } catch (error) {
    createError.value = error instanceof Error ? error.message : 'Unable to create report.'
  } finally {
    creatingReport.value = false
  }
}

onMounted(loadReports)
</script>
