export type Leggenda = {
  slug: string
  nome: string
  soprannome: string
  numero: string
  ritratto: string
  fermo: string
  /** Filmato di sfondo in loop. Se manca, resta il ritratto in carrellata. */
  video?: string
  claim: string
  occhiello: string
  titolo: string
  paragrafi: string[]
  regole: string[]
  firma: string
  /** Chiavi immagine dei capi che gli somigliano. Vedi descrizioni.ts. */
  capi: string[]
}

export const leggende: Leggenda[] = [
  {
    slug: 'ronaldinho',
    nome: 'Ronaldinho',
    soprannome: 'Il sorriso',
    numero: '10',
    ritratto: '/images/leggende/ronaldinho.jpg',
    fermo: '/images/leggende/ronaldinho-fermo.jpg',
    video: '/videos/ronaldinho.webp',
    claim: 'Se non ti diverti, hai già perso.',
    occhiello: 'Scegli il suo stile',
    titolo: 'Vestirsi come si gioca a piedi nudi',
    paragrafi: [
      'Non ha mai capito perché bisognasse scegliere fra essere bravi ed essere felici. Ha fatto le due cose insieme per vent’anni, e ogni tanto sembrava che la seconda gli riuscisse meglio.',
      'Il suo guardaroba funziona allo stesso modo. Velluto bordeaux, gialli che non chiedono scusa, stampe grandi abbastanza da vedersi dall’altra parte della strada. Niente è studiato per sembrare costoso: è studiato per stare comodo mentre succede qualcosa.',
      'Nei 2000 aveva capito una cosa che agli altri è sfuggita — i vestiti non servono a farti guardare. Servono a farti muovere. Tutto il resto viene da sé, e se non viene pazienza, tanto la serata è già cominciata.',
    ],
    regole: [
      'Un colore che si vede da lontano, sempre',
      'Il tessuto deve essere morbido o non lo metti',
      'Se ti impedisce di ballare, non è roba tua',
    ],
    firma: 'Jogo bonito',
    capi: ['balotelli-velour', 'ronaldinho-tee', 'oldculture-cream', 'oldculture-black',
           'satin-tracksuit', 'artistic-denim', 'acid-denim', 'dunk-low', 'striped-brown'],
  },
  {
    slug: 'cristiano',
    nome: 'Cristiano Ronaldo',
    soprannome: 'Il lavoro',
    numero: '07',
    ritratto: '/images/leggende/cristiano.jpg',
    fermo: '/images/leggende/cristiano-fermo.jpg',
    video: '/videos/cristiano.webp',
    claim: 'Nessuno si è mai svegliato leggenda per caso.',
    occhiello: 'Scegli il suo stile',
    titolo: 'Arrivare sempre vestito come se contasse',
    paragrafi: [
      'A Manchester si allenava quando gli altri erano già a casa. La stessa ossessione l’ha messa in ogni cosa che si è infilato addosso: niente è capitato per caso, nemmeno una camicia sbagliata — e ne ha portate parecchie, sbagliate benissimo.',
      'Pelle che sta in piedi da sola, nylon che riflette la luce dei lampioni, denim chiaro che spazza il pavimento dell’aeroporto alle undici di mattina. Capi costruiti, con una struttura, che chiedono di essere notati e accettano il rischio di non piacere.',
      'È l’opposto della sprezzatura, ed è per questo che funziona: in un’epoca in cui tutti fingevano di essersi vestiti in due minuti, lui non ha mai finto niente.',
    ],
    regole: [
      'Se non si nota, cambialo',
      'La struttura prima della comodità',
      'Le scarpe pulite non sono negoziabili',
    ],
    firma: 'Siuuu',
    capi: ['metallic-puffer', 'cristiano-leather', 'chiodo-leather', 'biposto-leather',
           'trench-leather', 'jordan-4', 'air-max', 'baggy-offwhite', 'henry-varsity', 'salvador-y2k'],
  },
  {
    slug: 'messi',
    nome: 'Lionel Messi',
    soprannome: 'Il silenzio',
    numero: '19',
    ritratto: '/images/leggende/messi.jpg',
    fermo: '/images/leggende/messi-fermo.jpg',
    video: '/videos/messi.webp',
    claim: 'Parlare poco. Poi andarsene in porta.',
    occhiello: 'Scegli il suo stile',
    titolo: 'Il contrario di mettersi in mostra',
    paragrafi: [
      'È arrivato in Europa a tredici anni con una valigia e un problema di ormone della crescita. Non ha mai imparato a fare la voce grossa e non gli è servito: parlava il minimo indispensabile e poi risolveva la partita al sessantesimo.',
      'Si veste così. Denim da lavoro, felpe grigie, un windbreaker che serve davvero a ripararsi dal vento. Nessuna stampa che spieghi chi sei, nessun colore che entri prima di te in una stanza. Roba che funziona lunedì come sabato.',
      'È la parte meno raccontata dei 2000 e forse quella più vera: la maggior parte delle persone non si vestiva per essere fotografata. Si vestiva per uscire di casa.',
    ],
    regole: [
      'Deve funzionare anche di lunedì mattina',
      'Nessuna scritta che parli al posto tuo',
      'Comodo, pulito, e basta così',
    ],
    firma: 'Tranquilo',
    capi: ['carpenter-denim', 'beckham-denim', 'cargo-denim', 'striped-grey', 'wind-shell',
           'padded-bomber', 'utility-parka', 'pirlo-corduroy', 'climacool', 'salvador-zip'],
  },
]

export const leggendaDi = (slug?: string) => leggende.find(l => l.slug === slug)

/** Quale leggenda rivendica questo capo. Chiave: nome file immagine. */
export function leggendaDelCapo(immagineUrl?: string): Leggenda | undefined {
  if (!immagineUrl) return undefined
  const slug = immagineUrl.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '')
  return slug ? leggende.find(l => l.capi.includes(slug)) : undefined
}
