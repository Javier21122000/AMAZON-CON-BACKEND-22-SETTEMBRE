import { useState, type FormEvent } from 'react'
import type { Product, ProductInput } from '../lib/types'
import { errorMessage, productApi } from '../lib/api'
import { useArchiveStore } from '../stores/useArchiveStore'
import { useUiStore } from '../stores/useUiStore'
import { Modal } from './Modal'

export function EditProduct({ product, onClose }: { product: Product; onClose: () => void }) {
  const notify = useUiStore(s => s.notify)
  const [form, setForm] = useState({
    nome: product.nome, prezzo: String(product.prezzo),
    prezzoAcquisto: String(product.prezzoAcquisto ?? 0), fornitore: product.fornitore ?? '',
    inEvidenza: Boolean(product.inEvidenza), isSpecialEdition: Boolean(product.isSpecialEdition),
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const payload: ProductInput = {
        nome: form.nome.trim(), prezzo: Number(form.prezzo),
        prezzoAcquisto: Number(form.prezzoAcquisto), fornitore: form.fornitore.trim(),
        pubblicato: product.pubblicato ?? false, inEvidenza: form.inEvidenza,
        isSpecialEdition: form.isSpecialEdition, immagineUrl: product.immagineUrl,
        rating: product.rating, numeroRecensioni: product.numeroRecensioni,
        categoria: product.categoria, variante: product.variante,
      }
      await productApi.update(product.id, payload)
      await Promise.all([useArchiveStore.getState().loadProducts(), useArchiveStore.getState().loadFavorites()])
      notify('Capo aggiornato correttamente.')
      onClose()
    } catch (err) { setError(errorMessage(err)) } finally { setBusy(false) }
  }

  return <Modal title="Modifica capo" onClose={() => !busy && onClose()}>
    <form className="form-stack" onSubmit={submit}>
      <label>Nome del capo<input name="nome" required maxLength={180} value={form.nome} onChange={event => setForm({ ...form, nome: event.target.value })} /></label>
      {product.variante && <p className="form-note">Variante: {product.variante}</p>}
      <div className="form-row">
        <label>Prezzo di vendita (€)<input name="prezzo" type="number" min="0" max="9999.99" step="0.01" required value={form.prezzo} onChange={event => setForm({ ...form, prezzo: event.target.value })} /></label>
        <label>Prezzo d’acquisto (€)<input name="prezzoAcquisto" type="number" min="0" max="9999.99" step="0.01" required value={form.prezzoAcquisto} onChange={event => setForm({ ...form, prezzoAcquisto: event.target.value })} /></label>
      </div>
      <label>Fornitore<input name="fornitore" required maxLength={180} value={form.fornitore} onChange={event => setForm({ ...form, fornitore: event.target.value })} /></label>
      <div className="publish-row"><div><strong>In evidenza</strong><span>Mostra il badge IN EVIDENZA nel catalogo.</span></div><button type="button" role="switch" aria-checked={form.inEvidenza} aria-label="In evidenza" className={`toggle ${form.inEvidenza ? 'on' : ''}`} onClick={() => setForm({ ...form, inEvidenza: !form.inEvidenza })}><span /></button></div>
      <div className="publish-row"><div><strong>Special Edition</strong><span>Includi il capo nella selezione speciale.</span></div><button type="button" role="switch" aria-checked={form.isSpecialEdition} aria-label="Special Edition" className={`toggle ${form.isSpecialEdition ? 'on' : ''}`} onClick={() => setForm({ ...form, isSpecialEdition: !form.isSpecialEdition })}><span /></button></div>
      {error && <p role="alert" className="error-text">{error}</p>}
      <div className="flex gap-3"><button type="button" className="button button-outline flex-1" disabled={busy} onClick={onClose}>Annulla</button><button className="button button-dark flex-1" disabled={busy}>{busy ? 'Salvataggio…' : 'Salva modifiche'}</button></div>
    </form>
  </Modal>
}
