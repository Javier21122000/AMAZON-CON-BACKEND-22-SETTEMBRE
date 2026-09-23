import type { Category, ProductInput, ProductCategory } from '../lib/types'
export const categories: Category[] = ['Tutti', 'Denim', 'Pelle', 'Top & Camicie', 'Trackwear', 'Outerwear', 'Pantaloni', 'Scarpe', '⭐ SPECIAL EDITIONS']
export const vintageTemplates: ProductInput[] = [
  { nome: "Biker Leather Jacket '03", prezzo: 189, prezzoAcquisto: 65, fornitore: 'Archivio Milano', pubblicato: true },
  { nome: 'Baggy Denim Off-White Y2K', prezzo: 89, prezzoAcquisto: 28, fornitore: 'Studio Vintage Torino', pubblicato: true },
  { nome: 'Velour Tracktop Beckham Edition', prezzo: 125, prezzoAcquisto: 40, fornitore: 'Manchester Archive', pubblicato: true },
  { nome: 'Puffer Jacket Oversized', prezzo: 155, prezzoAcquisto: 52, fornitore: 'Archivio Milano', pubblicato: false },
]
export function categoryOf(name: string): ProductCategory {
  if (/denim|jeans/i.test(name)) return 'Denim'
  if (/leather|biker|pelle|varsity/i.test(name)) return 'Pelle'
  if (/shirt|tee|camici|felpa/i.test(name)) return 'Top & Camicie'
  if (/nike|jordan|adidas|scarpe/i.test(name)) return 'Scarpe'
  if (/pirlo|pantalon/i.test(name)) return 'Pantaloni'
  if (/velour|track|jersey|tuta/i.test(name)) return 'Trackwear'
  return 'Outerwear'
}
export const euro = (value: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value)
