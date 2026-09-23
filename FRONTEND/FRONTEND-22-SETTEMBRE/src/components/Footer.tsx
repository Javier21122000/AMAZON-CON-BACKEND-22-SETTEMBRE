import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useUiStore } from '../stores/useUiStore'

export function Footer() {
  const { user, roles } = useAuthStore()
  const level = roles.includes('ROLE_ADMIN') ? '03 / AMMINISTRATORE' : user ? '02 / UTENTE' : '01 / PUBBLICO'
  return <footer className="footer"><div className="footer-top"><div><Link to="/" className="brand">ARCHIVIO<span className="brand-zero">00<sup>®</sup></span></Link><p>Vintage menswear. Modern attitude.<br />Curato in Italia, radicato nei 2000.</p></div><nav aria-label="Link footer"><Link to="/catalogo">L’archivio <ArrowUpRight size={14} /></Link><Link to="/editoriale">La cultura <ArrowUpRight size={14} /></Link><Link to="/preferiti">I tuoi preferiti <ArrowUpRight size={14} /></Link></nav><button className="footer-access" onClick={() => useUiStore.getState().setTestDrawer(true)}><span className="eyebrow">IL TUO ACCESSO</span><span><span className="status-dot" />LIVELLO {level}</span><small>Scopri i tre livelli <ArrowUpRight size={13} /></small></button></div><div className="footer-wordmark" aria-hidden="true">ARCHIVIO 00</div><div className="footer-bottom"><span>© {new Date().getFullYear()} ARCHIVIO 00</span><span>PAST PERFECT. PRESENT TENSE.</span><span>ITALIA / EUR €</span></div></footer>
}
