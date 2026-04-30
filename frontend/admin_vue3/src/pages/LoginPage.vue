<template>
  <v-main>
    <div class="grid min-h-screen bg-background lg:grid-cols-[1fr_480px]">
      <section class="hidden bg-surface px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div class="flex items-center gap-3">
          <v-avatar color="primary" rounded="lg" size="46">
            <v-icon icon="mdi-shield-check" />
          </v-avatar>
          <div>
            <div class="text-lg font-bold">Care Compliance</div>
            <div class="text-sm text-medium-emphasis">Regulated care intelligence</div>
          </div>
        </div>

        <div class="max-w-2xl">
          <p class="mb-4 text-sm font-medium uppercase tracking-wide text-primary">Interview prototype</p>
          <h1 class="text-4xl font-bold leading-tight xl:text-5xl">
            Compliance oversight for aged-care teams that need clarity fast.
          </h1>
          <p class="mt-5 max-w-xl text-lg leading-8 text-medium-emphasis">
            Monitor residents, evidence packs, audit events, and system integrations from a focused SaaS-style dashboard.
          </p>
        </div>

        <div class="grid max-w-3xl grid-cols-3 gap-3">
          <v-card v-for="item in highlights" :key="item.label" class="dashboard-card" elevation="0">
            <v-card-text>
              <div class="text-2xl font-bold">{{ item.value }}</div>
              <div class="mt-1 text-sm text-medium-emphasis">{{ item.label }}</div>
            </v-card-text>
          </v-card>
        </div>
      </section>

      <section class="flex items-center justify-center px-4 py-10">
        <v-card class="dashboard-card w-full max-w-md" elevation="0">
          <v-card-text class="pa-6 md:pa-8">
            <div class="mb-8 lg:hidden">
              <div class="flex items-center gap-3">
                <v-avatar color="primary" rounded="lg" size="42">
                  <v-icon icon="mdi-shield-check" />
                </v-avatar>
                <div>
                  <div class="text-base font-bold">Care Compliance</div>
                  <div class="text-xs text-medium-emphasis">Intelligence Dashboard</div>
                </div>
              </div>
            </div>

            <h2 class="text-2xl font-bold">Sign in</h2>
            <p class="mt-2 text-sm text-medium-emphasis">
              Use the demo credentials to enter the prototype.
            </p>

            <v-form class="mt-7" @submit.prevent="submit">
              <v-text-field
                v-model="email"
                autocomplete="email"
                label="Work email"
                prepend-inner-icon="mdi-email-outline"
                type="email"
                variant="outlined"
              />
              <v-text-field
                v-model="password"
                autocomplete="current-password"
                label="Password"
                prepend-inner-icon="mdi-lock-outline"
                type="password"
                variant="outlined"
              />
              <div class="mb-5 flex items-center justify-between">
                <v-checkbox
                  v-model="remember"
                  color="primary"
                  density="compact"
                  hide-details
                  label="Remember me"
                />
                <v-btn color="primary" size="small" variant="text">Reset</v-btn>
              </div>
              <v-btn block color="primary" size="large" type="submit">
                Enter Dashboard
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </section>
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const app = useAppStore()

const email = ref('avery.mckenna@harbourview.example')
const password = ref('compliance-demo')
const remember = ref(true)

const highlights = [
  { label: 'Evidence ready', value: '86%' },
  { label: 'Open actions', value: '28' },
  { label: 'Live sources', value: '4' },
]

function submit () {
  app.login()
  router.push('/dashboard')
}
</script>
