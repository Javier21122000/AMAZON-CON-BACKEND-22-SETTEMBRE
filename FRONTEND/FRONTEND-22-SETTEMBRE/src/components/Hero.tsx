import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Asterisk } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  return <section className="hero rounded-3xl" aria-labelledby="hero-title">
    <img className="hero-image" src="/images/archive-campaign.png" alt="Editoriale Y2K: due modelli con track jacket, pelle e denim baggy in uno stadio in cemento" fetchPriority="high" />
    <div className="hero-shade" />
    <div className="hero-top"><span className="eyebrow"><span className="status-dot" /> CURATED FROM THE 2000s</span><span className="eyebrow">VOL. 01 / THE ORIGINALS</span></div>
    <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
      <h1 id="hero-title">Y2K ATHLETIC<br />& STREETWEAR<br /><span>ARCHIVE.</span></h1>
      <p>Fuori dal campo. Fuori dagli schemi.<br />L’attitudine dei 2000, da indossare adesso.</p>
      <Link to="/catalogo" className="button button-white">Esplora l’archivio <ArrowUpRight size={20} /></Link>
    </motion.div>
    <div className="hero-bottom"><span>OLD SCHOOL.<br /><b>NEVER OLD.</b></span><a href="#selezione" className="hero-scroll" aria-label="Scopri la selezione"><ArrowDown size={20} /></a><div className="hero-stamp"><Asterisk size={30} strokeWidth={1.3} /><span>UN’ALTRA EPOCA.<br />LA TUA PROSSIMA STORIA.</span></div></div>
  </section>
}
