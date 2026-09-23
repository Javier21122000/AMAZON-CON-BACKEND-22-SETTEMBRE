import { NavLink, Link } from 'react-router-dom'
import { ArrowUpRight, Heart, Settings2, UserRound } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import { useUiStore } from '../stores/useUiStore'
import { useArchiveStore } from '../stores/useArchiveStore'

export function Navbar() {
  const user = useAuthStore(s => s.user)
  const admin = useAuthStore(s => s.roles.includes('ROLE_ADMIN'))
  const favorites = useArchiveStore(s => s.favorites.length)
  const openAuth = useUiStore(s => s.openAuth)
  const openTest = () => useUiStore.getState().setTestDrawer(true)
  return <><div className="announcement"><span>IL PASSATO HA ANCORA QUALCOSA DA DIRE.</span><span className="hidden sm:inline">SELEZIONE VINTAGE / 2000—2010 <ArrowUpRight size={12} /></span></div>
    <header className="navbar"><Link to="/" className="brand" aria-label="ARCHIVIO 00 — Home">ARCHIVIO<span className="brand-zero">00<sup>®</sup></span></Link>
      <nav className="main-nav" aria-label="Navigazione principale"><NavLink to="/" end>Home</NavLink><NavLink to="/catalogo">L’archivio</NavLink><NavLink to="/editoriale">La cultura <ArrowUpRight size={12} /></NavLink>{admin && <NavLink to="/admin">Studio admin</NavLink>}</nav>
      <div className="nav-actions"><button onClick={openTest} className="access-button" title="Prova i tre livelli di accesso"><Settings2 size={16} /><span>Accessi</span></button><Link to="/preferiti" aria-label={`Preferiti, ${favorites} capi`} className="icon-button favorite-nav"><Heart size={20} />{favorites > 0 && <span>{favorites}</span>}</Link><button className="account-button" onClick={user ? openTest : () => openAuth()}><UserRound size={17} /><span>{user ? user.firstName : 'Accedi'}</span></button></div>
    </header>
    {admin && <div className="admin-mode"><span className="status-dot" />ADMIN MODE - {user?.firstName.toUpperCase() || 'JAVIER'}<span>Bozze e dati riservati visibili</span></div>}
  </>
}
