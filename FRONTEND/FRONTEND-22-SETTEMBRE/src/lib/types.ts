export type Role = 'ROLE_USER' | 'ROLE_ADMIN'
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}
export interface AuthResponse { token: string; user: User }
export interface LoginRequest { email: string; password: string }
export interface RegisterRequest extends LoginRequest { username: string; firstName: string; lastName: string }
export interface Product {
  id: string
  nome: string
  prezzo: number
  prezzoAcquisto?: number
  fornitore?: string
  pubblicato?: boolean
  isSpecialEdition?: boolean
  rating?: number
  numeroRecensioni?: number
  categoria?: ProductCategory
  variante?: string
  inEvidenza?: boolean
  immagineUrl?: string
  createdAt?: string
}
export interface ProductInput {
  nome: string
  prezzo: number
  prezzoAcquisto: number
  fornitore: string
  pubblicato: boolean
  isSpecialEdition?: boolean
  rating?: number
  numeroRecensioni?: number
  categoria?: ProductCategory
  variante?: string
  inEvidenza?: boolean
  immagineUrl?: string
}
export interface Favorite { id: string; oggetto: Product; createdAt: string }
export type ProductCategory = 'Pelle' | 'Denim' | 'Top & Camicie' | 'Trackwear' | 'Outerwear' | 'Pantaloni' | 'Scarpe'
export type Category = 'Tutti' | ProductCategory | '⭐ SPECIAL EDITIONS'
