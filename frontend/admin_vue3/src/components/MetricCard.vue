<template>
  <v-card class="dashboard-card h-full" elevation="0">
    <v-card-text>
      <div class="mb-4 flex items-center justify-between gap-3">
        <span class="text-sm font-medium text-medium-emphasis">{{ label }}</span>
        <v-avatar :color="color" size="34" variant="tonal">
          <v-icon :icon="icon" size="18" />
        </v-avatar>
      </div>
      <div class="metric-value">
        {{ value }}
      </div>
      <div class="mt-3 flex items-center justify-between gap-3">
        <div class="text-sm text-medium-emphasis">
          {{ change }}
        </div>
        <v-chip
          v-if="trend"
          :color="trendColor"
          label
          size="x-small"
          variant="tonal"
        >
          <v-icon :icon="trendIcon" size="14" start />
          {{ trend }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: string | number
  change: string
  color: string
  icon: string
  trend?: string
  trendDirection?: 'up' | 'down' | 'flat'
}>()

const trendIcon = computed(() => {
  if (props.trendDirection === 'down') return 'mdi-trending-down'
  if (props.trendDirection === 'flat') return 'mdi-trending-neutral'

  return 'mdi-trending-up'
})

const trendColor = computed(() => {
  if (props.trendDirection === 'down') return 'success'
  if (props.trendDirection === 'flat') return 'info'

  return props.color
})
</script>
