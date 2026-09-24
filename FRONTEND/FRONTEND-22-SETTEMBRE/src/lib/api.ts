import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'
import type { AuthResponse, Favorite, LoginRequest, Product, ProductInput, RegisterRequest, User } from './types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  // Free hosting can take nearly two minutes to wake Spring Boot.
  timeout: 180000,
  headers: { 'Content-Type': 'application/json' },
})
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token && !config.url?.startsWith('/auth/')) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use((response) => response, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && !error.config?.url?.startsWith('/auth/')) {
    useAuthStore.getState().clearSession()
  }
  return Promise.reject(error)
})
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
      ? 'Il servizio sta impiegando troppo tempo a rispondere. Riprova tra poco.'
      : 'Connessione al servizio non riuscita. Controlla la connessione e riprova tra poco.'
    const status = error.response.status
    if (status === 401) return 'Sessione scaduta o credenziali non valide. Accedi di nuovo.'
    if (status === 403) return 'Accesso non consentito. Verifica le credenziali e il ruolo del tuo account.'
    if (status === 404) return 'Elemento non trovato. Potrebbe essere stato rimosso o non essere pubblicato.'
    if (status === 409) return 'Questo elemento esiste già. Aggiorna la pagina o scegli un nome diverso.'
    const data: unknown = error.response.data
    if (status < 500 && data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') return data.message
    return 'Non è stato possibile completare la richiesta. Riprova tra poco.'
  }
  return error instanceof Error ? error.message : 'Si è verificato un errore inatteso.'
}
export const authApi = {
  login: async (input: LoginRequest) => (await api.post<AuthResponse>('/auth/login', input)).data,
  register: async (input: RegisterRequest) => (await api.post<AuthResponse>('/auth/register', input)).data,
  logout: async () => { await api.post('/auth/logout') },
}
export const productApi = {
  list: async (signal?: AbortSignal) => (await api.get<Product[]>('/oggetti', { signal })).data,
  create: async (input: ProductInput) => (await api.post<Product>('/oggetti', input)).data,
  update: async (id: string, input: ProductInput) => (await api.put<Product>(`/oggetti/${encodeURIComponent(id)}`, input)).data,
  remove: async (id: string) => { await api.delete(`/oggetti/${encodeURIComponent(id)}`) },
}
export const favoriteApi = {
  list: async (signal?: AbortSignal) => (await api.get<Favorite[]>('/preferiti', { signal })).data,
  add: async (id: string) => (await api.post<Favorite>(`/preferiti/${encodeURIComponent(id)}`)).data,
  remove: async (id: string) => { await api.delete(`/preferiti/${encodeURIComponent(id)}`) },
}
export const adminApi = {
  changeRole: async (id: string, grant: boolean) => (await api.request<User>({
    url: `/admin/utenti/${encodeURIComponent(id)}/ruolo-admin`, method: grant ? 'POST' : 'DELETE',
  })).data,
}
