import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Check, X, CircleAlert } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { ScegliLeggenda, LeggendaPagina } from './components/Leggende'
import { ProductGrid } from './components/ProductGrid'
import { FavoritesView } from './components/FavoritesView'
import { AdminPanel } from './components/AdminPanel'
import { Editorial, Manifesto } from './components/Editorial'
import { Album, Nastro } from './components/Album'
import { Footer } from './components/Footer'
import { AuthModal } from './components/AuthModal'
import { AccessDrawer } from './components/AccessDrawer'
import { useAuthStore } from './stores/useAuthStore'
import { useArchiveStore } from './stores/useArchiveStore'
import { useUiStore } from './stores/useUiStore'
import { categories } from './data/editorial'
import type { Category } from './lib/types'

function Catalog() {
  const [params] = useSearchParams()
  const value = params.get('categoria') as Category
  return <ProductGrid key={value} initialCategory={categories.includes(value) ? value : 'Tutti'} />
}
function AppContent() {
  const location = useLocation()
  const token = useAuthStore(s => s.token)
  const { loadProducts, loadFavorites } = useArchiveStore()
  const { authMode, testDrawer, toast, clearToast } = useUiStore()
  useEffect(() => {
    sessionStorage.removeItem('archivio00-session')
    useAuthStore.getState().clearSession()
  }, [])
  useEffect(() => { void loadProducts(); void loadFavorites() }, [token, loadProducts, loadFavorites])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(clearToast, toast.error ? 8000 : 4500)
    return () => window.clearTimeout(timer)
  }, [toast, clearToast])
  return <><a className="skip-link" href="#main">Vai al contenuto</a><Navbar /><main id="main" className="site-main"><Routes>
    <Route path="/" element={<><ScegliLeggenda /><div className="era-strip"><span><em>Vintage, not ordinary.</em></span><span>PELLE VISSUTA</span><span>DENIM CHE STRISCIA</span><span>TUTE DUE TAGLIE IN PIÙ</span><span>2000—2010 <span className="strip-star">✳</span></span></div><ProductGrid compact /><Nastro /><Album /><Editorial /><Manifesto /></>} />
    <Route path="/leggenda/:slug" element={<LeggendaPagina />} /><Route path="/catalogo" element={<Catalog />} /><Route path="/preferiti" element={<FavoritesView />} /><Route path="/admin" element={<AdminPanel />} /><Route path="/editoriale" element={<><Editorial full /><Album full /></>} />
    <Route path="*" element={<section className="empty-state page-section"><span className="eyebrow">404 / FUORI ARCHIVIO</span><h1>Questa pagina non sta in archivio.</h1><Link className="button button-dark" to="/">Torna alla home</Link></section>} />
  </Routes></main><Footer />{authMode && <AuthModal key={authMode} mode={authMode} />}{testDrawer && <AccessDrawer />}<AnimatePresence>{toast && <motion.div className={`toast ${toast.error ? 'toast-error' : ''}`} role={toast.error ? 'alert' : 'status'} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>{toast.error ? <CircleAlert size={19} /> : <Check size={19} />}<span>{toast.message}</span><button onClick={clearToast} aria-label="Chiudi notifica"><X size={17} /></button></motion.div>}</AnimatePresence></>
}
export default function App() { return <MotionConfig reducedMotion="user"><BrowserRouter><AppContent /></BrowserRouter></MotionConfig> }
