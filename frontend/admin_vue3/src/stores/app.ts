// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    authenticated: false,
    user: {
      name: 'Avery McKenna',
      role: 'Compliance Lead',
      facility: 'Harbourview Aged Care',
      initials: 'AM',
    },
    selectedFacility: 'Harbourview Aged Care',
    drawer: true,
  }),
  actions: {
    login () {
      this.authenticated = true
    },
    logout () {
      this.authenticated = false
    },
    setDrawer (value: boolean) {
      this.drawer = value
    },
    toggleDrawer () {
      this.drawer = !this.drawer
    },
  },
})
