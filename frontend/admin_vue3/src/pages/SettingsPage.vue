<template>
  <PageHeader
    description="Prototype controls for facility context, notifications, and compliance thresholds."
    title="Settings"
  />

  <v-row>
    <v-col cols="12" lg="5">
      <v-card class="dashboard-card" elevation="0">
        <v-card-title class="section-title">Workspace</v-card-title>
        <v-card-text class="grid gap-4">
          <v-text-field v-model="facility" label="Facility name" variant="outlined" />
          <v-select
            v-model="standard"
            :items="standards"
            label="Primary framework"
            variant="outlined"
          />
          <v-btn color="primary" prepend-icon="mdi-content-save-outline">Save Changes</v-btn>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" lg="7">
      <v-card class="dashboard-card" elevation="0">
        <v-card-title class="section-title">Alert Rules</v-card-title>
        <v-card-text>
          <div v-for="rule in rules" :key="rule.label" class="flex items-center justify-between gap-4 border-b py-4 first:pt-0 last:border-b-0 last:pb-0">
            <div>
              <div class="font-semibold">{{ rule.label }}</div>
              <div class="text-sm text-medium-emphasis">{{ rule.description }}</div>
            </div>
            <v-switch v-model="rule.enabled" color="primary" hide-details />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'

const facility = ref('Harbourview Aged Care')
const standard = ref('Aged Care Quality Standards')
const standards = ['Aged Care Quality Standards', 'Clinical Governance Standard', 'Medication Safety Standard']

const rules = reactive([
  {
    label: 'Critical risk escalation',
    description: 'Notify compliance leads when resident risk reaches critical.',
    enabled: true,
  },
  {
    label: 'Evidence pack drift',
    description: 'Warn when report readiness drops below 80%.',
    enabled: true,
  },
  {
    label: 'API freshness',
    description: 'Flag source systems that have not synced in 60 minutes.',
    enabled: false,
  },
])
</script>
