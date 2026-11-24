# CLAUDE.md

Guida per Claude Code a questo repository.

## Progetto

Startpage personale per il browser: HTML, CSS e JavaScript semplici, nessuna dipendenza esterna, nessuna build, nessun test automatico. Per provarla si apre [index.html](index.html) nel browser (anche da disco, `file://`).

File:
- [index.html](index.html): markup e piccolo script nell'`<head>` che applica il tema prima del rendering (deve restare inline, per evitare lampi).
- [style.css](style.css): tutto il CSS.
- [icons.js](icons.js): dati delle icone (`BRAND_ICONS`, `GENERIC_ICONS`), costanti globali caricate prima di app.js.
- [app.js](app.js): tutta la logica, in un'unica IIFE.

Gli script sono classici, non moduli ES: `import`/`export` non funzionano aprendo la pagina da `file://` in molti browser.

Lingue:
- **Commenti nel codice** e documentazione: in italiano.
- **Interfaccia principale**: multilingua tramite l'oggetto `I18N` (it, en, fr, de, es). Ogni nuovo testo visibile va aggiunto a tutte le lingue, non scritto direttamente nel markup o nel codice.
- **Preferenze** (finestra, messaggi di errore, etichette dei motori e dei colori): sempre in inglese, testi scritti direttamente.

## Struttura del codice

1. `style.css`: variabili CSS del tema in `:root`, ripetute identiche sia in `@media (prefers-color-scheme: dark)` sia in `:root[data-theme="dark"]` (se cambi un colore scuro, cambialo in entrambi i blocchi). Seguono le sezioni marcate da commenti `/* ---------- Nome ---------- */`, poi zoom per schermi grandi e breakpoint responsive (1250 px, 900 px, 700 px per le preferenze).
2. `index.html`, `<script>` nell'head: applica il tema salvato prima del rendering, per evitare lampi.
3. `index.html`, markup: `.hero` (data, SVG del sole, orologio analogico SVG), `.cal-block`, `.rail` (ricerche e collegamenti), `.yearbar` (linea dell'anno), pulsante `.gear` e `<dialog class="prefs">`.
4. `app.js`, in un'unica IIFE divisa in sezioni con commenti `// ---------- Nome ----------`:
   - Lingue: `I18N`, `resolveLanguage` (da "auto" alla prima lingua del browser disponibile, altrimenti inglese), `applyLanguage` (imposta `T`, `LOCALE`, `DOW`, `lang`, titolo ed etichette ARIA), `fmtText` per i segnaposto `{0}`. Date, mesi e giorni vengono da `Intl` con `LOCALE`
   - Festività italiane (`easter`, `holidays` con cache per anno): la mappa contiene chiavi (`christmas`, …) tradotte con `T.holidays`
   - Utility (`isoWeek`, `dayOfYear`, `key`)
   - Sole (`sunElevation`, `renderSunDay`, `renderSunDot`), con le coordinate prese da `settings.location`. `renderSunDay` campiona l'ora dell'orologio con `new Date(a, m, g, 0, minuti)` per gestire il cambio dell'ora legale
   - Marcatori annuali: `markersSvg` considera anche l'occorrenza iniziata l'anno prima, per i periodi a cavallo di capodanno
   - Orologio analogico (`renderAnalog`, animato con `requestAnimationFrame`)
   - Calendari (`monthCalendar`, `renderCalendars`, `centerTodayCircle`)
   - Linea dell'anno (`renderYear`, `markersSvg`, `bracePath`, `MARKER_COLORS`), ridisegnata da un `ResizeObserver` perché le parentesi dei periodi sono in pixel
   - Preferenze (`DEFAULTS`, `ENGINES`, `loadSettings`/`saveSettings`, `applySettings`, finestra con bozza `draft`, validazione in `submit`). La posizione (`location: { name, lat, lon }`) ha campi fissi nel form, identificati da `name` e non da `data-field`; `parseCoord` accetta virgola o punto; `findPlace` cerca le coordinate dal nome con l'API di geocodifica di Open-Meteo (cerca solo la parte prima della virgola e salva il nome come "Città, Regione"); `locNameEdited` la fa partire al salvataggio se il nome è cambiato senza aggiornare le coordinate
   - Icone dei collegamenti e dei motori di ricerca: `BRAND_ICONS` e `GENERIC_ICONS` (da Tabler Icons 3.50.0, contorno; id → [nome, contenuto SVG]), unite in `LINK_ICONS`. `brandFor` riconosce il marchio confrontando "dominio/percorso" con `BRAND_HOSTS` (voci specifiche prima, es. Gmail prima di Google); `genericFor` sceglie un'icona generica dalle parole chiave. Il campo `icon` di collegamenti e ricerche vale "auto", "favicon" o un id di `LINK_ICONS`; `resolveLinkIcon(item, fallback)` decide (l'icona generica di ripiego è "link" per i collegamenti, "search" per i motori), `linkIconHtml` produce il markup (favicon se già in memoria) e `itemIcon` crea l'elemento per la pagina, scaricando la favicon quando serve. I campi di ricerca non hanno titolo: l'icona sta al posto della lente e il nome è nel segnaposto e in `aria-label`. Nelle preferenze `iconPanel(kind, item, i)` è il pannello a griglia filtrabile, uno solo aperto alla volta (`iconPicker` = "search:i" o "link:i"); righe e pannello hanno `data-kind` e `data-index`. Il pannello è un fratello della riga in `#pref-searches`/`#pref-links`, quindi le righe si leggono con `:scope > .row`. Per aggiungere un'icona: scarica l'SVG di Tabler, togli l'involucro `<svg>` e il percorso `M0 0h24v24H0z`, aggiungila alla tabella e, se è un marchio, a `BRAND_HOSTS`
   - Favicon dei collegamenti: `loadFavicon` scarica l'icona da icon.horse (ha CORS, quindi i pixel si possono leggere; l'intestazione `X-Icon-Fallback: true` indica un'icona generata con una lettera, che viene scartata); `toMask` la converte su canvas in una sagoma alfa a 64 px, usata come `mask` CSS su `.favicon` con il colore del tema. Cache in `localStorage` (`startpage-favicons`, per dominio): 30 giorni se trovata, nuovo tentativo dopo un giorno se no; `pruneFavicons` toglie i domini non più usati. In mancanza resta l'icona generica
   - Favicon della pagina disegnata su canvas col giorno del mese
   - `renderDay` ridisegna data, calendari, linea dell'anno, sole e favicon: la chiamano `applySettings` e il controllo ogni secondo al cambio di giorno; il pallino del sole si aggiorna ogni 30 s
   - Scorciatoie da tastiera per i campi di ricerca

## Convenzioni

- Preferenze in `localStorage` con chiave `startpage-settings`. Se aggiungi un campo: mettilo in `DEFAULTS`, validalo in `loadSettings`, gestiscilo in `renderDraft`, nel listener `input` e nel `submit` del form.
- Testo inserito dall'utente nell'SVG passa da `escapeXml`; nel DOM usa `textContent` o `.value`, non `innerHTML`.
- Colori sempre tramite variabili CSS, così funzionano in entrambi i temi.
- La pagina deve restare utilizzabile senza rete. Chiamate esterne: la ricerca della località nelle preferenze (su richiesta; le coordinate si possono sempre inserire a mano) e le favicon dei collegamenti da icon.horse, solo per i siti senza icona di marchio (con l'icona generica come ripiego). Ogni nuova chiamata deve avere un ripiego che funzioni offline.
- Nessun riferimento personale o aziendale nei valori predefiniti (`DEFAULTS`): solo servizi generici. I collegamenti personali li inserisce l'utente dalle preferenze.

## Documentazione: tienila aggiornata

Dopo ogni modifica al progetto, verifica e aggiorna nella stessa sessione:

- [README.md](README.md): funzionalità visibili all'utente, preferenze, scorciatoie, costanti personalizzabili, layout.
- questo file: struttura del codice, sezioni, funzioni chiave e convenzioni.

Se la modifica non tocca nulla di documentato, non serve cambiare i file.
