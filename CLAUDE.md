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
3. `index.html`, markup: `.hero` (data, SVG del sole, orologio analogico SVG), `.cal-block` (calendari e `.cal-nav`), `.rail` (ricerche e collegamenti), `.yearbar` (`#year-caption`, linea dell'anno, `#year-tip`), pulsante `.gear` e `<dialog class="prefs">`.
4. `app.js`, in un'unica IIFE divisa in sezioni con commenti `// ---------- Nome ----------`:
   - Lingue: `I18N`, `resolveLanguage` (da "auto" alla prima lingua del browser disponibile, altrimenti inglese), `applyLanguage` (imposta `T`, `LOCALE`, `DOW`, `lang`, titolo ed etichette ARIA), `fmtText` per i segnaposto `{0}`. Date, mesi e giorni vengono da `Intl` con `LOCALE`
   - Festività italiane (`easter`, `holidays` con cache per anno): la mappa contiene chiavi (`christmas`, …) tradotte con `T.holidays`
   - Utility (`isoWeek`, `dayOfYear`, `key`)
   - Sole (`sunElevation`, `renderSunDay`, `renderSunDot`), con le coordinate prese da `settings.location`. `renderSunDay` campiona l'ora dell'orologio con `new Date(a, m, g, 0, minuti)` per gestire il cambio dell'ora legale
   - Marcatori annuali: `markerOccurrences(a, b)` restituisce le occorrenze `{ mk, start, end }` che toccano l'intervallo (usata da `markersSvg` e dai calendari) e considera anche l'occorrenza iniziata l'anno prima, per i periodi a cavallo di capodanno
   - Orologio analogico (`renderAnalog`, animato con `requestAnimationFrame`)
   - Calendari (`monthCalendar`, `renderCalendars`, `centerTodayCircle`). Navigazione: `calOffset` (mesi dal mese corrente, non salvato) sposta i due mesi mostrati; `moveCalendars(delta)` risponde a `#cal-prev`, `#cal-next` e `#cal-today` (0 = torna al mese corrente; visibile solo se `calOffset` ≠ 0, testi `T.calPrev`, `T.calNext`, `T.calToday` impostati in `applyLanguage`) e ridisegna la linea se cambia `viewYear(now)`, l'anno del primo mese mostrato. `monthCalendar` mostra anche i marcatori (da `markerOccurrences`): `<i class="cal-dot">` per i giorni singoli, `<i class="cal-bar">` per ogni giorno di un periodo (`.s`/`.e` nel primo/ultimo giorno, `--lane` per i periodi sovrapposti nel mese), con `data-tip` da `markerTip`. Le festività non hanno segni sotto il numero: solo il colore e il nome sotto il mese. Il tooltip è lo stesso `#year-tip` della linea, con un listener `pointerover` su `#calendars`
   - Linea dell'anno (`renderYear`, `markersSvg`, `bracePath`, `MARKER_COLORS`), ridisegnata da un `ResizeObserver` perché le parentesi dei periodi sono in pixel. Anno mostrato: `viewYear(now)` (quello dei calendari) se non è ingrandita, altrimenti sempre l'anno corrente; in un altro anno `done` vale 0 o `total`, il pallino di oggi non c'è (`toggleYearZoom` controlla che esista prima del focus) e `#year-caption` mostra l'anno. Zoom: `yearZoom` sceglie il primo giorno visibile `from` (0, oppure oggi); posizioni con `pos(d) = (d - from) / (total - from)`, passato a `markersSvg`, che scarta ciò che finisce prima di `from` e fa partire da oggi i periodi in corso. Il pallino di oggi è un `<g class="today" role="button">` con area di clic più grande (`.today-hit`); `toggleYearZoom` risponde a clic, Invio e Spazio; le etichette sono `T.zoomIn`/`T.zoomOut`. La vista iniziale viene dalla preferenza `yearView` ("year" o "today"): `applySettings` imposta `yearZoom` solo all'avvio e quando `yearView` cambia (`appliedYearView`), così salvare altre preferenze non annulla lo zoom scelto col clic. Con lo zoom e al massimo `DAY_TICKS_MAX` (60) giorni visibili, `dayTicksSvg` disegna una tacca per giorno e i numeri del mese con passo 1/2/5/10 scelto perché ognuno abbia almeno `DAY_LABEL_PX`; il giorno 1 ha la precedenza e i numeri troppo vicini vengono saltati. Restituisce `{ back, front }`: `back` sono le fasce dei fine settimana (`.weekend-band`, una per gruppo di giorni consecutivi, centrate sulle tacche), messe prima della linea così restano sotto; `front` tacche e numeri. In quel caso le parentesi dei periodi scendono di `DAY_TICKS_H` (parametro `shift` di `markersSvg`). Tooltip dei marcatori: `markerTip` calcola il testo (giorni e giorni lavorativi con `isWorkday`, testo "08/12 Nome 20g (12 lavorativi)" con la data da `Intl`, per i periodi "18/12–22/12 Nome …" e "oggi" se in corso e le forme [singolare, plurale] di `T.left` (scelte sui lavorativi) e `T.daysAgo`, tramite `plural` e `Intl.PluralRules`), salvato in `data-tip` sul `<g class="marker">`; nei periodi più stretti di `BRACE_MIN_PX` (40 px, misurati sulla larghezza attuale quindi dipendono dallo zoom) `markersSvg` disegna al posto della graffa uno spillo verso il basso al centro, con la punta alla stessa altezza; tratto colorato, corsia ed etichetta non cambiano; `showYearTip` posiziona `#year-tip` (colori del tema, freccia fatta con un quadratino ruotato sovrapposto al bordo) sopra lo spillo (o sopra il segno del calendario), tenendolo nei bordi; sulla linea solo gli spilli hanno `data-tip`, i periodi non hanno tooltip; `tipFor` evita di ripetere il calcolo passando tra pallino e stelo dello stesso spillo. Niente `<title>` SVG: il tooltip nativo compare in ritardo
   - Preferenze (`DEFAULTS`, `ENGINES`, `normalizeSettings` (valida un oggetto e completa con i predefiniti), `loadSettings`/`saveSettings`, `applySettings`, finestra con bozza `draft`, validazione in `submit`). Esportazione e importazione: `exportSettings` scarica `{ app: "startpage", version: 1, exported, settings }` con le preferenze salvate (non la bozza); l'input nascosto `#import-file` legge un file in questo formato o l'oggetto delle preferenze da solo, lo passa a `normalizeSettings` e lo mette nella bozza, che va salvata con Save. I messaggi informativi in `#prefs-error` usano la classe `.info` (tolta da `renderDraft` e dagli errori). La posizione (`location: { name, lat, lon }`) ha campi fissi nel form, identificati da `name` e non da `data-field`; `parseCoord` accetta virgola o punto; `findPlace` cerca le coordinate dal nome con l'API di geocodifica di Open-Meteo (cerca solo la parte prima della virgola e salva il nome come "Città, Regione"); `locNameEdited` la fa partire al salvataggio se il nome è cambiato senza aggiornare le coordinate
   - Icone dei collegamenti e dei motori di ricerca: `BRAND_ICONS` e `GENERIC_ICONS` (da Tabler Icons 3.50.0, contorno; id → [nome, contenuto SVG]), unite in `LINK_ICONS`. `brandFor` riconosce il marchio confrontando "dominio/percorso" con `BRAND_HOSTS` (voci specifiche prima, es. Gmail prima di Google); `genericFor` sceglie un'icona generica dalle parole chiave. Il campo `icon` di collegamenti e ricerche vale "auto", "favicon" o un id di `LINK_ICONS`; `resolveLinkIcon(item, fallback)` decide (l'icona generica di ripiego è "link" per i collegamenti, "search" per i motori), `linkIconHtml` produce il markup (favicon se già in memoria) e `itemIcon` crea l'elemento per la pagina, scaricando la favicon quando serve. I campi di ricerca non hanno titolo: l'icona sta al posto della lente e il nome è nel segnaposto e in `aria-label`. Nelle preferenze `iconPanel(kind, item, i)` è il pannello a griglia filtrabile, uno solo aperto alla volta (`iconPicker` = "search:i" o "link:i"); righe e pannello hanno `data-kind` e `data-index`. Il pannello è un fratello della riga in `#pref-searches`/`#pref-links`, quindi le righe si leggono con `:scope > .row`. Per aggiungere un'icona: scarica l'SVG di Tabler, togli l'involucro `<svg>` e il percorso `M0 0h24v24H0z`, aggiungila alla tabella e, se è un marchio, a `BRAND_HOSTS`
   - Favicon dei collegamenti: `loadFavicon` scarica l'icona da icon.horse (ha CORS, quindi i pixel si possono leggere; l'intestazione `X-Icon-Fallback: true` indica un'icona generata con una lettera, che viene scartata); `toMask` la converte su canvas in una sagoma alfa a 64 px, usata come `mask` CSS su `.favicon` con il colore del tema. Cache in `localStorage` (`startpage-favicons`, per dominio): 30 giorni se trovata, nuovo tentativo dopo un giorno se no; `pruneFavicons` toglie i domini non più usati. In mancanza resta l'icona generica
   - Favicon della pagina disegnata su canvas col giorno del mese
   - `renderDay` ridisegna data, calendari, linea dell'anno, sole e favicon: la chiamano `applySettings` e il controllo ogni secondo al cambio di giorno; il pallino del sole si aggiorna ogni 30 s
   - Scorciatoie da tastiera per i campi di ricerca

## Convenzioni

- Preferenze in `localStorage` con chiave `startpage-settings`. Se aggiungi un campo: mettilo in `DEFAULTS`, validalo in `normalizeSettings` (e aggiungilo all'elenco `known` dell'importazione), gestiscilo in `renderDraft`, nel listener `input` e nel `submit` del form.
- Testo inserito dall'utente nell'SVG passa da `escapeXml`; nel DOM usa `textContent` o `.value`, non `innerHTML`.
- Colori sempre tramite variabili CSS, così funzionano in entrambi i temi.
- La pagina deve restare utilizzabile senza rete. Chiamate esterne: la ricerca della località nelle preferenze (su richiesta; le coordinate si possono sempre inserire a mano) e le favicon dei collegamenti da icon.horse, solo per i siti senza icona di marchio (con l'icona generica come ripiego). Ogni nuova chiamata deve avere un ripiego che funzioni offline.
- Nessun riferimento personale o aziendale nei valori predefiniti (`DEFAULTS`): solo servizi generici. I collegamenti personali li inserisce l'utente dalle preferenze.

## Documentazione: tienila aggiornata

Dopo ogni modifica al progetto, verifica e aggiorna nella stessa sessione:

- [README.md](README.md): funzionalità visibili all'utente, preferenze, scorciatoie, costanti personalizzabili, layout.
- questo file: struttura del codice, sezioni, funzioni chiave e convenzioni.

Se la modifica non tocca nulla di documentato, non serve cambiare i file.
