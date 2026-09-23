import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Check, LockKeyhole, Plus, ShieldCheck, Users } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { adminApi, errorMessage, productApi } from '../lib/api'
import { vintageTemplates } from '../data/editorial'
import type { ProductInput, User } from '../lib/types'
import { normalizeRoles, useAuthStore } from '../stores/useAuthStore'
import { useArchiveStore } from '../stores/useArchiveStore'
import { useUiStore } from '../stores/useUiStore'
import { Modal } from './Modal'

const blank: ProductInput = { nome: '', prezzo: 0, prezzoAcquisto: 0, fornitore: '', pubblicato: false, inEvidenza: false }
export function AdminPanel() {
  const { roles, user } = useAuthStore()
  const products = useArchiveStore(s => s.products)
  const [creating, setCreating] = useState(false)
  const [template, setTemplate] = useState<ProductInput>(blank)
  const [userId, setUserId] = useState('')
  const [pendingRole, setPendingRole] = useState<'grant' | 'revoke' | null>(null)
  const [roleBusy, setRoleBusy] = useState(false)
  const [roleError, setRoleError] = useState('')
  const [updatedUser, setUpdatedUser] = useState<User | null>(null)
  const notify = useUiStore(s => s.notify)
  if (!roles.includes('ROLE_ADMIN')) return <Navigate to="/" replace />
  async function changeRole() {
    setRoleBusy(true); setRoleError('')
    try {
      const updated = await adminApi.changeRole(userId.trim(), pendingRole === 'grant')
      setUpdatedUser(updated)
      setPendingRole(null)
      notify(`Ruoli aggiornati per ${updated.firstName}.`)
    } catch (error) { setRoleError(errorMessage(error)) } finally { setRoleBusy(false) }
  }
  function validateRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setRoleError('')
    if (userId.trim() === user?.id) { setRoleError('Questo pannello gestisce gli altri utenti. Non puoi modificare il tuo stesso ruolo.'); return }
    setPendingRole('grant')
  }
  const validId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId.trim())
  return <section className="page-section"><div className="section-heading"><div><span className="eyebrow">LIVELLO 03 / STUDIO AMMINISTRATORE</span><h1>DIETRO LE QUINTE.</h1></div><ShieldCheck size={38} strokeWidth={1} /></div>
    <div className="admin-summary"><div><span>Capi nell’archivio</span><strong>{products.length.toString().padStart(2, '0')}</strong></div><div><span>Pubblicati</span><strong>{products.filter(p => p.pubblicato).length.toString().padStart(2, '0')}</strong></div><div><span>In bozza</span><strong>{products.filter(p => p.pubblicato === false).length.toString().padStart(2, '0')}</strong></div><button className="button button-dark" onClick={() => { setTemplate(blank); setCreating(true) }}><Plus size={18} />Nuovo Capo Vintage</button></div>
    <div className="admin-columns"><div className="admin-box"><span className="eyebrow">01 / CATALOGO</span><h2>Un nuovo pezzo di storia.</h2><p className="muted">Parti da un capo vuoto o usa una delle schede suggerite. Verifica prezzi e provenienza prima di pubblicare.</p><div className="template-list">{vintageTemplates.map(item => <button key={item.nome} onClick={() => { setTemplate({ ...item, pubblicato: false }); setCreating(true) }}><span>{item.nome}</span><Plus size={17} /></button>)}</div><p className="form-note">Le bozze sono visibili soltanto agli amministratori. Puoi eliminare i capi direttamente dall’archivio.</p></div>
      <div className="admin-box"><span className="eyebrow">02 / AUTORIZZAZIONI</span><h2>Gestione Ruoli Utenti</h2><p className="muted">Promuovi o revoca il ruolo amministratore indicando l’ID dell’account.</p><form className="form-stack mt-6" onSubmit={validateRole}><label>ID utente (UUID)<input name="userId" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" required value={userId} onChange={e => { setUserId(e.target.value); setUpdatedUser(null); setRoleError('') }} pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" /></label><div className="flex gap-3 flex-wrap"><button className="button button-dark" disabled={!validId || userId.trim() === user?.id}><Users size={16} />Promuovi ADMIN</button><button className="button button-outline" type="button" disabled={!validId || userId.trim() === user?.id} onClick={() => setPendingRole('revoke')}>Revoca ADMIN</button></div></form>
      {roleError && <p role="alert" className="error-text mt-4">{roleError}</p>}{updatedUser && <div role="status" className="role-result"><Check size={18} /><div><strong>{updatedUser.firstName} {updatedUser.lastName}</strong><span>{updatedUser.email}</span><code>{normalizeRoles(updatedUser.roles).join(' · ') || 'Nessun ruolo'}</code></div></div>}
      <p className="form-note mt-6"><LockKeyhole size={14} /> L’ID dell’account si trova nel pannello Accessi. Il backend espone le operazioni sui ruoli tramite UUID, senza un elenco utenti.</p></div>
    </div>
    {creating && <CreateProduct initial={template} onClose={() => setCreating(false)} />}
    {pendingRole && <Modal title={pendingRole === 'grant' ? 'Concedere l’accesso admin?' : 'Revocare l’accesso admin?'} onClose={() => !roleBusy && setPendingRole(null)}><p className="muted mb-4">{pendingRole === 'grant' ? 'L’utente potrà vedere dati riservati, modificare il catalogo e gestire i ruoli.' : 'L’utente perderà l’accesso ai dati riservati e alle operazioni amministrative.'}</p><code className="block break-all mb-6">{userId.trim()}</code>{roleError && <p role="alert" className="error-text mb-4">{roleError}</p>}<div className="flex gap-3"><button className="button button-outline flex-1" disabled={roleBusy} onClick={() => setPendingRole(null)}>Annulla</button><button className="button button-dark flex-1" disabled={roleBusy} onClick={changeRole}>{roleBusy ? 'Aggiornamento…' : 'Conferma'}</button></div></Modal>}
  </section>
}
function CreateProduct({ initial, onClose }: { initial: ProductInput; onClose: () => void }) {
  const [published, setPublished] = useState(initial.pubblicato)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setBusy(true); setError('')
    try {
      await productApi.create({ nome: String(data.get('nome')).trim(), prezzo: Number(data.get('prezzo')), prezzoAcquisto: Number(data.get('prezzoAcquisto')), fornitore: String(data.get('fornitore')).trim(), pubblicato: published, inEvidenza: initial.inEvidenza ?? false })
      await useArchiveStore.getState().loadProducts()
      useUiStore.getState().notify(published ? 'Capo pubblicato nell’archivio.' : 'Capo salvato in bozza.')
      onClose()
    } catch (err) { setError(errorMessage(err)) } finally { setBusy(false) }
  }
  return <Modal title="Nuovo Capo Vintage" onClose={() => !busy && onClose()}><form className="form-stack" onSubmit={submit}><label>Nome del capo<input name="nome" required maxLength={180} defaultValue={initial.nome} placeholder="Biker Leather Jacket '03" /></label><div className="form-row"><label>Prezzo di vendita (€)<input name="prezzo" type="number" min="0" max="9999.99" step="0.01" required defaultValue={initial.prezzo || ''} /></label><label>Prezzo d’acquisto (€)<input name="prezzoAcquisto" type="number" min="0" max="9999.99" step="0.01" required defaultValue={initial.prezzoAcquisto || ''} /></label></div><label>Fornitore<input name="fornitore" required maxLength={180} defaultValue={initial.fornitore} placeholder="Nome dell’archivio o del fornitore" /></label><div className="publish-row"><div><strong>{published ? 'Pubblica nella vetrina' : 'Salva come bozza'}</strong><span>{published ? 'Visibile a tutti i visitatori.' : 'Visibile soltanto agli amministratori.'}</span></div><button type="button" role="switch" aria-checked={published} aria-label="Pubblicato" className={`toggle ${published ? 'on' : ''}`} onClick={() => setPublished(!published)}><span /></button></div>{error && <p role="alert" className="error-text">{error}</p>}<button className="button button-dark w-full" disabled={busy}>{busy ? 'Salvataggio…' : published ? 'Pubblica capo' : 'Salva bozza'}<ArrowUpRight size={18} /></button></form></Modal>
}
