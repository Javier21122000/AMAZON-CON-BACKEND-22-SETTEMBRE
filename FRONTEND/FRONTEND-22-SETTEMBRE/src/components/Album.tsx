import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { diario, diarioHome, manifesto, nastro, type Scatto } from '../data/culture'

function Scattino({ scatto, index }: { scatto: Scatto; index: number }) {
  return <motion.figure
    className="scatto"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: .2 }}
    transition={{ duration: .55, delay: Math.min(index, 3) * .08, ease: [.22, 1, .36, 1] }}>
    <div className="scatto-media">
      <img src={scatto.file} alt={scatto.alt} loading="lazy" />
    </div>
    <figcaption>
      <span className="scatto-luogo">{scatto.luogo}</span>
      <h3>{scatto.titolo}</h3>
      <p>{scatto.testo}</p>
      {scatto.firma && <span className="signature">{scatto.firma}</span>}
    </figcaption>
  </motion.figure>
}

export function Album({ full = false }: { full?: boolean }) {
  const scatti = full ? diario : diario.filter(s => (diarioHome as readonly string[]).includes(s.id))

  return <section className={`album ${full ? 'album-full' : ''}`} aria-labelledby="album-title">
    <div className="section-heading">
      <div>
        <span className="eyebrow">IL DIARIO</span>
        <h2 id="album-title">NON ERA UN’EPOCA.<br /><em>ERA CASA NOSTRA.</em></h2>
      </div>
      <p className="section-description">
        Foto trovate, mosse, rovinate. Le teniamo così come sono.<br />
        <em>Se fossero venute bene non vorrebbero dire niente.</em>
      </p>
    </div>

    <div className="album-griglia">
      {scatti.map((scatto, index) => <Scattino key={scatto.id} scatto={scatto} index={index} />)}
    </div>

    {!full && <Link to="/editoriale" className="underlined-link album-tutto">
      Tutto il diario <ArrowUpRight size={17} />
    </Link>}

    {full && <div className="album-manifesto">
      <span className="eyebrow">{manifesto.occhiello}</span>
      <h2>{manifesto.titolo}</h2>
      {manifesto.paragrafi.map((testo, i) => <p key={i}>{testo}</p>)}
      <span className="signature signature-grande">{manifesto.chiusura}</span>
    </div>}
  </section>
}

/** Banda di immagini che danno il tono fra il catalogo e il diario. */
export function Nastro() {
  return <section className="nastro" aria-label="Riferimenti visivi degli anni Duemila">
    <span className="nastro-occhiello eyebrow">L’ARIA CHE TIRAVA</span>
    <div className="nastro-pista">
      {nastro.map((tassello, i) => <motion.figure
        key={tassello.file}
        className="tassello"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .3 }}
        transition={{ duration: .5, delay: Math.min(i, 4) * .07 }}>
        <div className="tassello-media">
          <img src={tassello.file} alt={tassello.alt} loading="lazy" />
        </div>
        <figcaption>{tassello.didascalia}</figcaption>
      </motion.figure>)}
    </div>
  </section>
}
