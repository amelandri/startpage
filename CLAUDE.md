# CLAUDE.md

Guida per Claude Code a questo repository.

## Progetto

Startpage personale per il browser. Tutto sta in un solo file, [index.html](index.html): HTML, CSS e JavaScript inline, nessuna dipendenza esterna, nessuna build, nessun test automatico. Per provarlo si apre il file nel browser.

Interfaccia, testi e commenti nel codice sono in **italiano**: mantieni la stessa lingua.

## Struttura di index.html

1. `<style>`: variabili CSS del tema in `:root`, ripetute identiche sia in `@media (prefers-color-scheme: dark)` sia in `:root[data-theme="dark"]` (se cambi un colore scuro, cambialo in entrambi i blocchi). Seguono le sezioni marcate da commenti `/* ---------- Nome ---------- */`, poi zoom per schermi grandi e breakpoint responsive (1250 px, 900 px, 700 px per le preferenze).
2. `<script>` nell'head: applica il tema salvato prima del rendering, per evitare lampi.
3. Markup: `.hero` (data, SVG del sole, orologio analogico SVG), `.cal-block`, `.rail` (ricerche e collegamenti), `.yearbar` (linea dell'anno), pulsante `.gear` e `<dialog class="prefs">`.
4. `<script>` finale in un'unica IIFE, divisa in sezioni con commenti `// ---------- Nome ----------`:
   - Festività italiane (`easter`, `holidays` con cache per anno)
   - Utility (`isoWeek`, `dayOfYear`, `key`)
   - Sole (`sunElevation`, `renderSunDay`, `renderSunDot`), con le coordinate prese da `settings.location`. `renderSunDay` campiona l'ora dell'orologio con `new Date(a, m, g, 0, minuti)` per gestire il cambio dell'ora legale
   - Marcatori annuali: `markersSvg` considera anche l'occorrenza iniziata l'anno prima, per i periodi a cavallo di capodanno
   - Orologio analogico (`renderAnalog`, animato con `requestAnimationFrame`)
   - Calendari (`monthCalendar`, `renderCalendars`, `centerTodayCircle`)
   - Linea dell'anno (`renderYear`, `markersSvg`, `bracePath`, `MARKER_COLORS`), ridisegnata da un `ResizeObserver` perché le parentesi dei periodi sono in pixel
   - Preferenze (`DEFAULTS`, `ENGINES`, `loadSettings`/`saveSettings`, `applySettings`, finestra con bozza `draft`, validazione in `submit`). La posizione (`location: { name, lat, lon }`) ha campi fissi nel form, identificati da `name` e non da `data-field`; `parseCoord` accetta virgola o punto; `findPlace` cerca le coordinate dal nome con l'API di geocodifica di Open-Meteo (cerca solo la parte prima della virgola e salva il nome come "Città, Regione"); `locNameEdited` la fa partire al salvataggio se il nome è cambiato senza aggiornare le coordinate
   - Favicon disegnata su canvas col giorno del mese
   - Loop: `tick()` ogni secondo ridisegna tutto solo al cambio di giorno; il pallino del sole ogni 30 s
   - Scorciatoie da tastiera per i campi di ricerca

## Convenzioni

- Preferenze in `localStorage` con chiave `startpage-settings`. Se aggiungi un campo: mettilo in `DEFAULTS`, validalo in `loadSettings`, gestiscilo in `renderDraft`, nel listener `input` e nel `submit` del form.
- Testo inserito dall'utente nell'SVG passa da `escapeXml`; nel DOM usa `textContent` o `.value`, non `innerHTML`.
- Colori sempre tramite variabili CSS, così funzionano in entrambi i temi.
- La pagina deve restare utilizzabile senza rete. L'unica chiamata esterna è la ricerca della località nelle preferenze, su richiesta; le coordinate si possono sempre inserire a mano.
- Nessun riferimento personale o aziendale nei valori predefiniti (`DEFAULTS`): solo servizi generici. I collegamenti personali li inserisce l'utente dalle preferenze.

## Documentazione: tienila aggiornata

Dopo ogni modifica al progetto, verifica e aggiorna nella stessa sessione:

- [README.md](README.md): funzionalità visibili all'utente, preferenze, scorciatoie, costanti personalizzabili, layout.
- questo file: struttura del codice, sezioni, funzioni chiave e convenzioni.

Se la modifica non tocca nulla di documentato, non serve cambiare i file.
