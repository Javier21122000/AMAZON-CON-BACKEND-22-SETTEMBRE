export type Scatto = {
  id: string
  file: string
  alt: string
  luogo: string
  titolo: string
  testo: string
  firma?: string
}

/** Le foto del diario. L'ordine è quello del racconto, non quello cronologico. */
export const diario: Scatto[] = [
  {
    id: 'sorriso',
    file: '/images/culture/ronaldinho-sorriso.jpg',
    alt: 'Ronaldinho sorride in maglia gialla del Brasile prima di una partita',
    luogo: 'Porto Alegre → il mondo',
    titolo: 'Prima veniva il sorriso',
    testo: 'Ha imparato a giocare su un campo di terra, con un pallone che non era suo, in un quartiere dove l’acqua arrivava a orari. Poi ha riempito gli stadi più grandi del pianeta facendo esattamente la stessa cosa di allora: ridere mentre giocava. Non ha mai trattato il calcio come un lavoro. L’ha trattato come una festa di strada a cui erano invitati tutti.',
    firma: 'Ronaldinho',
  },
  {
    id: 'baile',
    file: '/images/culture/notte-baile.jpg',
    alt: 'Gruppo di amici di notte con una maglia da calcio tenuta davanti all’obiettivo',
    luogo: 'Dopo mezzanotte',
    titolo: 'Il baile non finiva mai',
    testo: 'Casse a tutto volume, una maglia tenuta davanti all’obiettivo come un trofeo, il flash che brucia i contorni. Nei 2000 nessuno posava: si stava lì, e qualcuno per caso scattava. Le foto venivano storte, mosse, sgranate. Ed è per questo che sono rimaste.',
  },
  {
    id: 'pes',
    file: '/images/culture/pes-2007.jpg',
    alt: 'Tre ragazzi giocano a Pro Evolution Soccer 6 in una cameretta con poster alle pareti',
    luogo: '14 ottobre 2007',
    titolo: 'Il lusso era il secondo joypad',
    testo: 'Poster attaccati con lo scotch, lattine sul tappeto, un divano che aveva già visto troppe partite. Nessuna campagna pubblicitaria, nessun set: una cameretta e tre ragazzi che si passano il controller. La data stampata nell’angolo non l’ha messa un filtro. C’era davvero.',
  },
  {
    id: 'terminal',
    file: '/images/culture/cr7-terminal.jpg',
    alt: 'Cristiano Ronaldo cammina in aeroporto con camicia stampata e jeans a zampa',
    luogo: 'Terminal, ore undici',
    titolo: 'Zampa larga e trolley',
    testo: 'Camicia stampata, occhiali grandi il doppio della faccia, denim che spazza il pavimento. Nessuno si vestiva per le fotografie — le fotografie arrivavano dopo, quando ormai era tardi per ripensarci.',
  },
  {
    id: 'manchester',
    file: '/images/culture/balotelli-manchester.jpg',
    alt: 'Mario Balotelli cammina per una via di Manchester con giacca chiara e cargo',
    luogo: 'Manchester, dicembre',
    titolo: 'Giacca leggera sotto la pioggia',
    testo: 'Il freddo non era un problema, era un dettaglio. Cargo larghi che strisciano sull’asfalto bagnato, catena, cappellino calato fino agli occhi. Attraversare il centro vestito così, a dicembre, era già una dichiarazione — e nessuno l’aveva scritta da nessuna parte.',
  },
  {
    id: 'campo',
    file: '/images/culture/campo-vuoto.jpg',
    alt: 'Due giocatori in tuta larga su un campo da calcio vuoto prima della partita',
    luogo: 'Prima della partita',
    titolo: 'Tuta larga, stadio vuoto',
    testo: 'Le ore migliori erano quelle senza pubblico. Trackwear due taglie in più, cuffie al collo, le mani in tasca e tutto il tempo del mondo. Il campo era ancora una cosa privata.',
  },
  {
    id: 'roma',
    file: '/images/culture/totti-roma.jpg',
    alt: 'Francesco Totti al volante con canotta bianca e occhiali scuri',
    luogo: 'Roma, finestrino abbassato',
    titolo: 'Canotta bianca, gomito fuori',
    testo: 'Un gladiatore tatuato sul braccio, un orologio troppo grande, il gomito appoggiato allo sportello. La città era la sua e la attraversava piano, senza fretta di arrivare.',
    firma: 'Totti',
  },
  {
    id: 'jackson',
    file: '/images/culture/jackson-campetto.jpg',
    alt: 'Michael Jackson gioca a pallone in tuta blu con il cognome stampato sulla schiena',
    luogo: 'Un pomeriggio qualunque',
    titolo: 'La tuta col nome dietro',
    testo: 'Prima di diventare un’uniforme da palcoscenico, la track jacket era questa: il cognome stampato sulla schiena, i calzini a righe tirati su fino al polpaccio, un pallone e un pezzo di pista d’atletica. Nessuno stava girando niente. Si giocava e basta.',
  },
  {
    id: 'londra',
    file: '/images/culture/beckham-londra.jpg',
    alt: 'David e Victoria Beckham camminano per una via di Londra con canotta e pantaloni cargo',
    luogo: 'Londra, primo pomeriggio',
    titolo: 'Canotta verde, cargo che strisciano',
    testo: 'Pantaloni talmente larghi da coprire le scarpe, la cintura lasciata cadere sul fianco, gli occhiali piccoli come una firma. È il momento esatto in cui il calcio e la moda hanno smesso di essere due mondi separati, e nessuno dei due ha chiesto scusa.',
    firma: 'Beckham',
  },
  {
    id: 'finale',
    file: '/images/culture/zidane-ronaldo.jpg',
    alt: 'Zidane e Ronaldo giocano alla PlayStation seduti su pouf, con trofei alle pareti',
    luogo: 'Davanti a una PlayStation',
    titolo: 'Due palloni d’oro su un pouf',
    testo: 'Addosso la maglia della propria nazionale, sotto un pouf giallo e uno verde, dietro le spalle i trofei veri che prendono polvere su una mensola. Hanno vinto tutto quello che c’era da vincere e passano il pomeriggio a rigiocarsi la stessa finale su un televisore a tubo catodico.',
  },
]

/** Le tre che finiscono in home. Le altre vivono sulla pagina editoriale. */
export const diarioHome = ['sorriso', 'jackson', 'manchester'] as const

export const manifesto = {
  occhiello: 'Da dove arriva tutto questo',
  titolo: 'Chi non aveva niente si è inventato tutto',
  paragrafi: [
    'C’è una linea che parte dai campetti di terra battuta e arriva fin dentro i negozi. Passa per il samba, per il baile funk, per le radio accese nei cortili e per le magliette lavate troppe volte.',
    'Chi non aveva niente si è inventato il modo di camminare, di portare i pantaloni tre taglie più larghi, di mettersi in posa senza mettersi in posa. Non era una tendenza. Era quello che c’era.',
    'Noi vendiamo dei vestiti, sia chiaro. Ma la cosa che stiamo davvero provando a tenere in vita è quella lì in fondo alle foto: il sorriso.',
  ],
  chiusura: 'Old school. Never old.',
}

/** Il nastro: immagini che non raccontano una storia, danno il tono. */
export type Tassello = { file: string; alt: string; didascalia: string }
export const nastro: Tassello[] = [
  { file: '/images/culture/ronaldinho-caffe.jpg', alt: 'Ronaldinho si versa il caffè in cucina, in canotta gialla, sorridendo', didascalia: 'Il caffè più felice del mondo' },
  { file: '/images/culture/tyson-tigre.jpg', alt: 'Mike Tyson cammina con una tigre bianca al guinzaglio, in polo e pantaloncini', didascalia: 'L’idea di lusso, allora' },
  { file: '/images/culture/garage.jpg', alt: 'Auto sportive parcheggiate nel vialetto di una villa, da una rivista degli anni Novanta', didascalia: 'Il poster sopra il letto' },
  { file: '/images/culture/parla-italiano.jpg', alt: 'Sophia Loren in bianco e nero con la scritta gialla parla italiano', didascalia: 'Il tono di voce' },
  { file: '/images/culture/pes-2007.jpg', alt: 'Ragazzi giocano a Pro Evolution Soccer in una cameretta', didascalia: 'Il secondo joypad' },
]
