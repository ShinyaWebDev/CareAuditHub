<template>
  <v-navigation-drawer
    v-model="drawer"
    :temporary="display.mdAndDown.value"
    class="border-e"
    width="288"
  >
    <div class="flex h-full flex-col">
      <div class="px-4 py-5">
        <div class="flex items-center gap-3">
          <v-avatar color="primary" rounded="lg" size="42">
            <v-icon icon="mdi-shield-check" />
          </v-avatar>
          <div>
            <div class="text-base font-bold leading-tight">
              Care Compliance
            </div>
            <div class="text-xs text-medium-emphasis">
              Intelligence Dashboard
            </div>
          </div>
        </div>
      </div>

      <v-divider />

      <v-list class="px-3 py-4" nav>
        <v-list-item
          v-for="item in navigation"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          rounded="lg"
        />
      </v-list>

      <v-spacer />

      <div class="pa-4">
        <v-card class="dashboard-card" elevation="0">
          <v-card-text>
            <div class="text-sm font-semibold">
              Accreditation Window
            </div>
            <div class="mt-1 text-xs text-medium-emphasis">
              Evidence pack readiness is tracking ahead of plan.
            </div>
            <v-progress-linear
              class="mt-4"
              color="success"
              height="8"
              model-value="86"
              rounded
            />
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-navigation-drawer>

  <v-app-bar class="border-b" elevation="0">
    <v-app-bar-nav-icon @click="app.toggleDrawer" />
    <v-toolbar-title class="text-base font-semibold md:text-lg">
      {{ pageTitle }}
    </v-toolbar-title>
    <v-spacer />

    <v-chip
      class="mr-2 hidden md:inline-flex"
      color="info"
      label
      size="small"
      variant="tonal"
    >
      Connected to: {{ backendModeLabel }}
    </v-chip>
    <v-chip
      class="mr-2 hidden md:inline-flex"
      color="primary"
      label
      size="small"
      variant="tonal"
    >
      {{ auth.user?.role }}
    </v-chip>
    <v-btn class="mr-1" icon="mdi-bell-outline" variant="text" />
    <v-menu>
      <template #activator="{ props }">
        <v-btn v-bind="props" class="mr-2" variant="text">
          <v-avatar color="primary" size="32">
            <span class="text-xs font-bold">{{ userInitials }}</span>
          </v-avatar>
          <span class="ml-2 hidden text-sm font-medium md:inline">{{ auth.user?.name }}</span>
          <v-icon class="ml-1 hidden md:inline-flex" icon="mdi-chevron-down" size="18" />
        </v-btn>
      </template>
      <v-list density="compact" min-width="220">
        <v-list-item :subtitle="auth.user?.role" :title="auth.user?.name" />
        <v-divider />
        <v-list-item prepend-icon="mdi-cog-outline" title="Settings" to="/settings" />
        <v-list-item prepend-icon="mdi-logout" title="Sign out" @click="logout" />
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-main>
    <div class="min-h-screen bg-background px-4 py-5 md:px-6 lg:px-8">
      <router-view />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { backendModeLabel } from '@/config/api'

const app = useAppStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const display = useDisplay()

const navigation = [
  { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard-outline' },
  { title: 'Residents', to: '/residents', icon: 'mdi-account-heart-outline' },
  { title: 'Reports', to: '/reports', icon: 'mdi-file-chart-outline' },
  { title: 'Audit Log', to: '/audit-log', icon: 'mdi-history' },
  { title: 'API Sync', to: '/api-sync', icon: 'mdi-cloud-sync-outline' },
  { title: 'Settings', to: '/settings', icon: 'mdi-cog-outline' },
]

const drawer = computed({
  get: () => app.drawer,
  set: value => app.setDrawer(value),
})

const pageTitle = computed(() => {
  const match = navigation.find(item => item.to === route.path)
  return match?.title ?? 'Dashboard'
})

const userInitials = computed(() =>
  auth.user?.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'U',
)

function logout () {
  auth.logout()
  router.push('/login')
}

watch(
  () => display.mdAndDown.value,
  value => {
    app.setDrawer(!value)
  },
  { immediate: true },
)
</script>
