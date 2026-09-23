import { useState } from 'react'
import { Check, Globe2, Heart, ShieldCheck, LogOut, LoaderCircle, ArrowUpRight } from 'lucide-react'
import { authApi, errorMessage } from '../lib/api'
import { useAuthStore } from '../stores/useAuthStore'
import { useUiStore, type AuthMode } from '../stores/useUiStore'
import { testCredentials } from '../lib/testCredentials'
import { Modal } from './Modal'

export function AccessDrawer() {
  const { user, roles, clearSession } = useAuthStore()
  const { setTestDrawer, openAuth, notify } = useUiStore()
  const [busy, setBusy] = useState<AuthMode | null>(null)
  const admin = roles.includes('ROLE_ADMIN')
  const level = admin ? 3 : user ? 2 : 1
  async function quickLogin(mode: 'admin' | 'user') {
    const credentials = testCredentials(mode)
    if (!credentials.email || !credentials.password) { openAuth(mode); return }
    setBusy(mode)
    try {
      const session = await authApi.login(credentials)
      useAuthStore.getState().setSession(session)
      notify(`Accesso effettuato: ${session.user.firstName}.`)
    } catch (error) { notify(errorMessage(error), true) } finally { setBusy(null) }
  }
  async function logout() {
    clearSession()
    notify('Hai effettuato il logout.')
    try { await authApi.logout() } catch { /* Local credentials have already been removed. */ }
  }
  return <Modal title="Tre livelli. Un archivio." onClose={() => setTestDrawer(false)} drawer>
    <p className="muted mb-8">Prova gli accessi e osserva come cambia la tua esperienza.</p>
    <div className="access-levels">
      {[
        { n: 1, icon: Globe2, title: 'Vetrina pubblica', text: 'Solo capi pubblicati, nome e prezzo. Nessun dato riservato.' },
        { n: 2, icon: Heart, title: 'Il tuo archivio', text: 'Salva i preferiti. Ogni account ritrova soltanto la propria selezione.' },
        { n: 3, icon: ShieldCheck, title: 'Dietro le quinte', text: 'Bozze, costi, fornitori e gestione del catalogo e dei ruoli.' },
      ].map(({ n, icon: Icon, title, text }) => <div key={n} className={`access-level ${level === n ? 'active' : ''}`}><div className="flex items-center justify-between"><span className="eyebrow">LIVELLO 0{n}</span>{level === n ? <Check size={18} /> : <Icon size={18} />}</div><h3>{title}</h3><p>{text}</p></div>)}
    </div>
    <div className="test-actions"><span className="eyebrow">ACCESSO RAPIDO · ACCOUNT REALI</span><button className="button button-dark" disabled={!!busy} onClick={() => quickLogin('admin')}>{busy === 'admin' ? <LoaderCircle size={18} className="animate-spin" /> : <ShieldCheck size={18} />}Accedi come Admin (Javier)<ArrowUpRight size={18} /></button><button className="button button-outline" disabled={!!busy} onClick={() => quickLogin('user')}>{busy === 'user' ? <LoaderCircle size={18} className="animate-spin" /> : <Heart size={18} />}Accedi come Utente Standard</button><button className="text-button" onClick={user ? logout : () => openAuth('register')}>{user ? <><LogOut size={16} />Logout</> : 'Registrati'}</button></div>
    {user && <div className="session-details"><span className="eyebrow">SESSIONE ATTUALE</span><strong>{user.firstName} {user.lastName}</strong><span>{user.email}</span><code>{roles.join(' · ')}</code><span className="break-all">ID: {user.id}</span></div>}
    <p className="form-note mt-6">I pulsanti eseguono un login reale: i ruoli non vengono assegnati dal browser. Il backend filtra i dati e autorizza ogni operazione.</p>
  </Modal>
}
