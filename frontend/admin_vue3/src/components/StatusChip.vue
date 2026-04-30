<template>
  <v-chip
    :color="color"
    label
    size="small"
    variant="tonal"
  >
    {{ label }}
  </v-chip>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  label: string
}>()

const color = computed(() => {
  switch (props.label) {
    case 'Critical':
    case 'Flagged':
    case 'Failed':
    case 'Action required':
    case 'Overdue':
    case 'Documents missing':
    case 'Escalated':
    case 'Failed Validation':
    case 'Blocking':
    case 'Security':
      return 'error'
    case 'High':
    case 'Degraded':
    case 'In review':
    case 'Amber':
    case 'Due soon':
    case 'At risk':
    case 'Review due':
    case 'In progress':
    case 'Ready for Review':
    case 'Warning':
    case 'Partial':
    case 'Access':
      return 'warning'
    case 'Medium':
    case 'Updated':
    case 'Draft':
    case 'Queued':
    case 'Pending review':
    case 'System':
      return 'info'
    case 'Low':
    case 'Passed':
    case 'Ready':
    case 'Connected':
    case 'Green':
    case 'Complete':
    case 'On track':
    case 'Compliant':
    case 'Current':
    case 'Verified':
    case 'Submitted':
    case 'Validated':
    case 'Ready to submit':
    case 'Info':
      return 'success'
    case 'Paused':
      return 'secondary'
    default:
      return 'primary'
  }
})
</script>
