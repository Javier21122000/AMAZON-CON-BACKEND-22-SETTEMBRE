import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Asterisk } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  return <section className="hero rounded-3xl" aria-labelledby="hero-title">
    <img className="hero-image" src="/images/culture/ronaldo-bandiera.jpg" alt="Ronaldo alza la bandiera del Brasile sul campo dopo una partita, fotografia in bianco e nero" fetchPriority="high" />
    <div className="hero-shade" />
    <div className="hero-top"><span className="eyebrow"><span className="status-dot" /> ROBA DEI 2000, TROVATA UNA PER UNA</span><span className="eyebrow">VOL. 01 / GLI ORIGINALI</span></div>
    <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
      <h1 id="hero-title">Y2K ATHLETIC<br />& STREETWEAR<br /><span>ARCHIVE.</span></h1>
      <p>Fuori dal campo si vestivano meglio che dentro.<br /><em>Siamo andati a riprenderci quella roba lì.</em></p>
      <Link to="/catalogo" className="button button-white">Entra nell’archivio <ArrowUpRight size={20} /></Link>
    </motion.div>
    <div className="hero-bottom"><span>OLD SCHOOL.<br /><b>NEVER OLD.</b></span><a href="#selezione" className="hero-scroll" aria-label="Scopri la selezione"><ArrowDown size={20} /></a><div className="hero-stamp"><Asterisk size={30} strokeWidth={1.3} /><span>NON ERA MEGLIO PRIMA.<br />ERA PIÙ DIVERTENTE.</span></div></div>
  </section>
}
