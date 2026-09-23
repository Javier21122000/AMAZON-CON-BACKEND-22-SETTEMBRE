import type { AuthMode } from '../stores/useUiStore'

export function testCredentials(mode: AuthMode): { email: string; password: string } {
  const adminEmail = import.meta.env.VITE_TEST_ADMIN_EMAIL || 'javier@archivio00.it'
  const adminPassword = import.meta.env.VITE_TEST_ADMIN_PASSWORD || 'admin123'
  const userEmail = import.meta.env.VITE_TEST_USER_EMAIL || 'utente@archivio00.it'
  const userPassword = import.meta.env.VITE_TEST_USER_PASSWORD || 'password123'

  if (mode === 'admin') return { email: adminEmail, password: adminPassword }
  if (mode === 'user') return { email: userEmail, password: userPassword }

  return { email: userEmail, password: userPassword }
}
