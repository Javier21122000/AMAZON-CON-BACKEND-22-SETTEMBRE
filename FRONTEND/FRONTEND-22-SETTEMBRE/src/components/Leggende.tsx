import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Asterisk } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { leggende, leggendaDi } from '../data/leggende'
import { useArchiveStore } from '../stores/useArchiveStore'
import { CardGrid, GridSkeleton } from './ProductGrid'

/**
 * L'ingresso della home: le tre leggende sono disposte come una mano di carte.
 * L'apertura a ventaglio e l'alzata al passaggio del mouse stanno tutte sul
 * <Link>, mentre framer-motion anima solo l'opacita' del contenitore: due
 * transform sullo stesso elemento si sovrascriverebbero a vicenda.
 */
export function ScegliLeggenda() {
  return <section className="ingresso" aria-labelledby="ingresso-titolo">
    <div className="ingresso-testa">
      <span className="eyebrow"><span className="status-dot" /> ROBA DEI 2000, TROVATA UNA PER UNA</span>
      <h1 id="ingresso-titolo">Y2K ATHLETIC<br />& STREETWEAR<br /><span>ARCHIVE.</span></h1>
      <p>Tre modi di attraversare lo stesso decennio.<br /><em>Pesca quello che ti somiglia e ti facciamo strada.</em></p>
    </div>

    <div className="ingresso-mazzo">
      {leggende.map((l, i) => <motion.div
        key={l.slug}
        className="carta-slot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .55, delay: i * .1 }}>
        <Link to={`/leggenda/${l.slug}`} className="carta-leggenda">
          <div className="carta-media">
            <img src={l.ritratto} alt={`${l.nome} negli anni Duemila`} fetchPriority={i === 0 ? 'high' : undefined} />
            <span className="scatto-grana" aria-hidden="true" />
            <span className="carta-numero" aria-hidden="true">{l.numero}</span>
          </div>
          <div className="carta-testo">
            <span className="carta-soprannome">{l.soprannome}</span>
            <h2>{l.nome}</h2>
            <p>«{l.claim}»</p>
            <span className="carta-invito">{l.occhiello} <ArrowUpRight size={15} /></span>
          </div>
        </Link>
      </motion.div>)}
    </div>
  </section>
}

/**
 * Sfondo animato della pagina. Se il filmato non c'e' ancora (o il browser non
 * lo carica) resta il ritratto con una lentissima carrellata: onError e'
 * l'unico modo affidabile per accorgersene, un <video> senza sorgente valida
 * mostrerebbe comunque il poster.
 */
function SfondoLeggenda({ video, ritratto }: { video?: string; ritratto: string }) {
  const [mancante, setMancante] = useState(false)
  const filmato = video && !mancante
  // GIF e WebP animate vanno in un <img>: un <video> non le riproduce.
  const immagineAnimata = Boolean(video && /\.(gif|webp|apng|png)$/i.test(video))
  return <div className="leggenda-sfondo" aria-hidden="true">
    {filmato
      ? immagineAnimata
        ? <img src={video} alt="" onError={() => setMancante(true)} />
        : <video src={video} poster={ritratto} autoPlay muted loop playsInline preload="metadata" onError={() => setMancante(true)} />
      : <img src={ritratto} alt="" className="leggenda-sfondo-fermo" />}
    <span className="leggenda-sfondo-velo" />
  </div>
}

/** La pagina del personaggio: racconto e capi che gli somigliano. */
export function LeggendaPagina() {
  const { slug } = useParams()
  const leggenda = leggendaDi(slug)
  const { products, loading } = useArchiveStore()

  const suoi = useMemo(() => {
    if (!leggenda) return []
    const chiave = (url?: string) => url?.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? ''
    return products.filter(p => leggenda.capi.includes(chiave(p.immagineUrl)) && p.pubblicato !== false)
  }, [products, leggenda])

  if (!leggenda) return <section className="empty-state page-section">
    <span className="eyebrow">FUORI ARCHIVIO</span>
    <h1>Questa leggenda non l’abbiamo.</h1>
    <Link className="button button-dark" to="/">Torna alla home</Link>
  </section>

  return <section className={`leggenda leggenda-${leggenda.slug}`}>
    <SfondoLeggenda video={leggenda.video} ritratto={leggenda.ritratto} />

    <Link to="/" className="leggenda-indietro underlined-link"><ArrowLeft size={15} /> Cambia leggenda</Link>

    <div className="leggenda-testa">
      <div className="leggenda-ritratto">
        <img src={leggenda.ritratto} alt={`${leggenda.nome} negli anni Duemila`} />
        <span className="scatto-grana" aria-hidden="true" />
        <img className="leggenda-fermo" src={leggenda.video ?? leggenda.fermo} alt="" aria-hidden="true" />
      </div>
      <div className="leggenda-copy">
        <span className="eyebrow">{leggenda.soprannome} · {leggenda.numero}</span>
        <h1>{leggenda.nome}</h1>
        <p className="leggenda-claim">«{leggenda.claim}»</p>
        {leggenda.paragrafi.map((testo, i) => <p key={i}>{testo}</p>)}
        <span className="signature signature-grande">{leggenda.firma}</span>
      </div>
    </div>

    <div className="leggenda-regole">
      <span className="eyebrow"><Asterisk size={15} strokeWidth={1.6} /> LE SUE TRE REGOLE</span>
      <ol>{leggenda.regole.map(regola => <li key={regola}>{regola}</li>)}</ol>
    </div>

    <div className="section-heading leggenda-selezione">
      <div>
        <span className="eyebrow">LA SUA SELEZIONE</span>
        <h2>I CAPI CHE<br /><em>GLI SOMIGLIANO.</em></h2>
      </div>
      <p className="section-description">
        {suoi.length} capi dell’archivio parlano la sua lingua.<br />
        <em>Se hai scelto lui, comincia da qui.</em>
      </p>
    </div>
    {loading ? <GridSkeleton /> : <CardGrid products={suoi} />}

    <div className="leggenda-altre">
      <span className="eyebrow">OPPURE</span>
      <div>
        {leggende.filter(l => l.slug !== leggenda.slug).map(l =>
          <Link key={l.slug} to={`/leggenda/${l.slug}`} className="leggenda-altra">
            <img src={l.ritratto} alt="" aria-hidden="true" />
            <span><strong>{l.nome}</strong><small>{l.soprannome}</small></span>
            <ArrowUpRight size={16} />
          </Link>)}
      </div>
    </div>
  </section>
}
