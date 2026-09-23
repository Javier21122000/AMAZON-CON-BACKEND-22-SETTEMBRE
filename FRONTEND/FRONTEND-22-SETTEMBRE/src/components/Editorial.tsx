import { ArrowUpRight, Asterisk } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Editorial({ full = false }: { full?: boolean }) {
  return <section className={`editorial-section ${full ? 'editorial-full' : ''}`}>
    <div className="section-heading">
      <div>
        <span className="eyebrow">NON SOLO VESTITI. UN MODO DI STARE AL MONDO.</span>
        <h2>NON È NOSTALGIA.<br /><em>È ATTITUDINE.</em></h2>
      </div>
      <p className="section-description">
        Dai tunnel degli stadi alle strade bagnate di Manchester.<br />
        <em>Nessuno chiedeva il permesso. Tantomeno lo chiedeva a noi.</em>
      </p>
    </div>
    <div className="editorial-grid">
      <Link to="/catalogo?categoria=Trackwear" className="editorial-card editorial-athletic">
        <img src="/images/culture/campo-vuoto.jpg" alt="Due giocatori in tuta larga su un campo vuoto prima della partita" loading="lazy" />
        <div className="editorial-card-top"><span className="eyebrow">01 / PRIMA DEL FISCHIO</span><ArrowUpRight size={22} /></div>
        <div className="editorial-card-copy">
          <span className="eyebrow">TRACKWEAR</span>
          <h3>DAL CAMPO.<br />ALLA STRADA.</h3>
          <span className="editorial-pill">Guarda le tute <ArrowUpRight size={14} /></span>
        </div>
      </Link>
      <Link to="/catalogo?categoria=Denim" className="editorial-card editorial-street">
        <img src="/images/culture/cr7-terminal.jpg" alt="Jeans a zampa larga e camicia stampata in aeroporto, stile primi anni 2000" loading="lazy" />
        <div className="editorial-card-top"><span className="eyebrow">02 / IN TRANSITO</span><ArrowUpRight size={22} /></div>
        <div className="editorial-card-copy">
          <span className="eyebrow">DENIM</span>
          <h3>ZAMPA LARGA.<br />PASSO LENTO.</h3>
          <span className="editorial-pill">Guarda il denim <ArrowUpRight size={14} /></span>
        </div>
      </Link>
    </div>
    {full && <div className="editorial-story">
      <span className="eyebrow">ARCHIVIO 00 / COME È NATO</span>
      <h2>IL VINTAGE NON STA FERMO.</h2>
      <p>Le zip delle track jacket tirate fino al mento. Il denim che cade largo e si consuma sulle sneakers. La pelle che dopo dieci anni smette di essere una giacca e diventa una seconda pelle. Siamo partiti da lì, da come si vestiva la gente quando nessuno la stava guardando.</p>
      <p>Cerchiamo i capi uno alla volta, li controlliamo, li fotografiamo e li rimettiamo in giro. <em>Niente riproduzioni, niente «ispirato a».</em> Roba vera, con i segni addosso.</p>
      <p className="editorial-nota">Le fotografie del diario ritraggono personaggi pubblici degli anni 2000 e servono a raccontare un’epoca. Non c’è nessun accordo, nessuna sponsorizzazione e nessun legame fra loro e questo negozio.</p>
      <Link className="button button-dark" to="/catalogo">Vai a vedere i capi <ArrowUpRight size={18} /></Link>
    </div>}
  </section>
}

export function Manifesto() {
  return <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="manifesto rounded-3xl">
    <span className="eyebrow">ARCHIVIO 00 — NATO ADESSO, CRESCIUTO ALLORA.</span>
    <Asterisk size={58} strokeWidth={1} />
    <h2>GOOD STYLE.<br /><span>SECOND LIFE.</span></h2>
    <p>Non serve inventarsi un’altra epoca.<br /><em>Basta ridare vita a quella giusta.</em></p>
    <Link to="/editoriale" className="underlined-link">Entra nel diario <ArrowUpRight size={17} /></Link>
  </motion.section>
}
