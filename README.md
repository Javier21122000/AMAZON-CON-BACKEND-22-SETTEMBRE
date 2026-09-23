# ARCHIVIO 00

E-commerce vintage maschile: Spring Boot 3 / PostgreSQL e React / TypeScript / Tailwind.

## Avvio locale

- Backend: `BACKEND/AMAZON-CON-BACKEND-22-SETTEMBRE`, porta 8080. Configurare `DB_USERNAME` e `DB_PASSWORD`; il database predefinito è `AMAZON-CON-BACKEND-22-SETTEMBRE`. Avvio: `./mvnw spring-boot:run`.
- Frontend: `FRONTEND/FRONTEND-22-SETTEMBRE`, porta 5173. Eseguire `npm install`, copiare `.env.example` in `.env.local` se assente e avviare `npm run dev`.
- Il catalogo completo è disponibile su `/catalogo`; la home propone 8 capi, dando priorità ai prodotti in evidenza.

L'app parte come Guest a ogni caricamento. La modale di accesso e il pannello Accessi consentono il login reale ai profili locali:

| Profilo | Email | Password |
| --- | --- | --- |
| Utente | utente@archivio00.it | password123 |
| Admin | javier@archivio00.it | admin123 |

## Catalogo e immagini

Il catalogo iniziale contiene 28 capi, incluse 6 Special Editions e due varianti ciascuna per camicie a righe e felpe Oldculture. Le varianti condividono il nome esatto e hanno ID, colore e immagine distinti. Categoria e variante sono campi persistenti; rinominare un capo non cambia il filtro di appartenenza. Rating e conteggi recensioni sono dati dimostrativi.

I 28 JPG in `FRONTEND/FRONTEND-22-SETTEMBRE/public/assets/products/` sono ritagli reali dei due collage forniti, privi delle didascalie originali. Lo script normalizza il fondo neutro per l'uso con `mix-blend-multiply`; la risoluzione resta quella delle immagini sorgenti, senza dettagli generati artificialmente. Per rigenerarli dalla cartella principale, con Pillow installato:

```sh
python3 scripts/crop_products.py '/percorso/primo.jpg' '/percorso/secondo.jpg'
```

Le card sono cliccabili anche da tastiera, usano immagini contenute in un riquadro 4:5 e separano prezzo e recensioni dalla foto. Il pulsante Edit è disponibile agli admin su hover, focus da tastiera e touch; salva nome, prezzo e flag tramite PUT, mantenendo gli altri metadati. Le API verificano i ruoli sul server.

## Persistenza e migrazione locale

`ddl-auto=update` sostituisce la precedente ricreazione del database. L'inizializzatore adegua il precedente vincolo univoco sul solo nome a quello su nome e variante, utilizzando PostgreSQL. Una chiave stabile del seed evita di sovrascrivere modifiche admin e di duplicare prodotti rinominati ai riavvii.

I prodotti del vecchio seed con foto Unsplash vengono associati ai nuovi ritagli quando esiste una corrispondenza. Gli altri placeholder conosciuti vengono conservati come bozze con immagine neutra, preservando gli ID e i riferimenti dei preferiti. I prodotti personalizzati non vengono eliminati.

## Verifiche

Nel frontend:

```sh
npm run build
npm run lint
npm test
```

Playwright richiede il backend locale attivo e verifica accessi, permessi, preferiti, modifica admin, filtri, varianti, caricamento immagini e layout mobile. I dati modificati dai test vengono ripristinati. Le schermate vengono salvate in `artifacts/`.

Per i test Java, usare un database PostgreSQL separato e vuoto, specificando `SPRING_DATASOURCE_URL`, `DB_USERNAME` e `DB_PASSWORD`, quindi eseguire `./mvnw test` dalla cartella backend. I test verificano anche la serializzazione pubblica e la conservazione delle modifiche dopo esecuzioni ripetute dell'inizializzatore.
