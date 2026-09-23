import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { authApi, errorMessage } from '../lib/api'
import { useAuthStore } from '../stores/useAuthStore'
import { useUiStore, type AuthMode } from '../stores/useUiStore'
import { Modal } from './Modal'
import { testCredentials } from '../lib/testCredentials'

export function AuthModal({ mode }: { mode: AuthMode }) {
  const close = useUiStore(s => s.closeAuth)
  const openAuth = useUiStore(s => s.openAuth)
  const notify = useUiStore(s => s.notify)
  const defaults = testCredentials(mode)
  const [email, setEmail] = useState(mode === 'admin' || mode === 'user' ? defaults.email : '')
  const [password, setPassword] = useState(mode === 'admin' || mode === 'user' ? defaults.password : '')
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const register = mode === 'register'

  async function loginWithCredentials(nextEmail: string, nextPassword: string) {
    if (busy) return
    setEmail(nextEmail); setPassword(nextPassword)
    setBusy(true); setError('')
    try {
      const session = await authApi.login({ email: nextEmail, password: nextPassword })
      useAuthStore.getState().setSession(session)
      notify(`Benvenuto nell’archivio, ${session.user.firstName}.`)
      close()
    } catch (err) { setError(errorMessage(err)) } finally { setBusy(false) }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (register) {
      setBusy(true); setError('')
      try {
        const session = await authApi.register({ email, password, username: String(form.get('username')).trim(), firstName: String(form.get('firstName')).trim(), lastName: String(form.get('lastName')).trim() })
        useAuthStore.getState().setSession(session)
        notify(`Benvenuto nell’archivio, ${session.user.firstName}.`)
        close()
      } catch (err) { setError(errorMessage(err)) } finally { setBusy(false) }
      return
    }
    await loginWithCredentials(email, password)
  }

  return <Modal title={register ? 'Entra nell’archivio.' : 'Bentornato.'} onClose={close}>
    <p className="muted mb-7">{register ? 'Un account, la tua selezione personale.' : 'Accedi per ritrovare i capi che vuoi tenere d’occhio.'}</p>
    {(mode === 'admin' || mode === 'user') && <p className="form-note mb-5">Profilo di test: {mode === 'admin' ? 'Javier · amministratore' : 'utente standard'}. I permessi vengono verificati dal server.</p>}

    <form onSubmit={submit} className="form-stack">
      {register && <><div className="form-row"><label>Nome<input name="firstName" required maxLength={80} autoComplete="given-name" /></label><label>Cognome<input name="lastName" required maxLength={80} autoComplete="family-name" /></label></div><label>Username<input name="username" required maxLength={80} autoComplete="username" /></label></>}
      <label>Email<input name="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<div className="password-field"><input name="password" type={visible ? 'text' : 'password'} minLength={register ? 8 : 1} maxLength={100} required autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} /><button type="button" aria-label={visible ? 'Nascondi password' : 'Mostra password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
      {error && <p role="alert" className="error-text">{error}</p>}
      <button className="button button-dark w-full" disabled={busy}>{busy ? <LoaderCircle className="animate-spin" size={18} /> : <>{register ? 'Crea account' : 'Accedi'}<ArrowUpRight size={19} /></>}</button>
    </form>
    {!register && <div className="quick-auth-box"><span className="eyebrow">DEV / TEST LOGIN</span><p className="form-note">Esplora l’archivio con un profilo di prova.</p><div className="quick-auth-buttons"><button type="button" disabled={busy} onClick={() => { const credentials = testCredentials('user'); void loginWithCredentials(credentials.email, credentials.password) }}>LOGIN TEST UTENTE</button><button type="button" disabled={busy} onClick={() => { const credentials = testCredentials('admin'); void loginWithCredentials(credentials.email, credentials.password) }}>LOGIN TEST ADMIN</button></div></div>}
    <p className="auth-switch">{register ? 'Hai già un account?' : 'Prima volta qui?'} <button onClick={() => openAuth(register ? 'login' : 'register')}>{register ? 'Accedi' : 'Registrati'}</button></p>
  </Modal>
}
