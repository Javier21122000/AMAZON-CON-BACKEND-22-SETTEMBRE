import { useEffect } from 'react'
import { ArrowUpRight, Heart, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useArchiveStore } from '../stores/useArchiveStore'
import { useUiStore } from '../stores/useUiStore'
import { CardGrid, GridSkeleton } from './ProductGrid'

export function FavoritesView() {
  const user = useAuthStore(s => s.user)
  const { favorites, favoritesLoading, favoritesError, loadFavorites } = useArchiveStore()
  useEffect(() => { void loadFavorites() }, [loadFavorites, user?.id])
  return <section className="page-section"><div className="section-heading"><div><span className="eyebrow">YOUR PERSONAL ARCHIVE</span><h1>I TUOI PREFERITI<span className="heading-count">({favorites.length})</span></h1></div><Heart size={38} strokeWidth={1} /></div>
    {!user ? <div className="empty-state"><LockKeyhole size={30} strokeWidth={1.2} /><h3>La tua selezione inizia qui.</h3><p>Accedi per salvare i capi che raccontano il tuo stile.</p><button className="button button-dark" onClick={() => useUiStore.getState().openAuth()}>Accedi al tuo archivio<ArrowUpRight size={18} /></button></div> : <>
      <div className="privacy-note"><LockKeyhole size={16} /><span>La selezione di <strong>{user.firstName}</strong>. Visibile soltanto a questo account.</span><span className="eyebrow">LIVELLO 02 / PERSONALE</span></div>
      {favoritesLoading ? <GridSkeleton /> : favoritesError ? <div role="alert" className="empty-state"><h3>Non riusciamo a caricare i tuoi preferiti.</h3><p>{favoritesError}</p><button className="button button-outline" onClick={loadFavorites}>Riprova</button></div> : favorites.length ? <CardGrid products={favorites.map(f => f.oggetto)} /> : <div className="empty-state"><Heart size={30} strokeWidth={1.2} /><h3>Fai spazio ai tuoi prossimi preferiti.</h3><p>Tocca il cuore su un capo per ritrovarlo qui.</p><Link to="/catalogo" className="button button-dark">Esplora l’archivio<ArrowUpRight size={18} /></Link></div>}
    </>}
  </section>
}
