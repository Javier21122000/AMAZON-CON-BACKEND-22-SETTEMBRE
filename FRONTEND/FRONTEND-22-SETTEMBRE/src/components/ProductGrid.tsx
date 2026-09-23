import { useMemo, useState } from 'react'
import { ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories, categoryOf } from '../data/editorial'
import { useArchiveStore } from '../stores/useArchiveStore'
import { useAuthStore } from '../stores/useAuthStore'
import type { Category, Product } from '../lib/types'
import { ProductCard } from './ProductCard'

export function ProductGrid({ compact = false, initialCategory = 'Tutti' }: { compact?: boolean; initialCategory?: Category }) {
  const { products, loading, error, loadProducts } = useArchiveStore()
  const admin = useAuthStore(s => s.roles.includes('ROLE_ADMIN'))
  const [category, setCategory] = useState<Category>(initialCategory)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('archive')
  const [filters, setFilters] = useState(false)
  const [draftsOnly, setDraftsOnly] = useState(false)
  const selected = useMemo(() => {
    const result = products.filter(p => (category === 'Tutti' || (category === 'SPECIAL EDITIONS' ? p.isSpecialEdition === true : (p.categoria || categoryOf(p.nome)) === category)) && p.nome.toLocaleLowerCase().includes(search.toLocaleLowerCase()) && (!admin || !draftsOnly || p.pubblicato === false))
    if (sort === 'price-asc') result.sort((a, b) => a.prezzo - b.prezzo)
    if (sort === 'price-desc') result.sort((a, b) => b.prezzo - a.prezzo)
    if (sort === 'archive') result.sort((a, b) => Number(Boolean(b.inEvidenza)) - Number(Boolean(a.inEvidenza)))
    return compact ? result.slice(0, 8) : result
  }, [products, category, search, sort, compact, draftsOnly, admin])
  return <section id="selezione" className={`catalog-section ${compact ? '' : 'full-catalog'}`}>
    <div className="section-heading"><div><span className="eyebrow">{compact ? 'FRESH FROM THE ARCHIVE' : 'THE COMPLETE SELECTION'}</span><h2>{compact ? <>IL PROSSIMO PEZZO<br />DELLA TUA STORIA.</> : <>L’ARCHIVIO<span className="heading-count">({String(products.length).padStart(2, '0')})</span></>}</h2></div><div className="section-aside"><p>Silhouette iconiche. Attitudine intatta.<br />Il meglio dei 2000, selezionato oggi.</p>{compact && <Link to="/catalogo" className="underlined-link">Tutti i capi <ArrowUpRight size={16} /></Link>}</div></div>
    <div className="catalog-toolbar"><div className="category-tabs" aria-label="Categorie">{categories.map(item => <button key={item} className={`${category === item ? 'selected' : ''} ${item === 'SPECIAL EDITIONS' ? 'special-tab' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><button className={`filter-toggle ${filters ? 'selected' : ''}`} onClick={() => setFilters(!filters)} aria-expanded={filters}><SlidersHorizontal size={15} /> Filtra & ordina</button></div>
    {filters && <div className="filters-panel"><label className="search-field"><Search size={17} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Cerca nell’archivio" aria-label="Cerca un capo" />{search && <button aria-label="Cancella ricerca" onClick={() => setSearch('')}><X size={16} /></button>}</label><label className="sort-field">Ordina per<select value={sort} onChange={event => setSort(event.target.value)}><option value="archive">Selezione archivio</option><option value="price-asc">Prezzo crescente</option><option value="price-desc">Prezzo decrescente</option></select></label>{admin && <label className="checkbox-label"><input type="checkbox" checked={draftsOnly} onChange={e => setDraftsOnly(e.target.checked)} />Solo bozze</label>}</div>}
    {loading ? <GridSkeleton /> : error ? <div role="alert" className="empty-state"><h3>L’archivio è momentaneamente offline.</h3><p>{error}</p><button className="button button-dark" onClick={loadProducts}>Riprova</button></div> : selected.length ? <CardGrid products={selected} /> : <div className="empty-state"><span className="eyebrow">{products.length ? 'NESSUN RISULTATO' : 'IN ATTESA DEL PROSSIMO DROP'}</span><h3>{products.length ? 'Nessun capo con questi filtri.' : 'Le storie migliori devono ancora arrivare.'}</h3><p>{products.length ? 'Prova un’altra categoria o modifica la ricerca.' : 'Il catalogo non contiene ancora capi pubblicati. Torna a dare un’occhiata.'}</p>{products.length ? <button className="button button-outline" onClick={() => { setCategory('Tutti'); setSearch(''); setDraftsOnly(false) }}>Azzera filtri</button> : admin && <Link to="/admin" className="button button-dark">Aggiungi il primo capo <ArrowUpRight size={17} /></Link>}</div>}
    <div className="catalog-footnote"><span>2000—2010 / CURATED MENSWEAR</span><span>{loading ? 'CARICAMENTO…' : `${selected.length} CAPI ${admin ? '· BOZZE INCLUSE' : 'NELLA SELEZIONE'}`}</span></div>
  </section>
}
export function CardGrid({ products }: { products: Product[] }) {
  return <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
}
export function GridSkeleton() {
  return <div className="product-grid" role="status" aria-label="Caricamento capi">{[0, 1, 2, 3].map(n => <div key={n} className="product-skeleton rounded-2xl" />)}</div>
}
