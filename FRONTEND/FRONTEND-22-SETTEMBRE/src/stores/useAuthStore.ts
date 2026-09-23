import { create } from 'zustand'
import type { AuthResponse, Role, User } from '../lib/types'

export function normalizeRoles(roles: string[]): Role[] {
  return roles.flatMap((role) => {
    const normalized = role.startsWith('ROLE_') ? role : `ROLE_${role}`
    return normalized === 'ROLE_ADMIN' || normalized === 'ROLE_USER' ? [normalized] : []
  })
}
interface AuthState {
  user: User | null
  token: string | null
  roles: Role[]
  setSession: (session: AuthResponse) => void
  clearSession: () => void
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  roles: [],
  setSession: ({ user, token }) => set({ user, token, roles: normalizeRoles(user.roles) }),
  clearSession: () => set({ user: null, token: null, roles: [] }),
}))
