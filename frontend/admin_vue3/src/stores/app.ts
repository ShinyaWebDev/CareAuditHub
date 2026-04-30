// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
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
    setDrawer (value: boolean) {
      this.drawer = value
    },
    toggleDrawer () {
      this.drawer = !this.drawer
    },
  },
})
