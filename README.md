# Startpage

Pagina iniziale personale per il browser, in italiano: un unico file [index.html](index.html) senza dipendenze, build o server. Basta aprirlo nel browser o impostarlo come pagina iniziale / nuova scheda.

## Cosa mostra

- **Data di oggi** in grande, in formato esteso (es. "lunedì 24 novembre 2026").
- **Grafico del sole**: la curva dell'elevazione solare nella giornata, con orari di alba e tramonto e un pallino sulla posizione attuale. Calcolata localmente per Faenza (RA).
- **Orologio analogico** con lancetta dei secondi a movimento continuo.
- **Due calendari**: mese corrente e successivo, con numero della settimana ISO, weekend, giorni passati, oggi evidenziato e festività nazionali italiane (Pasqua e Pasquetta comprese) elencate sotto ogni mese.
- **Campi di ricerca** configurabili, ognuno con una scorciatoia da tastiera.
- **Collegamenti rapidi** con icona scelta in automatico in base a nome o indirizzo.
- **Linea dell'anno** in fondo: giorni trascorsi e rimanenti, rombi all'inizio di ogni mese e marcatori personali (giorni singoli come spilli, periodi come parentesi graffe con descrizione).
- **Favicon** che mostra il giorno del mese, come un foglio di calendario.

## Preferenze

Il pulsante a ingranaggio in basso a destra apre le preferenze:

| Sezione | Cosa si imposta |
| --- | --- |
| Tema | Sistema, Chiaro o Scuro (anteprima immediata) |
| Ricerca | Motore predefinito (DuckDuckGo, Google, Wikipedia, YouTube, DeepL, …) o indirizzo personalizzato con `%s` al posto del testo; etichetta; tasto scorciatoia |
| Collegamenti | Etichetta e indirizzo, con riordino e rimozione (predefiniti: Gmail, Outlook, Drive, Mastodon) |
| Marcatori | Data di inizio, data di fine facoltativa, nome, colore, ripetizione ogni anno; opzione per mostrare le festività nazionali sulla linea dell'anno |

Le preferenze sono salvate nel `localStorage` del browser con la chiave `startpage-settings`: restano su quel browser e quel dispositivo. "Ripristina predefiniti" torna alla configurazione iniziale.

## Scorciatoie da tastiera

- All'apertura il cursore è già nel primo campo di ricerca.
- Il tasto assegnato a un motore (predefiniti: `d` DuckDuckGo, `w` Wikipedia) porta al relativo campo, quando non si sta già scrivendo.
- `Esc` esce dal campo di ricerca o chiude le preferenze senza salvare.

## Personalizzazioni nel codice

Alcune impostazioni non sono nelle preferenze e si cambiano direttamente in [index.html](index.html):

- `LATITUDE` / `LONGITUDE`: posizione per il calcolo di alba, tramonto e percorso del sole.
- `LOCALE`: lingua per date e nomi dei mesi (`it-IT`).
- `DEFAULTS`: ricerche, collegamenti e marcatori iniziali.
- `ENGINES`: elenco dei motori di ricerca proposti.
- `holidays()`: elenco delle festività.
- `MARKER_COLORS`: colori disponibili per i marcatori.
- Variabili CSS in `:root`: palette dei temi chiaro e scuro.

## Layout

- Desktop: data, grafico del sole e orologio in alto; calendari a sinistra e ricerche/collegamenti a destra; linea dell'anno in fondo.
- Sotto 1250 px l'orologio scompare e le colonne si impilano; sotto 900 px sparisce anche il grafico del sole e i calendari vanno uno sotto l'altro.
- Sopra 2000 px (es. monitor 27" QHD) tutta la pagina viene ingrandita in proporzione.
