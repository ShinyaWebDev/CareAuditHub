<template>
  <PageHeader
    description="Search, filter, and audit resident compliance evidence across care facilities without exposing real patient data."
    eyebrow="Resident Compliance Registry"
    title="Residents"
  >
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-file-document-plus-outline">Create Review</v-btn>
      <v-btn prepend-icon="mdi-download-outline" variant="outlined">Export</v-btn>
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
      <v-btn size="small" variant="text" @click="loadResidents">Retry</v-btn>
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
    <v-col v-for="metric in residentMetrics" :key="metric.label" cols="12" sm="6" lg="3">
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

  <v-card class="dashboard-card" elevation="0">
    <v-card-text class="pb-2">
      <v-row align="center">
        <v-col cols="12" lg="4" md="6">
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            hide-details
            label="Search ID, name, facility, document"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" lg="3" md="6">
          <v-select
            v-model="facility"
            :items="facilityOptions"
            density="comfortable"
            hide-details
            label="Facility"
            prepend-inner-icon="mdi-domain"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" lg="2" md="6">
          <v-select
            v-model="riskLevel"
            :items="riskOptions"
            density="comfortable"
            hide-details
            label="Risk level"
            prepend-inner-icon="mdi-alert-outline"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" lg="3" md="6">
          <v-select
            v-model="complianceStatus"
            :items="statusOptions"
            density="comfortable"
            hide-details
            label="Compliance status"
            prepend-inner-icon="mdi-shield-search"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <div class="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="text-sm text-medium-emphasis">
          Showing <strong>{{ filteredResidents.length }}</strong> residents with regulated-care evidence tracking.
        </div>
        <div class="flex flex-wrap gap-2">
          <v-chip color="primary" label size="small" variant="tonal">
            Sortable columns
          </v-chip>
          <v-chip color="info" label size="small" variant="tonal">
            Audit-ready mock data
          </v-chip>
        </div>
      </div>
    </v-card-text>

    <v-data-table
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      class="residents-table"
      :headers="headers"
      :items="filteredResidents"
      :items-per-page-options="[5, 10, 15]"
      density="comfortable"
      hover
      item-value="residentId"
      @click:row="openResident"
    >
      <template #[`item.name`]="{ item }">
        <div>
          <div class="font-semibold">{{ item.name }}</div>
          <div class="text-xs text-medium-emphasis">{{ item.residentId }}</div>
        </div>
      </template>

      <template #[`item.complianceStatus`]="{ item }">
        <StatusChip :label="item.complianceStatus" />
      </template>

      <template #[`item.riskLevel`]="{ item }">
        <StatusChip :label="item.riskLevel" />
      </template>

      <template #[`item.missingDocuments`]="{ item }">
        <v-chip
          :color="item.missingDocuments.length ? 'error' : 'success'"
          label
          size="small"
          variant="tonal"
        >
          {{ item.missingDocuments.length }}
        </v-chip>
      </template>

      <template #[`item.action`]="{ item }">
        <v-btn
          color="primary"
          size="small"
          variant="text"
          @click.stop="selectedResident = item"
        >
          Review
        </v-btn>
      </template>
    </v-data-table>
  </v-card>

  <v-navigation-drawer
    v-model="drawerOpen"
    location="right"
    temporary
    width="560"
  >
    <template v-if="selectedResident">
      <div class="flex h-full flex-col">
        <div class="border-b px-5 py-4">
          <div class="mb-3 flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-medium uppercase tracking-wide text-medium-emphasis">
                {{ selectedResident.residentId }}
              </div>
              <h2 class="mt-1 text-xl font-bold">{{ selectedResident.name }}</h2>
              <div class="mt-1 text-sm text-medium-emphasis">
                {{ selectedResident.facility }} · {{ selectedResident.careLevel }}
              </div>
            </div>
            <v-btn icon="mdi-close" variant="text" @click="selectedResident = null" />
          </div>
          <div class="flex flex-wrap gap-2">
            <StatusChip :label="selectedResident.complianceStatus" />
            <StatusChip :label="selectedResident.riskLevel" />
            <v-chip label size="small" variant="tonal">
              Updated {{ selectedResident.lastUpdated }}
            </v-chip>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-5 py-5">
          <section class="mb-6">
            <h3 class="section-title mb-3">Basic Profile</h3>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="field in profileFields" :key="field.label" class="rounded-lg bg-surface p-3">
                <div class="text-xs uppercase tracking-wide text-medium-emphasis">{{ field.label }}</div>
                <div class="mt-1 font-semibold">{{ field.value }}</div>
              </div>
            </div>
          </section>

          <section class="mb-6">
            <h3 class="section-title mb-3">Care Documentation Checklist</h3>
            <div class="grid gap-2">
              <div
                v-for="document in selectedResident.documentation"
                :key="document.name"
                class="flex items-center justify-between gap-4 rounded-lg border border-solid border-[rgba(var(--v-theme-outline-variant),0.7)] p-3"
              >
                <div class="flex items-center gap-3">
                  <v-icon
                    :color="document.complete ? 'success' : 'error'"
                    :icon="document.complete ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"
                  />
                  <div>
                    <div class="font-medium">{{ document.name }}</div>
                    <div class="text-xs text-medium-emphasis">{{ document.owner }}</div>
                  </div>
                </div>
                <StatusChip :label="document.complete ? 'Verified' : 'Action required'" />
              </div>
            </div>
          </section>

          <section class="mb-6">
            <h3 class="section-title mb-3">Recent Compliance Events</h3>
            <v-timeline density="compact" side="end">
              <v-timeline-item
                v-for="event in selectedResident.events"
                :key="event.time + event.title"
                :dot-color="event.color"
                size="small"
              >
                <div class="font-semibold">{{ event.title }}</div>
                <div class="text-sm text-medium-emphasis">{{ event.time }} · {{ event.detail }}</div>
              </v-timeline-item>
            </v-timeline>
          </section>

          <section class="mb-6">
            <h3 class="section-title mb-3">Notes</h3>
            <v-card class="dashboard-card" elevation="0">
              <v-card-text>
                <div class="text-sm leading-6">{{ selectedResident.notes }}</div>
              </v-card-text>
            </v-card>
          </section>

          <section>
            <h3 class="section-title mb-3">Audit Trail Preview</h3>
            <v-list class="dashboard-card pa-0" density="compact">
              <v-list-item
                v-for="audit in selectedResident.auditTrail"
                :key="audit"
                prepend-icon="mdi-history"
                :title="audit"
              />
            </v-list>
          </section>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { residentsMock } from '@/mocks/residentsMock'
import { residentApi } from '@/services/residentsApi'
import type { ResidentRecord } from '@/types/resident'

const search = ref('')
const facility = ref('All')
const riskLevel = ref('All')
const complianceStatus = ref('All')
const page = ref(1)
const itemsPerPage = ref(10)
const selectedResident = ref<ResidentRecord | null>(null)
const loading = ref(false)
const loadError = ref('')
const residents = ref<ResidentRecord[]>(residentsMock.residents)

const drawerOpen = computed({
  get: () => selectedResident.value !== null,
  set: value => {
    if (!value) selectedResident.value = null
  },
})

const facilityOptions = computed(() => [
  'All',
  ...Array.from(new Set(residents.value.map(resident => resident.facility))).sort(),
])

const riskOptions = ['All', 'Critical', 'High', 'Medium', 'Low']
const statusOptions = ['All', 'Compliant', 'Review due', 'Documents missing', 'Pending review']

const headers = [
  { title: 'Resident ID', key: 'residentId' },
  { title: 'Name', key: 'name' },
  { title: 'Facility', key: 'facility' },
  { title: 'Care Level', key: 'careLevel' },
  { title: 'Last Assessment Date', key: 'lastAssessmentDate' },
  { title: 'Compliance Status', key: 'complianceStatus' },
  { title: 'Risk Level', key: 'riskLevel' },
  { title: 'Missing Documents', key: 'missingDocuments', align: 'end' },
  { title: 'Last Updated', key: 'lastUpdated' },
  { title: 'Action', key: 'action', align: 'end', sortable: false },
] as const

const residentMetrics = computed(() => [
  {
    label: 'Residents in view',
    value: filteredResidents.value.length,
    detail: 'Filtered registry count',
    color: 'primary',
    icon: 'mdi-account-group-outline',
  },
  {
    label: 'Missing documents',
    value: filteredResidents.value.reduce((total, resident) => total + resident.missingDocuments.length, 0),
    detail: 'Evidence gaps requiring action',
    color: 'error',
    icon: 'mdi-file-alert-outline',
  },
  {
    label: 'High / critical risk',
    value: filteredResidents.value.filter(resident => ['High', 'Critical'].includes(resident.riskLevel)).length,
    detail: 'Clinical governance watchlist',
    color: 'warning',
    icon: 'mdi-alert-decagram-outline',
  },
  {
    label: 'Compliant records',
    value: filteredResidents.value.filter(resident => resident.complianceStatus === 'Compliant').length,
    detail: 'Ready for evidence export',
    color: 'success',
    icon: 'mdi-shield-check-outline',
  },
])

const filteredResidents = computed(() => {
  const term = search.value.toLowerCase()

  return residents.value.filter(resident => {
    const matchesSearch = [
      resident.residentId,
      resident.name,
      resident.facility,
      resident.careLevel,
      resident.room,
      ...resident.missingDocuments,
    ].some(value =>
      value.toLowerCase().includes(term),
    )
    const matchesFacility = facility.value === 'All' || resident.facility === facility.value
    const matchesRisk = riskLevel.value === 'All' || resident.riskLevel === riskLevel.value
    const matchesStatus = complianceStatus.value === 'All' || resident.complianceStatus === complianceStatus.value

    return matchesSearch && matchesFacility && matchesRisk && matchesStatus
  })
})

const profileFields = computed(() => {
  if (!selectedResident.value) return []

  return [
    { label: 'Facility', value: selectedResident.value.facility },
    { label: 'Room', value: selectedResident.value.room },
    { label: 'Care level', value: selectedResident.value.careLevel },
    { label: 'Last assessment', value: selectedResident.value.lastAssessmentDate },
    { label: 'Primary contact', value: selectedResident.value.primaryContact },
    { label: 'Missing documents', value: selectedResident.value.missingDocuments.length },
  ]
})

function openResident (_event: MouseEvent, row: { item: ResidentRecord }) {
  selectedResident.value = row.item
}

async function loadResidents () {
  loading.value = true
  const result = await residentApi.getResidents()

  residents.value = result.data.residents
  loadError.value = result.fromMock ? (result.error ?? 'Unable to reach backend.') : ''
  loading.value = false
}

onMounted(loadResidents)
</script>
