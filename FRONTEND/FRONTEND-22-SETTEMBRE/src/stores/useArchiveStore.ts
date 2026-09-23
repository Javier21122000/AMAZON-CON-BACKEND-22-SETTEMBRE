import axios from 'axios'
import { create } from 'zustand'
import { errorMessage, favoriteApi, productApi } from '../lib/api'
import type { Favorite, Product } from '../lib/types'
import { useAuthStore } from './useAuthStore'

interface ArchiveState {
  products: Product[]
  favorites: Favorite[]
  loading: boolean
  favoritesLoading: boolean
  error: string | null
  favoritesError: string | null
  pendingFavorites: string[]
  loadProducts: () => Promise<void>
  loadFavorites: () => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  reset: () => void
}
let productsController: AbortController | undefined
let favoritesController: AbortController | undefined
export const useArchiveStore = create<ArchiveState>((set, get) => ({
  products: [], favorites: [], loading: true, favoritesLoading: false,
  error: null, favoritesError: null, pendingFavorites: [],
  reset: () => {
    productsController?.abort()
    favoritesController?.abort()
    set({ products: [], favorites: [], error: null, favoritesError: null, pendingFavorites: [], loading: true, favoritesLoading: false })
  },
  loadProducts: async () => {
    productsController?.abort()
    const controller = new AbortController()
    productsController = controller
    set({ loading: true, error: null })
    try {
      const products = await productApi.list(controller.signal)
      if (!controller.signal.aborted) {
        const admin = useAuthStore.getState().roles.includes('ROLE_ADMIN')
        const visibleProducts = admin
          ? products
          : products.filter(p => p.pubblicato !== false).map(({ id, nome, prezzo, inEvidenza, isSpecialEdition, rating, numeroRecensioni, categoria, variante, immagineUrl, pubblicato }) => ({ id, nome, prezzo, inEvidenza, isSpecialEdition, rating, numeroRecensioni, categoria, variante, immagineUrl, pubblicato }))
        set({ products: visibleProducts, loading: false })
      }
    } catch (error) {
      if (!axios.isCancel(error)) set({ error: errorMessage(error), loading: false })
    }
  },
  loadFavorites: async () => {
    favoritesController?.abort()
    if (!useAuthStore.getState().token) { set({ favorites: [], favoritesLoading: false }); return }
    const controller = new AbortController()
    favoritesController = controller
    set({ favoritesLoading: true, favoritesError: null })
    try {
      const favorites = await favoriteApi.list(controller.signal)
      if (!controller.signal.aborted) set({ favorites, favoritesLoading: false })
    } catch (error) {
      if (!axios.isCancel(error)) set({ favoritesError: errorMessage(error), favoritesLoading: false })
    }
  },
  toggleFavorite: async (id) => {
    const token = useAuthStore.getState().token
    if (!token || get().pendingFavorites.includes(id)) return
    set(state => ({ pendingFavorites: [...state.pendingFavorites, id] }))
    try {
      if (get().favorites.some(f => f.oggetto.id === id)) {
        await favoriteApi.remove(id)
        if (token === useAuthStore.getState().token) set(state => ({ favorites: state.favorites.filter(f => f.oggetto.id !== id) }))
      } else {
        const favorite = await favoriteApi.add(id)
        if (token === useAuthStore.getState().token) set(state => ({ favorites: [...state.favorites.filter(f => f.oggetto.id !== id), favorite] }))
      }
    } finally {
      if (token === useAuthStore.getState().token) set(state => ({ pendingFavorites: state.pendingFavorites.filter(value => value !== id) }))
    }
  },
}))
// Synchronous cleanup prevents private cards or favorites flashing during account changes.
useAuthStore.subscribe((state, previous) => {
  if (state.token !== previous.token || state.roles.join() !== previous.roles.join()) useArchiveStore.getState().reset()
})
