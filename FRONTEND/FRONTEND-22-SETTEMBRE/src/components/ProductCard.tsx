import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Heart, LoaderCircle, LockKeyhole, PencilLine, Trash2 } from 'lucide-react'
import type { Product } from '../lib/types'
import { euro } from '../data/editorial'
import { useAuthStore } from '../stores/useAuthStore'
import { useArchiveStore } from '../stores/useArchiveStore'
import { useUiStore } from '../stores/useUiStore'
import { errorMessage, productApi } from '../lib/api'
import { Modal } from './Modal'
import { EditProduct } from './EditProduct'
import { ProductReviews } from './ProductReviews'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { token, roles } = useAuthStore()
  const admin = roles.includes('ROLE_ADMIN')
  const saved = useArchiveStore(s => s.favorites.some(f => f.oggetto.id === product.id))
  const pending = useArchiveStore(s => s.pendingFavorites.includes(product.id))
  const favoritesLoading = useArchiveStore(s => s.favoritesLoading)
  const [details, setDetails] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const notify = useUiStore(s => s.notify)
  const draft = admin && product.pubblicato === false
  const featured = Boolean(product.inEvidenza)
  const imageUrl = product.immagineUrl?.trim() || '/assets/products/unavailable.svg'
  const label = product.variante ? `${product.nome} · ${product.variante}` : product.nome

  async function favorite(event?: { stopPropagation: () => void }) {
    event?.stopPropagation()
    if (!token) { useUiStore.getState().openAuth(); return }
    try { await useArchiveStore.getState().toggleFavorite(product.id) } catch (error) { notify(errorMessage(error), true) }
  }

  async function remove() {
    setDeleting(true)
    try {
      await productApi.remove(product.id)
      setConfirmDelete(false); setDetails(false)
      notify('Capo eliminato dall’archivio.')
      await Promise.all([useArchiveStore.getState().loadProducts(), useArchiveStore.getState().loadFavorites()])
    } catch (error) { notify(errorMessage(error), true) } finally { setDeleting(false) }
  }

  const adminInfo = admin && product.prezzoAcquisto !== undefined && <div className="private-data"><span className="eyebrow"><LockKeyhole size={12} /> DATI RISERVATI</span><dl><div><dt>Acquisto</dt><dd>{euro(product.prezzoAcquisto)}</dd></div><div><dt>Margine lordo</dt><dd>{euro(product.prezzo - product.prezzoAcquisto)}</dd></div><div><dt>Fornitore</dt><dd>{product.fornitore || 'Non disponibile'}</dd></div></dl><div className="admin-actions"><button type="button" className="button button-outline" onClick={(event) => { event.stopPropagation(); setEditing(true) }}><PencilLine size={13} /> Modifica</button><button type="button" className="delete-button" onClick={(event) => { event.stopPropagation(); setConfirmDelete(true) }}><Trash2 size={13} /> Elimina Capo</button></div></div>

  return <>
    <motion.article className="product-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .4, delay: Math.min(index, 7) * .045 }} onClick={() => setDetails(true)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setDetails(true) } }} role="button" tabIndex={0} aria-label={`Apri dettaglio: ${label}`}>
      <div className="product-image aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
        <img src={imageUrl} alt={label} className="product-card-image w-full h-full object-contain p-4 mix-blend-multiply" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/assets/products/unavailable.svg' }} />
        <div className="product-badges">
          {featured && <span className="feature-badge">IN EVIDENZA</span>}
          {product.isSpecialEdition && <span className="special-badge">★ SPECIAL EDITION</span>}
          {draft ? <span className="draft-badge">BOZZA</span> : <span className="product-number">ARCHIVE / {String(index + 1).padStart(2, '0')}</span>}
        </div>
        <motion.button whileTap={{ scale: .85 }} whileHover={{ scale: 1.06 }} onClick={(event) => { void favorite(event) }} disabled={pending || favoritesLoading || draft} className={`heart-button ${saved ? 'saved' : ''}`} aria-label={`${saved ? 'Rimuovi dai' : 'Aggiungi ai'} preferiti: ${label}`} aria-pressed={saved} title={draft ? 'Pubblica il capo per aggiungerlo ai preferiti' : undefined}>{pending ? <LoaderCircle size={17} className="animate-spin" /> : <Heart size={18} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.6} />}</motion.button>
        {admin && <button type="button" className="quick-edit-button" aria-label={`Modifica: ${label}`} onClick={event => { event.stopPropagation(); setEditing(true) }}><PencilLine size={16} /><span>Edit</span></button>}
      </div>
      <div className="product-caption"><span><strong>{product.nome}</strong>{product.variante && <small className="product-variant">{product.variante}</small>}<span>{euro(product.prezzo)}</span><ProductReviews rating={product.rating} numeroRecensioni={product.numeroRecensioni} /></span><span className="product-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span></div>
      {adminInfo}
    </motion.article>
    {details && <Modal title={label} onClose={() => setDetails(false)}><div className="detail-media"><img src={imageUrl} alt={product.nome} className="product-card-image w-full h-full object-contain p-4 mix-blend-multiply" style={{ objectPosition: 'center' }} /></div><div className="flex items-center justify-between my-5"><strong className="text-2xl">{euro(product.prezzo)}</strong>{featured ? <span className="feature-badge">IN EVIDENZA</span> : draft ? <span className="draft-badge">BOZZA</span> : null}</div><div className="mb-5"><ProductReviews rating={product.rating} numeroRecensioni={product.numeroRecensioni} /></div><button className="button button-dark w-full" onClick={(event) => { void favorite(event) }} disabled={pending || draft || favoritesLoading}><Heart size={18} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}</button>{adminInfo}</Modal>}
    {editing && <EditProduct product={product} onClose={() => setEditing(false)} />}
    {confirmDelete && <Modal title="Eliminare questo capo?" onClose={() => !deleting && setConfirmDelete(false)}><p className="muted mb-6">“{product.nome}” verrà rimosso dal catalogo. L’operazione non può essere annullata.</p><div className="flex gap-3"><button className="button button-outline flex-1" disabled={deleting} onClick={() => setConfirmDelete(false)}>Annulla</button><button className="button button-dark flex-1" disabled={deleting} onClick={remove}>{deleting ? 'Eliminazione…' : 'Elimina Capo'}</button></div></Modal>}
  </>
}
