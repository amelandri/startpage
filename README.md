# Startpage

Pagina iniziale personale per il browser, senza dipendenze, build o server. Basta aprire [index.html](index.html) nel browser o impostarlo come pagina iniziale / nuova scheda; gli altri file ([style.css](style.css), [icons.js](icons.js), [app.js](app.js)) devono stare nella stessa cartella.

L'interfaccia principale è disponibile in italiano, inglese, francese, tedesco e spagnolo; di default segue la lingua del browser. Le preferenze sono sempre in inglese.

## Cosa mostra

- **Data di oggi** in grande, in formato esteso (es. "lunedì 24 novembre 2026").
- **Grafico del sole**: la curva dell'elevazione solare nella giornata, con orari di alba e tramonto e un pallino sulla posizione attuale. Calcolata localmente, senza rete, per la località scelta nelle preferenze.
- **Orologio analogico** con lancetta dei secondi a movimento continuo.
- **Due calendari**: mese corrente e successivo, con numero della settimana ISO, weekend, giorni passati, oggi evidenziato e festività nazionali italiane (Pasqua e Pasquetta comprese) elencate sotto ogni mese. Le festività sono sempre quelle italiane, con il nome tradotto nella lingua scelta.
- **Campi di ricerca** configurabili, ognuno con una scorciatoia da tastiera. Non hanno un titolo: dentro il campo ci sono l'icona del motore (scelta come per i collegamenti, con la lente come ripiego) e il testo "Cerca su …".
- **Collegamenti rapidi** con icone monocromatiche nel colore del tema. In automatico:
  1. se l'indirizzo è di un servizio noto (Gmail, Drive, GitHub, Mastodon, YouTube, Teams, … circa 80) si usa la sua icona di marchio, inclusa nella pagina;
  2. altrimenti la favicon del sito resa monocromatica, scaricata da [icon.horse](https://icon.horse) e conservata nel browser per 30 giorni;
  3. se manca anche quella (sito senza icona o pagina senza rete), un'icona generica scelta in base a nome o indirizzo.

  Nelle preferenze si può scegliere l'icona di ogni collegamento e di ogni motore di ricerca. Le icone sono di [Tabler Icons](https://tabler.io/icons) (licenza MIT).
- **Linea dell'anno** in fondo: giorni trascorsi e rimanenti, rombi all'inizio di ogni mese e marcatori personali (giorni singoli come spilli, periodi come parentesi graffe con descrizione). Passando il mouse su uno spillo compare subito sopra di esso un riquadro con il nome e i giorni mancanti nel formato `20g [12]`: 20 giorni, di cui 12 lavorativi (dal lunedì al venerdì, festività escluse, senza contare oggi e il giorno del marcatore); per oggi indica "oggi", per le date passate quanti giorni fa. I periodi non hanno tooltip: la loro descrizione è già scritta sotto la parentesi.
- **Favicon** che mostra il giorno del mese, come un foglio di calendario.

## Preferenze

Il pulsante a ingranaggio in basso a destra apre le preferenze:

| Sezione | Cosa si imposta |
| --- | --- |
| Language | Automatic (lingua del browser), Italiano, English, Français, Deutsch, Español |
| Theme | System, Light o Dark (anteprima immediata) |
| Location | Nome, latitudine e longitudine per alba e tramonto (predefinita: Roma). "Find" (o Invio nel nome) trova le coordinate della località tramite il servizio di geocodifica di [Open-Meteo](https://open-meteo.com/); se si cambia il nome e si salva senza cercare, la ricerca parte da sola. Serve la rete solo per la ricerca |
| Search | Motore predefinito (DuckDuckGo, Google, Wikipedia, YouTube, DeepL, …) o indirizzo personalizzato con `%s` al posto del testo; icona (stessa griglia dei collegamenti); etichetta; tasto scorciatoia |
| Links | Icona, etichetta e indirizzo, con riordino e rimozione (predefiniti: Gmail, Outlook, Drive, Mastodon). Cliccando l'icona si apre una griglia filtrabile: "Automatic", "Site icon" (favicon) o una delle icone di marchio e generiche |
| Markers | Data di inizio, data di fine facoltativa, nome, colore, ripetizione ogni anno (anche per periodi a cavallo di capodanno) |

Le preferenze sono salvate nel `localStorage` del browser con la chiave `startpage-settings` (le favicon in `startpage-favicons`): restano su quel browser e quel dispositivo. "Restore defaults" torna alla configurazione iniziale.

## Scorciatoie da tastiera

- All'apertura il cursore è già nel primo campo di ricerca.
- Il tasto assegnato a un motore (predefiniti: `d` DuckDuckGo, `w` Wikipedia) porta al relativo campo, quando non si sta già scrivendo.
- `Esc` esce dal campo di ricerca o chiude le preferenze senza salvare.

## Personalizzazioni nel codice

Alcune impostazioni non sono nelle preferenze e si cambiano direttamente nel codice, in [app.js](app.js) (le icone in [icons.js](icons.js), i colori in [style.css](style.css)):

- `I18N`: testi dell'interfaccia principale per ogni lingua; per aggiungerne una basta un nuovo blocco con le stesse chiavi.
- `DEFAULTS`: ricerche, collegamenti, marcatori e posizione iniziali.
- `ENGINES`: elenco dei motori di ricerca proposti.
- `holidays()`: elenco delle festività.
- `MARKER_COLORS`: colori disponibili per i marcatori.
- `BRAND_ICONS`, `GENERIC_ICONS` e `BRAND_HOSTS`: icone disponibili per i collegamenti e domini riconosciuti in automatico.
- Variabili CSS in `:root`: palette dei temi chiaro e scuro.

## Layout

- Desktop: data, grafico del sole e orologio in alto; calendari a sinistra e ricerche/collegamenti a destra; linea dell'anno in fondo.
- Sotto 1250 px l'orologio scompare e le colonne si impilano; sotto 900 px sparisce anche il grafico del sole e i calendari vanno uno sotto l'altro.
- Sopra 2000 px (es. monitor 27" QHD) tutta la pagina viene ingrandita in proporzione.
