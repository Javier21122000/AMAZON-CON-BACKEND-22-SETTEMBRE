import { create } from 'zustand'
export type AuthMode = 'login' | 'register' | 'admin' | 'user'
interface UiState {
  authMode: AuthMode | null
  testDrawer: boolean
  toast: { message: string; error: boolean } | null
  openAuth: (mode?: AuthMode) => void
  closeAuth: () => void
  setTestDrawer: (open: boolean) => void
  notify: (message: string, error?: boolean) => void
  clearToast: () => void
}
export const useUiStore = create<UiState>((set) => ({
  authMode: null, testDrawer: false, toast: null,
  openAuth: (mode = 'login') => set({ authMode: mode, testDrawer: false }),
  closeAuth: () => set({ authMode: null }),
  setTestDrawer: (testDrawer) => set({ testDrawer }),
  notify: (message, error = false) => set({ toast: { message, error } }),
  clearToast: () => set({ toast: null }),
}))
