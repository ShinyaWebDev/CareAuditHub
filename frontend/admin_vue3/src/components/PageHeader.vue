<template>
  <div class="mb-5 flex flex-col gap-4 md:mb-7 md:flex-row md:items-end md:justify-between">
    <div>
      <p v-if="eyebrow" class="mb-1 text-sm font-medium uppercase tracking-wide text-medium-emphasis">
        {{ eyebrow }}
      </p>
      <h1 class="text-2xl font-bold text-on-surface md:text-3xl">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-2 max-w-3xl text-sm leading-6 text-medium-emphasis md:text-base">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  eyebrow?: string
  description?: string
}>()
</script>
