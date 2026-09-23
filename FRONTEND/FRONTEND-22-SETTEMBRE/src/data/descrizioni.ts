/**
 * Schede dei capi, indicizzate sul nome del file immagine.
 *
 * Il backend non ha un campo descrizione: la chiave è l'immagine perché è la
 * cosa più stabile che abbiamo — un admin può rinominare un capo dal pannello,
 * ma la foto resta quella. Se un domani l'entità Oggetto guadagna una colonna
 * `descrizione`, questo file diventa il contenuto della migrazione.
 */
const schede: Record<string, string> = {
  // Denim
  'artistic-denim': 'Denim chiaro con stampa a pannelli: angeli, cornici dorate e frammenti di affresco distribuiti lungo la gamba. Il tipo di pantalone che si metteva per farsi riconoscere da trenta metri di distanza.',
  'beckham-denim': 'Lavaggio chiarissimo, vita bassa, gamba dritta e larga che appoggia sulle scarpe senza fermarsi. È il taglio che ha attraversato l’Inghilterra dei primi Duemila e non si è più fatto dimenticare.',
  'carpenter-denim': 'Taglio da lavoro autentico: passante per il martello sulla coscia, doppia cucitura a contrasto, gamba loose che cade dritta. Nato per un cantiere, finito sui campetti.',
  'acid-denim': 'Lavaggio acido con marmorizzazione irregolare — nessun pezzo è identico a un altro. Il denim che parlava più forte di chi lo indossava.',
  'baggy-offwhite': 'Off-white lavato fino a perdere quasi tutto l’indaco, gamba ampissima, vita che scende sui fianchi. Si porta con le sneakers mezze coperte e nessuna fretta di arrivare.',
  'cargo-denim': 'Sei tasche, passanti doppi, gamba wide che si apre dal ginocchio in giù. Il pantalone di chi usciva di casa portandosi dietro tutta la giornata.',

  // Outerwear
  'padded-bomber': 'Imbottitura leggera, colletto a coste, zip centrale piena. Il bomber che restava addosso dentro e fuori dal locale, perché toglierlo era una scocciatura.',
  'utility-parka': 'Cotone tecnico pesante, cappuccio regolabile e tasconi applicati sul davanti. Roba militare riadattata, come quasi tutto quello che poi abbiamo chiamato streetwear.',
  'metallic-puffer': 'Nylon metallizzato che riflette qualunque cosa gli passi vicino, collo alto, camere orizzontali generose. Nei primi Duemila brillare era un progetto, non un incidente.',
  'salvador-y2k': 'Velluto a coste fine, colletto a contrasto, taglio corto sul fianco. Una giacca da tutti i giorni fatta bene, che invecchia meglio di chi la compra.',
  'salvador-zip': 'Velluto a coste marrone, zip intera, due tasche a filo. Il capo che si prendeva dall’armadio di qualcun altro e non si restituiva più.',
  'wind-shell': 'Nylon leggero con inserti a contrasto sui fianchi, collo alto, chiusura intera. Nata per il riscaldamento prima della partita, rimasta addosso per tutto il resto.',

  // Pantaloni
  'pirlo-corduroy': 'Velluto a coste larghe, gamba ampia, caduta morbida sulla scarpa. Eleganza senza sforzo apparente, che è sempre la cosa più difficile da ottenere.',

  // Pelle
  'chiodo-leather': 'Pelle vissuta con screpolature vere, zip asimmetrica, spalle costruite larghe. Ogni segno che ha addosso se l’è guadagnato prima di arrivare qui.',
  'cristiano-leather': 'Pelle scura consumata sui gomiti e sulle spalle, colletto a coste, zip diagonale. La giacca che si infila per uscire e si toglie solo per dormire.',
  'biposto-leather': 'Pelle con rinforzi imbottiti su spalle e gomiti, cintura in vita, linea da motociclismo anni Novanta. Costruita per andare veloce, portata soprattutto per stare fermi.',
  'trench-leather': 'Pelle morbida marrone, lunghezza sotto il ginocchio, cintura in vita da stringere o lasciare aperta. Quel tipo di cappotto che fa sembrare importante anche chi non lo è.',
  'henry-varsity': 'Corpo in lana bordeaux, maniche in pelle panna, toppe cucite a mano e bottoni a pressione. Un capo che premiava qualcuno — adesso premia chi lo trova.',

  // Scarpe
  'climacool': 'Mesh bianco traspirante, tre strisce grigie, suola spessa da corsa di inizio millennio. Erano scarpe da palestra: sono diventate scarpe da tutti i giorni nel giro di una stagione.',
  'jordan-4': 'Suede marrone, rete laterale, allacciatura con alette in plastica. Il modello che ha fatto capire che una scarpa da basket poteva stare ovunque, tranne che in campo.',
  'air-max': 'Gradiente dal grigio scuro al chiaro, camera d’aria a vista, costruzione a strati sovrapposti. Disegnata guardando il corpo umano, portata da chi non lo sapeva e la amava lo stesso.',
  'dunk-low': 'Pelle bianco sporco e verde militare, silhouette bassa e pulita. Nate per il parquet universitario, finite sotto ogni jeans largo del pianeta.',

  // Top & Camicie
  'oldculture-black': 'Felpa girocollo in cotone pesante, stampa collegiale sul petto, vestibilità larga di spalle. Sta bene anche dopo cento lavaggi — forse ci sta meglio.',
  'oldculture-cream': 'Corpo panna e maniche marroni, grafica stampata al centro, polsini a coste. La versione bicolore, quella che si notava di più senza provarci.',
  'ronaldinho-tee': 'Cotone bianco pesante, stampa fotografica a tutta altezza e firma riprodotta sotto. Il sorriso più famoso del calcio, portato addosso.',
  'striped-brown': 'Righe verticali marroni e panna su cotone leggero, colletto morbido, taglio ampio. Si porta aperta sopra una t-shirt bianca, esattamente come si faceva allora.',
  'striped-grey': 'Righe sottili grigie e nere, fodera del colletto a contrasto, taschino sul petto. La stessa camicia dell’altra variante, con un carattere più notturno.',

  // Trackwear
  'balotelli-velour': 'Velluto bordeaux con profili bianchi lungo le maniche, zip intera, polsini a coste. Il capo che ha portato lo stadio dentro la strada, e non è più tornato indietro.',
  'satin-tracksuit': 'Completo in tessuto tecnico satinato blu notte, profili a contrasto, elastico in vita. Una tuta che non è mai stata soltanto una tuta.',
}

/** Estrae la chiave dall'URL immagine: /assets/products/dunk-low.jpg -> dunk-low */
export function descrizioneDi(immagineUrl?: string): string | undefined {
  if (!immagineUrl) return undefined
  const slug = immagineUrl.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '')
  return slug ? schede[slug] : undefined
}
