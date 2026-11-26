(() => {
  // ---------- Lingue dell'interfaccia principale ----------
  // Le preferenze sono sempre in inglese. Date, mesi e giorni vengono da Intl;
  // qui ci sono solo i testi. {0}, {1} sono sostituiti dai valori.
  const I18N = {
    it: {
      name: "Italiano", title: "Home", prefs: "Preferenze", links: "Collegamenti",
      searchOn: "Cerca su {0}", noHolidays: "Nessuna festività",
      sun: "Alba {0} · tramonto {1}", year: "{0} giorni trascorsi · {1} rimanenti", yearAria: "Avanzamento dell'anno", zoomIn: "Mostra da oggi a fine anno", zoomOut: "Mostra tutto l'anno",
      left: ["{0}g ({1} lavorativo)", "{0}g ({1} lavorativi)"], daysAgo: ["{0} giorno fa", "{0} giorni fa"], today: "oggi",
      holidays: { newYear: "Capodanno", epiphany: "Epifania", liberation: "Festa della Liberazione",
        labour: "Festa dei Lavoratori", republic: "Festa della Repubblica", assumption: "Ferragosto",
        francis: "San Francesco d'Assisi", allSaints: "Ognissanti", immaculate: "Immacolata Concezione",
        christmas: "Natale", stephen: "Santo Stefano", easter: "Pasqua", easterMonday: "Lunedì dell'Angelo" }
    },
    en: {
      name: "English", title: "Home", prefs: "Preferences", links: "Links",
      searchOn: "Search {0}", noHolidays: "No holidays",
      sun: "Sunrise {0} · sunset {1}", year: "{0} days passed · {1} left", yearAria: "Year progress", zoomIn: "Show from today to year end", zoomOut: "Show the whole year",
      left: ["{0}d ({1} working day)", "{0}d ({1} working days)"], daysAgo: ["{0} day ago", "{0} days ago"], today: "today",
      holidays: { newYear: "New Year's Day", epiphany: "Epiphany", liberation: "Liberation Day",
        labour: "Labour Day", republic: "Republic Day", assumption: "Assumption Day",
        francis: "St Francis of Assisi", allSaints: "All Saints' Day", immaculate: "Immaculate Conception",
        christmas: "Christmas Day", stephen: "St Stephen's Day", easter: "Easter", easterMonday: "Easter Monday" }
    },
    fr: {
      name: "Français", title: "Accueil", prefs: "Préférences", links: "Liens",
      searchOn: "Rechercher sur {0}", noHolidays: "Aucun jour férié",
      sun: "Lever {0} · coucher {1}", year: "{0} jours écoulés · {1} restants", yearAria: "Avancement de l'année", zoomIn: "Afficher d'aujourd'hui à la fin de l'année", zoomOut: "Afficher toute l'année",
      left: ["{0}j ({1} jour ouvré)", "{0}j ({1} jours ouvrés)"], daysAgo: ["il y a {0} jour", "il y a {0} jours"], today: "aujourd'hui",
      holidays: { newYear: "Jour de l'An", epiphany: "Épiphanie", liberation: "Fête de la Libération",
        labour: "Fête du Travail", republic: "Fête de la République", assumption: "Assomption",
        francis: "Saint François d'Assise", allSaints: "Toussaint", immaculate: "Immaculée Conception",
        christmas: "Noël", stephen: "Saint-Étienne", easter: "Pâques", easterMonday: "Lundi de Pâques" }
    },
    de: {
      name: "Deutsch", title: "Startseite", prefs: "Einstellungen", links: "Links",
      searchOn: "Auf {0} suchen", noHolidays: "Keine Feiertage",
      sun: "Sonnenaufgang {0} · Sonnenuntergang {1}", year: "{0} Tage vergangen · {1} übrig", yearAria: "Jahresfortschritt", zoomIn: "Von heute bis Jahresende anzeigen", zoomOut: "Ganzes Jahr anzeigen",
      left: ["{0}T ({1} Arbeitstag)", "{0}T ({1} Arbeitstage)"], daysAgo: ["vor {0} Tag", "vor {0} Tagen"], today: "heute",
      holidays: { newYear: "Neujahr", epiphany: "Heilige Drei Könige", liberation: "Tag der Befreiung",
        labour: "Tag der Arbeit", republic: "Tag der Republik", assumption: "Mariä Himmelfahrt",
        francis: "Franz von Assisi", allSaints: "Allerheiligen", immaculate: "Mariä Empfängnis",
        christmas: "Weihnachten", stephen: "Stephanstag", easter: "Ostern", easterMonday: "Ostermontag" }
    },
    es: {
      name: "Español", title: "Inicio", prefs: "Preferencias", links: "Enlaces",
      searchOn: "Buscar en {0}", noHolidays: "Sin festivos",
      sun: "Amanecer {0} · atardecer {1}", year: "{0} días pasados · {1} restantes", yearAria: "Progreso del año", zoomIn: "Mostrar de hoy a fin de año", zoomOut: "Mostrar todo el año",
      left: ["{0}d ({1} día laborable)", "{0}d ({1} días laborables)"], daysAgo: ["hace {0} día", "hace {0} días"], today: "hoy",
      holidays: { newYear: "Año Nuevo", epiphany: "Epifanía", liberation: "Día de la Liberación",
        labour: "Día del Trabajo", republic: "Día de la República", assumption: "Asunción",
        francis: "San Francisco de Asís", allSaints: "Todos los Santos", immaculate: "Inmaculada Concepción",
        christmas: "Navidad", stephen: "San Esteban", easter: "Pascua", easterMonday: "Lunes de Pascua" }
    }
  };
  // lingua e locale correnti, impostati da applyLanguage()
  let T = I18N.en, LOCALE = "en", DOW = [];
  const fmtText = (s, ...v) => s.replace(/\{(\d)\}/g, (_, i) => v[i]);
  // "auto": la prima lingua del browser tra quelle disponibili, altrimenti inglese.
  // Il locale tiene la variante regionale del browser se è della stessa lingua (es. en-GB).
  function resolveLanguage(pref) {
    const browser = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    const base = l => String(l).toLowerCase().split("-")[0];
    const lang = I18N[pref] ? pref : (browser.map(base).find(l => I18N[l]) || "en");
    const locale = browser.find(l => base(l) === lang) || lang;
    return { lang, locale };
  }
  function applyLanguage(pref) {
    const { lang, locale } = resolveLanguage(pref);
    T = I18N[lang];
    LOCALE = locale;
    // giorni della settimana da lunedì (5 gennaio 2026 è un lunedì), senza il punto finale delle abbreviazioni
    DOW = Array.from({ length: 7 }, (_, i) =>
      new Date(2026, 0, 5 + i).toLocaleDateString(locale, { weekday: "short" }).replace(/\.$/, ""));
    document.documentElement.lang = lang;
    document.title = T.title;
    document.getElementById("links").setAttribute("aria-label", T.links);
    document.getElementById("year-line").setAttribute("aria-label", T.yearAria);
    const gear = document.getElementById("open-prefs");
    gear.setAttribute("aria-label", T.prefs);
    gear.title = T.prefs;
  }

  // ---------- Festività italiane ----------
  function easter(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100,
          d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
          g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
          i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
          m = Math.floor((a + 11 * h + 22 * l) / 451),
          month = Math.floor((h + l - 7 * m + 114) / 31),
          day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  const key = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const holidayCache = {};
  // la mappa contiene le chiavi delle festività; il nome tradotto è in T.holidays
  function holidays(y) {
    if (holidayCache[y]) return holidayCache[y];
    const map = {};
    const add = (m, d, id) => { map[key(new Date(y, m, d))] = id; };
    add(0, 1, "newYear");
    add(0, 6, "epiphany");
    add(3, 25, "liberation");
    add(4, 1, "labour");
    add(5, 2, "republic");
    add(7, 15, "assumption");
    add(9, 4, "francis");
    add(10, 1, "allSaints");
    add(11, 8, "immaculate");
    add(11, 25, "christmas");
    add(11, 26, "stephen");
    const e = easter(y);
    map[key(e)] = "easter";
    const em = new Date(e); em.setDate(e.getDate() + 1);
    map[key(em)] = "easterMonday";
    return (holidayCache[y] = map);
  }
  const holidayName = d => { const id = holidays(d.getFullYear())[key(d)]; return id && T.holidays[id]; };

  // ---------- Utility ----------
  function isoWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }
  function dayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    return Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86400000) + 1;
  }
  const sameDay = (a, b) => key(a) === key(b);

  // ---------- Data e ora ----------
  function renderDate(now) {
    document.getElementById("date").textContent =
      now.toLocaleDateString(LOCALE, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  // ---------- Sole ----------
  const RAD = Math.PI / 180;
  // Elevazione del sole in gradi (algoritmo semplificato, precisione ~1 minuto)
  function sunElevation(date, lat, lon) {
    const n = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = (357.528 + 0.9856003 * n) * RAD;
    const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * RAD;
    const eps = (23.439 - 0.0000004 * n) * RAD;
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) / RAD;
    const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
    const gmst = ((18.697374558 + 24.06570982441908 * n) % 24) * 15;
    const ha = (gmst + lon - ra) * RAD;
    return Math.asin(Math.sin(lat * RAD) * Math.sin(dec) +
                     Math.cos(lat * RAD) * Math.cos(dec) * Math.cos(ha)) / RAD;
  }
  // Mappa: minuti del giorno → x (0–300), elevazione → y (orizzonte a 60)
  const sunX = m => m / 1440 * 300;
  const sunY = e => 60 - e * 0.75;
  const hhmm = m => {
    m = Math.round(m) % 1440;  // arrotonda al minuto più vicino
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  };

  function renderSunDay(now) {
    let d = "", prev = null, rise = null, set = null, yMin = Infinity, yMax = -Infinity;
    for (let m = 0; m <= 1440; m += 5) {
      // m è l'ora sull'orologio (minuti dalla mezzanotte): con new Date(a, m, g, 0, m)
      // il cambio dell'ora legale è gestito, e alba e tramonto restano nell'ora giusta
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, m);
      const e = sunElevation(at, settings.location.lat, settings.location.lon);
      const y = sunY(e);
      yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
      d += (m ? "L" : "M") + sunX(m).toFixed(1) + " " + y.toFixed(1);
      if (prev) {  // alba/tramonto: centro del disco a -0,833° (rifrazione)
        const a = prev[1] + 0.833, b = e + 0.833;
        if (a < 0 && b >= 0) rise = prev[0] + 5 * (-a) / (b - a);
        if (a >= 0 && b < 0) set = prev[0] + 5 * a / (a - b);
      }
      prev = [m, e];
    }
    document.getElementById("sun-path").setAttribute("d", d);
    document.getElementById("sun-path-below").setAttribute("d", d);
    // Centra verticalmente la curva del giorno nel riquadro (d'inverno pesa in basso, d'estate in alto)
    document.getElementById("sun-g").setAttribute("transform", `translate(0 ${(50 - (yMin + yMax) / 2).toFixed(1)})`);
    const label = (id, m) => {
      const t = document.getElementById(id);
      t.textContent = m == null ? "" : hhmm(m);
      if (m != null) t.setAttribute("x", sunX(m).toFixed(1));
    };
    label("sun-rise", rise);
    label("sun-set", set);
    const place = settings.location.name;
    document.getElementById("sun-title").textContent =
      fmtText(T.sun, rise == null ? "—" : hhmm(rise), set == null ? "—" : hhmm(set)) + (place ? ` · ${place}` : "");
  }
  function renderSunDot(now) {
    const m = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const e = sunElevation(now, settings.location.lat, settings.location.lon);
    const dot = document.getElementById("sun-dot");
    dot.setAttribute("cx", sunX(m).toFixed(1));
    dot.setAttribute("cy", sunY(e).toFixed(1));
  }

  const analogBox = document.querySelector(".analog");
  const [handH, handM, handS] = ["hand-h", "hand-m", "hand-s"].map(id => document.getElementById(id));
  function renderAnalog(now) {
    if (analogBox.offsetParent === null) return;  // orologio nascosto (schermi stretti)
    const s = now.getSeconds() + now.getMilliseconds() / 1000,
          m = now.getMinutes() + s / 60,
          h = (now.getHours() % 12) + m / 60;
    const set = (el, deg) => el.setAttribute("transform", `translate(100 100) rotate(${deg})`);
    set(handH, h * 30);
    set(handM, m * 6);
    set(handS, s * 6);
  }

  // ---------- Calendari ----------
  function monthCalendar(year, month, today, isCurrent) {
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7; // lunedì = 0
    const start = new Date(year, month, 1 - offset);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const weeks = Math.ceil((offset + lastDay) / 7);

    const el = document.createElement("div");
    el.className = "cal" + (isCurrent ? " current" : "");
    const monthName = first.toLocaleDateString(LOCALE, { month: "long" });

    let html = `<div class="cal-head"><h2>${monthName}</h2><span class="year">${year}</span></div>`;
    html += `<div class="grid"><div class="dow"></div>` + DOW.map(d => `<div class="dow">${d}</div>`).join("");

    const monthHolidays = [];
    // marcatori del mese: i periodi hanno una corsia (0, 1, …) perché le barre
    // di periodi sovrapposti stiano una sopra l'altra
    const occ = markerOccurrences(first, new Date(year, month, lastDay))
      .sort((p, q) => p.start - q.start || q.end - p.end);
    const lanesEnd = [];
    occ.filter(o => +o.end !== +o.start).forEach(o => {
      let lane = lanesEnd.findIndex(e => e < o.start);
      if (lane < 0) { lane = lanesEnd.length; lanesEnd.push(0); }
      lanesEnd[lane] = o.end;
      o.lane = lane;
    });
    occ.forEach(o => { o.tip = escapeXml(markerTip(o.mk.label, o.start, o.end)); });
    const cursor = new Date(start);
    for (let w = 0; w < weeks; w++) {
      html += `<div class="wk">${isoWeek(cursor)}</div>`;
      for (let i = 0; i < 7; i++) {
        const classes = ["day"];
        const out = cursor.getMonth() !== month;
        if (out) classes.push("out");
        if (i >= 5) classes.push("weekend");
        const h = holidayName(cursor);
        if (h && !out) { classes.push("holiday"); monthHolidays.push([cursor.getDate(), h]); }
        if (sameDay(cursor, today)) classes.push("today");
        else if (cursor < today && !out) classes.push("past");
        // pallino sotto il numero per i giorni singoli, barra per i periodi
        // (con le estremità arrotondate nel primo e nell'ultimo giorno)
        let marks = "";
        if (!out) occ.forEach(o => {
          if (cursor < o.start || cursor > o.end) return;
          const st = `style="--mk: ${markerColor(o.mk.color)}` + (o.lane ? `; --lane: ${o.lane}"` : `"`);
          if (+o.end === +o.start) marks += `<i class="cal-dot" ${st} data-tip="${o.tip}"></i>`;
          else marks += `<i class="cal-bar${sameDay(cursor, o.start) ? " s" : ""}${sameDay(cursor, o.end) ? " e" : ""}" ${st} data-tip="${o.tip}"></i>`;
        });
        if (marks) classes.push("marked");
        const title = h ? ` title="${escapeXml(h)}"` : "";
        html += `<div class="${classes.join(" ")}"${title}><span>${cursor.getDate()}</span>${marks}</div>`;
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    html += `</div>`;
    html += `<div class="holidays">` + (monthHolidays.length
      ? monthHolidays.map(([d, n]) => `<span class="chip">${d} · ${escapeXml(n)}</span>`).join("")
      : T.noHolidays) + `</div>`;
    el.innerHTML = html;
    return el;
  }
  // Calcola di quanto spostare il cerchio di oggi perché sia centrato sulle cifre:
  // le cifre non hanno discendenti, quindi il loro centro visivo non coincide con
  // il centro del riquadro del testo. La misura usa il font effettivo del sistema.
  function centerTodayCircle() {
    const span = document.querySelector(".day.today span");
    if (!span) return;
    const cs = getComputedStyle(span);
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText(span.textContent);
    if (!m.fontBoundingBoxAscent) return;              // browser senza queste metriche
    // con lo zoom delle pagine grandi le misure a schermo sono ingrandite:
    // le riporto in px CSS, le stesse unità delle metriche del font
    const z = span.currentCSSZoom || 1;
    const range = document.createRange();
    range.selectNodeContents(span);
    const r = range.getBoundingClientRect();
    const lineTop = r.top / z, lineH = r.height / z;
    const fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
    const baseline = lineTop + (lineH - (fa + fd)) / 2 + fa;
    const glyphCenter = baseline + (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2;
    const b = span.getBoundingClientRect();
    const dy = Math.round((glyphCenter - (b.top + b.height / 2) / z) * 4) / 4;
    span.style.setProperty("--today-dy", dy + "px");
  }

  function renderCalendars(now) {
    const box = document.getElementById("calendars");
    box.innerHTML = "";
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    box.appendChild(monthCalendar(now.getFullYear(), now.getMonth(), today, true));
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    box.appendChild(monthCalendar(next.getFullYear(), next.getMonth(), today, false));
    centerTodayCircle();
  }

  // ---------- Avanzamento dell'anno ----------
  // Tavolozza dei marcatori: colori medi, leggibili sia sul tema chiaro sia sullo scuro
  const MARKER_COLORS = [
    { id: "grey",   label: "Grey",      css: "var(--text-2)" },
    { id: "orange", label: "Orange",    css: "var(--clock-second)" },
    { id: "red",    label: "Red",       css: "#d9534a" },
    { id: "green",  label: "Green",     css: "#2f9e6a" },
    { id: "blue",   label: "Blue",      css: "#3b82d6" },
    { id: "violet", label: "Violet",    css: "#8062d6" }
  ];
  const markerColor = id => (MARKER_COLORS.find(c => c.id === id) || MARKER_COLORS[0]).css;

  // Marcatori personali dell'anno y: bandierina all'inizio, tratto spesso per i periodi.
  // Le date sono "AAAA-MM-GG"; con yearly si usano solo mese e giorno.
  const parseYMD = v => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
  };
  // Occorrenze dei marcatori che toccano l'intervallo di date [a, b]: { mk, start, end }
  // (end = start per i giorni singoli). Per i marcatori annuali si considera anche
  // l'occorrenza iniziata l'anno prima: un periodo a cavallo di capodanno
  // (es. 20 dic – 6 gen) finisce nell'anno dopo.
  function markerOccurrences(a, b) {
    const out = [];
    settings.markers.forEach(mk => {
      const f = parseYMD(mk.from); if (!f) return;
      const t = parseYMD(mk.to);
      const years = mk.yearly ? [...new Set([a.getFullYear() - 1, a.getFullYear(), b.getFullYear()])] : [f.y];
      years.forEach(ys => {
        const start = new Date(ys, f.m, f.d);
        let end = start;
        if (t) {
          end = new Date(mk.yearly ? ys : t.y, t.m, t.d);
          if (mk.yearly && end < start) end = new Date(ys + 1, t.m, t.d);
        }
        if (end < start || end < a || start > b) return;  // non valido o fuori dall'intervallo
        out.push({ mk, start, end });
      });
    });
    return out;
  }
  const escapeXml = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Parentesi graffa orizzontale da xa a xb (px), con la punta verso il basso.
  // top = y del lato piatto, h = metà profondità, r = raggio delle curve.
  function bracePath(xa, xb, top, h) {
    const w = xb - xa, m = (xa + xb) / 2, r = Math.min(5, w / 4);
    return `M${xa} ${top} Q${xa} ${top + h} ${xa + r} ${top + h} L${m - r} ${top + h} ` +
           `Q${m} ${top + h} ${m} ${top + 2 * h} Q${m} ${top + h} ${m + r} ${top + h} ` +
           `L${xb - r} ${top + h} Q${xb} ${top + h} ${xb} ${top}`;
  }

  // Testo del tooltip di uno spillo: "08/12 Nome 20g (12 lavorativi)": data (giorno/mese
  // nell'ordine della lingua), nome, giorni mancanti e quanti di questi sono lavorativi.
  // I giorni lavorativi sono quelli tra oggi e il marcatore (esclusi entrambi),
  // dal lunedì al venerdì e senza festività. Per oggi e le date passate: "oggi",
  // "N giorni fa". Per i periodi (tooltip dei calendari) la data è "08/12–12/12"
  // e quelli in corso valgono "oggi". Sulla linea dell'anno i periodi non hanno tooltip.
  const isWorkday = d => d.getDay() % 6 !== 0 && !holidays(d.getFullYear())[key(d)];
  // forme [singolare, plurale]: sceglie in base a n, poi sostituisce i segnaposto con args
  const plural = (forms, n, ...args) =>
    fmtText(forms[new Intl.PluralRules(LOCALE).select(n) === "one" ? 0 : 1], ...(args.length ? args : [n]));
  function markerTip(label, start, end) {
    const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = (a, b) => Math.round((b - a) / 86400000);  // arrotonda: gestisce l'ora legale
    const diff = days(today, start);
    let when;
    if (diff > 0) {
      let work = 0;
      for (let d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); d < start; d.setDate(d.getDate() + 1))
        if (isWorkday(d)) work++;
      when = plural(T.left, work, diff, work);  // "20g (12 lavorativi)": singolare/plurale sui lavorativi
    } else if (diff === 0 || end >= today) when = T.today;  // oggi, o periodo in corso
    else when = plural(T.daysAgo, days(end, today));
    const dm = d => d.toLocaleDateString(LOCALE, { day: "2-digit", month: "2-digit" });  // "08/12"
    const date = +end === +start ? dm(start) : `${dm(start)}–${dm(end)}`;
    return `${date} ${label} ${when}`;
  }

  // larghezza minima (px) di un periodo per disegnarlo con la graffa; sotto la graffa
  // diventa uno spillo rivolto verso il basso (corsia ed etichetta restano le stesse)
  const BRACE_MIN_PX = 40;

  // from: primo giorno visibile (indice da 0): 0 per tutto l'anno, oggi nella vista ingrandita.
  // shift: di quanto abbassare le parentesi dei periodi (per lasciare posto alle tacche dei giorni)
  function markersSvg(y, total, width, from, shift = 0) {
    const pos = d => (d - from) / (total - from) * 100;  // indice del giorno → % della linea
    const y0 = new Date(y, 0, 1), y1 = new Date(y, 11, 31);
    // 1) calcola posizione e tipo di ogni marcatore che cade nell'anno y
    const items = [];
    markerOccurrences(y0, y1).forEach(({ mk, start, end }) => {
      const vs = start < y0 ? y0 : start, ve = end > y1 ? y1 : end;
      const d0 = dayOfYear(vs) - 1, d1 = dayOfYear(ve);   // inizio del primo giorno, fine dell'ultimo
      if (d1 <= from) return;                             // già passato (vista ingrandita)
      const x0 = pos(Math.max(d0, from)), x1 = pos(d1);   // i periodi in corso partono da oggi
      const range = +end !== +start;
      items.push({ mk, x0, x1, range, lane: 0, tip: range ? "" : markerTip(mk.label, start, end) });
    });
    // 2) periodi sovrapposti: quello che inizia dopo scende di una "corsia"
    //    (14 px: abbastanza perché anche le descrizioni non si accavallino)
    const LANE = 14, lanesEnd = [];
    items.filter(it => it.range).sort((p, q) => p.x0 - q.x0 || p.x1 - q.x1).forEach(it => {
      let lane = lanesEnd.findIndex(endX => endX < it.x0);
      if (lane < 0) { lane = lanesEnd.length; lanesEnd.push(0); }
      lanesEnd[lane] = it.x1;
      it.lane = lane;
    });
    // 3) disegno
    let out = "";
    items.forEach(({ mk, x0, x1, range, lane, tip }) => {
      // niente <title>: il tooltip nativo compare in ritardo; gli spilli hanno data-tip
      // (vedi showYearTip), i periodi nessun tooltip perché la descrizione è già visibile
      const t = escapeXml(tip);
      out += `<g class="marker" style="--mk: ${markerColor(mk.color)}"` +
             (tip ? ` data-tip="${t}" role="img" aria-label="${t}">` : ">");
      if (range) {
        // periodo: tratto colorato sulla linea, graffa sotto (o spillo verso il basso se
        // il periodo è più stretto di BRACE_MIN_PX) e descrizione sotto la punta
        const xa = x0 / 100 * width, xb = x1 / 100 * width, xm = (xa + xb) / 2, off = lane * LANE + shift;
        const yTip = 22 + off;  // y della punta della graffa
        out += `<rect class="hit" x="${Math.min(xa, xm - 5)}" y="2" width="${Math.max(xb - xa, 10)}" height="${38 + off}"/>` +
               `<line class="span" x1="${xa}" y1="4.5" x2="${xb}" y2="4.5"/>` +
               (xb - xa < BRACE_MIN_PX
                 ? `<line class="flag-stem" x1="${xm}" y1="4.5" x2="${xm}" y2="${yTip - 3}"/>` +
                   `<circle class="flag" cx="${xm}" cy="${yTip - 2.5}" r="3"/>`
                 : `<path class="brace" d="${bracePath(xa, xb, 12 + off, 5)}"/>`) +
               `<text class="brace-label" x="${xm}" y="${36 + off}">${escapeXml(mk.label)}</text></g>`;
      } else {
        // giorno singolo: spillo con un cerchio in cima, stelo di 11 px
        const stem = 11;
        out += `<svg x="${x0}%" y="4.5" overflow="visible">` +
               `<rect class="hit" x="-5" y="${-stem - 7}" width="10" height="${stem + 9}"/>` +
               `<line class="flag-stem" x1="0" y1="0" x2="0" y2="${-stem}"/>` +
               `<circle class="flag" cx="0" cy="${-stem - 2.5}" r="3"/></svg></g>`;
      }
    });
    // 4) dove due periodi si sovrappongono la linea diventa tratteggiata,
    //    alternando i colori dei due periodi (3 px ciascuno)
    const ranges = items.filter(it => it.range);
    for (let i = 0; i < ranges.length; i++)
      for (let j = i + 1; j < ranges.length; j++) {
        const a = ranges[i], b = ranges[j];
        const s0 = Math.max(a.x0, b.x0) / 100 * width, s1 = Math.min(a.x1, b.x1) / 100 * width;
        if (s1 <= s0) continue;
        out += `<g class="overlap">` +
               `<line x1="${s0}" y1="4.5" x2="${s1}" y2="4.5" style="stroke: var(--bg)"/>` +
               `<line x1="${s0}" y1="4.5" x2="${s1}" y2="4.5" style="stroke: ${markerColor(a.mk.color)}" stroke-dasharray="3 3"/>` +
               `<line x1="${s0}" y1="4.5" x2="${s1}" y2="4.5" style="stroke: ${markerColor(b.mk.color)}" stroke-dasharray="3 3" stroke-dashoffset="3"/>` +
               `</g>`;
      }
    return out;
  }

  // Tooltip degli spilli: compare subito al passaggio del mouse, sopra lo spillo,
  // senza uscire dai bordi della linea. I periodi non ne hanno.
  const yearLineEl = document.getElementById("year-line"), yearTip = document.getElementById("year-tip");
  function showYearTip(g) {
    yearTip.textContent = g.dataset.tip;
    yearTip.hidden = false;
    const bar = yearTip.offsetParent;            // .yearbar
    const z = bar.currentCSSZoom || 1;           // zoom degli schermi grandi: misure in px CSS
    const b = bar.getBoundingClientRect();
    const r = (g.querySelector(".flag") || g).getBoundingClientRect();  // pallino dello spillo, o segno del calendario
    const cx = (r.left + r.width / 2 - b.left) / z;
    const w = yearTip.offsetWidth, W = bar.clientWidth;
    const left = Math.min(Math.max(cx, w / 2), W - w / 2);
    yearTip.style.left = left + "px";
    yearTip.style.top = (r.top - b.top) / z - 9 + "px";  // spazio per la freccia
    yearTip.style.setProperty("--ax", cx - left + w / 2 + "px");  // freccia sul punto giusto
  }
  let tipFor = null;  // marcatore mostrato: passare tra pallino e stelo non lo riposiziona
  const hideYearTip = () => { yearTip.hidden = true; tipFor = null; };
  yearLineEl.addEventListener("pointerover", e => {
    const g = e.target.closest(".marker[data-tip]");  // solo spilli
    if (!g) hideYearTip();
    else if (g !== tipFor) { tipFor = g; showYearTip(g); }
  });
  yearLineEl.addEventListener("pointerleave", hideYearTip);
  // segni dei marcatori nei calendari: stesso tooltip
  const calendarsEl = document.getElementById("calendars");
  calendarsEl.addEventListener("pointerover", e => {
    const el = e.target.closest("[data-tip]");
    if (!el) hideYearTip();
    else if (el !== tipFor) { tipFor = el; showYearTip(el); }
  });
  calendarsEl.addEventListener("pointerleave", hideYearTip);
  // clic (o Invio/Spazio) sul pallino di oggi: alterna anno intero e da oggi a fine anno
  function toggleYearZoom() {
    yearZoom = !yearZoom;
    renderYear(new Date());
    yearLineEl.querySelector(".today").focus({ preventScroll: true });
  }
  yearLineEl.addEventListener("click", e => { if (e.target.closest(".today")) toggleYearZoom(); });
  yearLineEl.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.closest(".today")) { e.preventDefault(); toggleYearZoom(); }
  });

  // le parentesi dei periodi sono in pixel: ridisegna quando la linea cambia larghezza
  let yearLineW = 0;
  new ResizeObserver(entries => {
    const w = Math.round(entries[0].contentRect.width);
    if (w !== yearLineW) { yearLineW = w; renderYear(new Date()); }  // eseguito dopo lo script: settings c'è già
  }).observe(document.getElementById("year-line"));

  // Tacche dei giorni sotto la linea, nella vista ingrandita con al massimo 60 giorni.
  // Una tacca per giorno all'inizio del giorno (come gli spilli); i numeri si diradano
  // in base allo spazio: passo 1, 2, 5 o 10 (multipli: 5, 10, 15…) perché ogni numero
  // abbia almeno DAY_LABEL_PX. Il giorno 1 di ogni mese è sempre numerato, con una tacca
  // più lunga; gli altri numeri troppo vicini a quelli già messi vengono saltati.
  // I fine settimana hanno una fascia di sfondo (centrata sulle tacche, come i numeri) che
  // resta visibile anche quando i numeri sono diradati; le festività hanno il colore delle
  // festività. Restituisce { back: fasce, da disegnare sotto la linea; front: tacche e numeri }.
  const DAY_TICKS_MAX = 60, DAY_LABEL_PX = 16, DAY_TICKS_H = 18;
  function dayTicksSvg(y, total, from, width, pos) {
    const pxDay = width / (total - from);
    const step = [1, 2, 5, 10].find(s => s * pxDay >= DAY_LABEL_PX) || 10;
    const days = [];
    for (let d = from; d < total; d++) days.push({ d, date: new Date(y, 0, d + 1) });
    // numeri: prima i giorni 1, poi i multipli del passo che non si sovrappongono
    const placed = [];
    const fits = d => placed.every(p => Math.abs(p - d) * pxDay >= DAY_LABEL_PX);
    days.forEach(x => { if (x.date.getDate() === 1) placed.push(x.d); });
    days.forEach(x => {
      const n = x.date.getDate();
      if (n !== 1 && (step === 1 || n % step === 0) && fits(x.d)) placed.push(x.d);
    });
    const labeled = new Set(placed);
    const weekend = date => date.getDay() % 6 === 0;
    // fasce: una per ogni gruppo di giorni di fine settimana consecutivi
    const half = 50 / (total - from);          // mezzo giorno, in %
    let back = '<g class="weekends">';
    days.forEach(({ d, date }, i) => {
      if (!weekend(date) || (i > 0 && weekend(days[i - 1].date))) return;  // solo l'inizio del gruppo
      let last = d;
      while (last + 1 < total && weekend(new Date(y, 0, last + 2))) last++;
      const a = Math.max(0, pos(d) - half), b = Math.min(100, pos(last) + half);
      back += `<rect class="weekend-band" x="${a}%" y="0" width="${b - a}%" height="27" rx="4"/>`;
    });
    back += "</g>";
    let front = '<g class="days">';
    days.forEach(({ d, date }) => {
      const n = date.getDate(), at = pos(d);
      const len = n === 1 ? 7 : labeled.has(d) ? 4.5 : 2.5;
      const we = weekend(date) ? " weekend" : "";
      front += `<line class="day-tick${n === 1 ? " month" : ""}${we}" x1="${at}%" x2="${at}%" y1="6" y2="${6 + len}"/>`;
      if (!labeled.has(d)) return;
      const cls = holidays(y)[key(date)] ? " holiday" : we;
      front += `<text class="day-num${cls}" x="${at}%" y="${22}">${n}</text>`;
    });
    return { back, front: front + "</g>" };
  }

  // Zoom: cliccando il pallino di oggi la linea mostra solo da oggi a fine anno (oggi
  // all'estremo sinistro); un altro clic torna all'anno intero. I numeri ai lati
  // (giorni trascorsi e rimanenti) restano quelli dell'anno.
  let yearZoom = false;
  function renderYear(now) {
    const y = now.getFullYear();
    const total = new Date(y, 1, 29).getMonth() === 1 ? 366 : 365;
    const done = dayOfYear(now) - 1;           // giorni interamente trascorsi
    const pct = done / total * 100;
    const from = yearZoom ? done : 0;          // primo giorno visibile
    const pos = d => (d - from) / (total - from) * 100;
    const line = document.getElementById("year-line");
    // rombo 7×7 px con i lati leggermente incurvati verso il centro
    const DIAMOND = "M0 -3.5 Q1.25 -1.25 3.5 0 Q1.25 1.25 0 3.5 Q-1.25 1.25 -3.5 0 Q-1.25 -1.25 0 -3.5Z";
    let svg = '<line class="track" x1="0" y1="4.5" x2="100%" y2="4.5"/>';
    for (let m = 1; m < 12; m++) {  // un puntino all'inizio di ogni mese da febbraio
      const d = dayOfYear(new Date(y, m, 1)) - 1;
      if (d <= from) continue;                 // mese già iniziato (vista ingrandita)
      const at = pos(d);
      // SVG annidato per posizionare in percentuale una forma disegnata attorno all'origine
      svg += `<svg x="${at}%" y="4.5" overflow="visible"><path class="mark" d="${DIAMOND}"/></svg>`;
    }
    // vista ingrandita breve: tacche dei giorni, e parentesi dei periodi più in basso
    const ticks = yearZoom && total - from <= DAY_TICKS_MAX;
    if (ticks) {
      const t = dayTicksSvg(y, total, from, line.clientWidth, pos);
      svg = t.back + svg + t.front;  // fasce dei fine settimana sotto la linea
    }
    svg += markersSvg(y, total, line.clientWidth, from, ticks ? DAY_TICKS_H : 0);
    hideYearTip();  // il marcatore sotto il mouse viene ricreato
    // pallino di oggi (come quello del sole): è anche il pulsante dello zoom,
    // con un'area di clic più grande del disegno
    const label = escapeXml(yearZoom ? T.zoomOut : T.zoomIn);
    svg += `<g class="today" tabindex="0" role="button" aria-label="${label}" aria-pressed="${yearZoom}">` +
           `<svg x="${pos(done)}%" y="4.5" overflow="visible"><circle class="today-hit" r="11"/><circle class="dot" r="4.5"/></svg></g>`;
    line.innerHTML = svg;
    line.title = fmtText(T.year, done, total - done);
    document.getElementById("year-past").textContent = done;
    document.getElementById("year-left").textContent = total - done;
    line.setAttribute("aria-valuenow", Math.floor(pct));
  }

  // ---------- Preferenze ----------
  const STORAGE_KEY = "startpage-settings";

  // Motori di ricerca predefiniti: %s viene sostituito dal testo cercato
  const ENGINES = [
    { id: "duckduckgo",   label: "DuckDuckGo",        url: "https://duckduckgo.com/?q=%s" },
    { id: "google",       label: "Google",            url: "https://www.google.com/search?q=%s" },
    { id: "bing",         label: "Bing",              url: "https://www.bing.com/search?q=%s" },
    { id: "startpage",    label: "Startpage",         url: "https://www.startpage.com/do/search?query=%s" },
    { id: "ecosia",       label: "Ecosia",            url: "https://www.ecosia.org/search?q=%s" },
    { id: "brave",        label: "Brave Search",      url: "https://search.brave.com/search?q=%s" },
    { id: "qwant",        label: "Qwant",             url: "https://www.qwant.com/?q=%s" },
    { id: "kagi",         label: "Kagi",              url: "https://kagi.com/search?q=%s" },
    { id: "wikipedia-it", label: "Wikipedia (it)",    url: "https://it.wikipedia.org/w/index.php?search=%s" },
    { id: "wikipedia-en", label: "Wikipedia (en)",    url: "https://en.wikipedia.org/w/index.php?search=%s" },
    { id: "youtube",      label: "YouTube",           url: "https://www.youtube.com/results?search_query=%s" },
    { id: "maps",         label: "Google Maps",       url: "https://www.google.com/maps/search/%s" },
    { id: "osm",          label: "OpenStreetMap",     url: "https://www.openstreetmap.org/search?query=%s" },
    { id: "translate",    label: "Google Translate",  url: "https://translate.google.com/?sl=auto&tl=it&text=%s" },
    { id: "deepl",        label: "DeepL",             url: "https://www.deepl.com/translator#auto/it/%s" },
    { id: "github",       label: "GitHub",            url: "https://github.com/search?q=%s" },
    { id: "amazon-it",    label: "Amazon.it",         url: "https://www.amazon.it/s?k=%s" }
  ];
  const engineById = id => ENGINES.find(e => e.id === id);

  const DEFAULTS = {
    language: "auto",  // "auto" (lingua del browser) o una chiave di I18N
    theme: "system",
    yearView: "year",  // vista iniziale della linea dell'anno: "year" (intera) o "today" (da oggi)
    searches: [
      { engine: "duckduckgo",   label: "DuckDuckGo", url: engineById("duckduckgo").url,   key: "d" },
      { engine: "wikipedia-en", label: "Wikipedia",  url: engineById("wikipedia-en").url, key: "w" }
    ],
    links: [
      { label: "Gmail",    url: "https://mail.google.com/" },
      { label: "Outlook",  url: "https://outlook.live.com/mail/" },
      { label: "Drive",    url: "https://drive.google.com/" },
      { label: "Mastodon", url: "https://mastodon.social/" }
    ],
    markers: [],  // { from: "AAAA-MM-GG", to: "AAAA-MM-GG" | "", label, yearly, color }
    location: { name: "Roma", lat: 41.9028, lon: 12.4964 }  // per alba, tramonto e sole
  };
  // coordinate scritte con la virgola o il punto; null se non valide
  const parseCoord = (v, max) => {
    const n = typeof v === "number" ? v : parseFloat(String(v || "").trim().replace(",", "."));
    return Number.isFinite(n) && Math.abs(n) <= max ? n : null;
  };
  const clone = o => JSON.parse(JSON.stringify(o));

  // preferenze lette da localStorage o da un file importato: i campi mancanti o non
  // validi prendono il valore predefinito
  function normalizeSettings(s) {
    const out = clone(DEFAULTS);
    if (s && typeof s === "object") {
      if (s.language === "auto" || I18N[s.language]) out.language = s.language;
      if (["system", "light", "dark"].includes(s.theme)) out.theme = s.theme;
      if (["year", "today"].includes(s.yearView)) out.yearView = s.yearView;
      // scarta le voci malformate, che altrimenti bloccherebbero la pagina
      const isStr = v => typeof v === "string";
      const okItem = x => x && isStr(x.label) && isStr(x.url);
      if (Array.isArray(s.searches) && s.searches.some(okItem)) out.searches = s.searches.filter(okItem);
      if (Array.isArray(s.links)) out.links = s.links.filter(okItem);
      if (Array.isArray(s.markers)) out.markers = s.markers.filter(x => x && isStr(x.from));
      const loc = s.location;
      if (loc && parseCoord(loc.lat, 90) !== null && parseCoord(loc.lon, 180) !== null)
        out.location = { name: String(loc.name || ""), lat: +loc.lat, lon: +loc.lon };
    }
    return out;
  }
  function loadSettings() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch (e) {}
    if (s && typeof s === "object") return normalizeSettings(s);
    const out = clone(DEFAULTS);
    // tema scelto con il vecchio interruttore
    try { const t = localStorage.getItem("theme"); if (t === "light" || t === "dark") out.theme = t; } catch (e) {}
    return out;
  }
  function saveSettings(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); return true; } catch (e) { return false; }
  }

  let settings = loadSettings();

  // ----- Tema -----
  const darkQuery = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
  function applyTheme(pref) {
    const t = pref === "system" ? (darkQuery && darkQuery.matches ? "dark" : "light") : pref;
    document.documentElement.setAttribute("data-theme", t);
  }
  if (darkQuery) darkQuery.addEventListener("change", () => { if (settings.theme === "system") applyTheme("system"); });

  // ----- Icone -----
  const svgIcon = d => `<svg class="icon" viewBox="0 0 24 24">${d}</svg>`;
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
  };

  // ----- Icone dei collegamenti -----
  // BRAND_ICONS e GENERIC_ICONS sono in icons.js
  const LINK_ICONS = { ...GENERIC_ICONS, ...BRAND_ICONS };
  const linkSvg = id => svgIcon((LINK_ICONS[id] || LINK_ICONS.link)[1]);

  // Marchio riconosciuto dall'indirizzo: si confronta "dominio/percorso" (senza www.).
  // Le voci più specifiche vengono prima (es. Gmail prima di Google, AWS prima di Amazon).
  const dom = (...d) => new RegExp(`(^|\\.)(${d.map(x => x.replace(/\./g, "\\.")).join("|")})(/|$)`);
  const BRAND_HOSTS = [
    ["gmail", /^mail\.google\./],
    ["calendar", /^calendar\.google\./],
    ["google-drive", /^(drive|docs|sheets|slides)\.google\./],
    ["google-maps", /^maps\.google\.|^google\.[a-z.]+\/maps/],
    ["google-photos", /^photos\.google\./],
    ["google-play", /^play\.google\./],
    ["youtube", dom("youtube.com", "youtu.be")],
    ["google", /(^|\.)google\.[a-z.]+(\/|$)/],
    ["calendar", /^outlook\.[a-z.]+\/calendar/],
    ["mail", /^outlook\.(live\.com|office\.com|office365\.com|cloud\.microsoft)/],
    ["teams", /^teams\.(microsoft\.com|live\.com|cloud\.microsoft)/],
    ["onedrive", /onedrive\.|sharepoint\.com|^1drv\.ms/],
    ["office", dom("office.com", "microsoft365.com", "cloud.microsoft")],
    ["aws", dom("aws.amazon.com", "amazonaws.com")],
    ["amazon", /(^|\.)amazon\.[a-z.]+(\/|$)/],
    ["mastodon", /(^|\.)(mastodon\.[a-z]+|mstdn\.[a-z]+|mas\.to|fosstodon\.org|hachyderm\.io)(\/|$)/],
    ["github", dom("github.com")], ["gitlab", dom("gitlab.com")], ["bitbucket", dom("bitbucket.org")],
    ["bluesky", dom("bsky.app")], ["threads", dom("threads.net", "threads.com")], ["x", dom("x.com", "twitter.com")],
    ["facebook", dom("facebook.com", "fb.com")], ["instagram", dom("instagram.com")], ["linkedin", dom("linkedin.com")],
    ["reddit", dom("reddit.com")], ["whatsapp", dom("whatsapp.com", "wa.me")], ["telegram", dom("telegram.org", "t.me")],
    ["signal", dom("signal.org")], ["messenger", dom("messenger.com")], ["slack", dom("slack.com")],
    ["discord", dom("discord.com", "discord.gg")], ["zoom", dom("zoom.us")], ["skype", dom("skype.com")],
    ["windows", dom("windows.com")], ["apple", dom("apple.com", "icloud.com")], ["dropbox", dom("dropbox.com")],
    ["notion", dom("notion.so", "notion.com", "notion.site")], ["evernote", dom("evernote.com")], ["trello", dom("trello.com")],
    ["asana", dom("asana.com")], ["jira", dom("atlassian.net")], ["monday", dom("monday.com")], ["figma", dom("figma.com")],
    ["openai", dom("openai.com", "chatgpt.com")], ["wikipedia", dom("wikipedia.org")], ["netflix", dom("netflix.com")],
    ["spotify", dom("spotify.com")], ["twitch", dom("twitch.tv")], ["tiktok", dom("tiktok.com")],
    ["pinterest", /(^|\.)pinterest\.[a-z.]+(\/|$)/], ["medium", dom("medium.com")], ["stackoverflow", dom("stackoverflow.com")],
    ["feedly", dom("feedly.com")], ["pocket", dom("getpocket.com")], ["nextcloud", dom("nextcloud.com")],
    ["paypal", /(^|\.)paypal\.[a-z.]+(\/|$)/], ["booking", dom("booking.com")], ["airbnb", /(^|\.)airbnb\.[a-z.]+(\/|$)/],
    ["tripadvisor", /(^|\.)tripadvisor\.[a-z.]+(\/|$)/], ["strava", dom("strava.com")], ["yahoo", /(^|\.)yahoo\.[a-z.]+(\/|$)/],
    ["bing", dom("bing.com")], ["vercel", dom("vercel.com")], ["cloudflare", dom("cloudflare.com")],
    ["azure", dom("azure.com", "portal.azure.com")], ["docker", dom("docker.com")], ["npm", dom("npmjs.com")],
    ["vscode", dom("vscode.dev")], ["ycombinator", dom("news.ycombinator.com")], ["nytimes", dom("nytimes.com")],
    ["guardian", dom("theguardian.com")], ["steam", dom("steampowered.com", "steamcommunity.com")], ["xbox", dom("xbox.com")],
    ["deezer", dom("deezer.com")], ["soundcloud", dom("soundcloud.com")], ["vimeo", dom("vimeo.com")],
    ["flickr", dom("flickr.com")], ["unsplash", dom("unsplash.com")], ["dribbble", dom("dribbble.com")],
    ["behance", dom("behance.net")], ["wordpress", dom("wordpress.com", "wordpress.org")], ["tumblr", dom("tumblr.com")]
  ];
  function brandFor(url) {
    let u; try { u = new URL(url); } catch (e) { return null; }
    const s = u.hostname.replace(/^www\./, "") + u.pathname;
    const hit = BRAND_HOSTS.find(([, re]) => re.test(s));
    return hit ? hit[0] : null;
  }
  // icona generica scelta da parole nel nome o nell'indirizzo
  function genericFor(l, fallback = "link") {
    const t = ((l.label || "") + " " + (l.url || "")).toLowerCase();
    if (/mail|posta|outlook/.test(t)) return "mail";
    if (/calend|agenda/.test(t)) return "calendar";
    if (/drive|cloud|sharepoint|storage/.test(t)) return "cloud";
    if (/chat|messag/.test(t)) return "message-circle";
    if (/git|code|dev/.test(t)) return "code";
    if (/doc|word|excel|sheet|wiki/.test(t)) return "file-text";
    if (/news|notizie|giornale/.test(t)) return "news";
    if (/shop|negozio|store/.test(t)) return "shopping-cart";
    if (/bank|banca/.test(t)) return "building-bank";
    if (/map|mappe/.test(t)) return "map-pin";
    return fallback;
  }
  // Icona di un collegamento o di un motore di ricerca: l.icon è "auto", "favicon"
  // o un id di LINK_ICONS. "auto": marchio riconosciuto dall'indirizzo, altrimenti
  // favicon del sito. Se si usa la favicon, id è l'icona generica da mostrare finché manca
  // (fallback: "link" per i collegamenti, "search" per i motori).
  function resolveLinkIcon(l, fallback) {
    const choice = l.icon || "auto";
    if (LINK_ICONS[choice]) return { id: choice, favicon: false };
    const brand = choice === "auto" && brandFor(l.url);
    if (brand) return { id: brand, favicon: false };
    return { id: genericFor(l, fallback), favicon: true };
  }
  // markup dell'icona, con la favicon se già in memoria
  function linkIconHtml(l, fallback) {
    const r = resolveLinkIcon(l, fallback);
    const cached = r.favicon && faviconCache[hostOf(l.url)];
    return cached && cached.m ? `<span class="favicon" style="--fav: url(${cached.m})"></span>` : linkSvg(r.id);
  }
  // elemento dell'icona per la pagina: se serve la favicon la scarica (o la aggiorna)
  // e si sostituisce appena è pronta
  function itemIcon(l, fallback) {
    const t = document.createElement("template");
    t.innerHTML = linkIconHtml(l, fallback);
    const el = t.content.firstElementChild;
    const host = hostOf(l.url), cached = faviconCache[host];
    if (host && resolveLinkIcon(l, fallback).favicon &&
        (!cached || Date.now() - cached.t > (cached.m ? FAVICON_TTL : FAVICON_RETRY)))
      loadFavicon(host).then(() => {
        if (!el.isConnected) return;
        t.innerHTML = linkIconHtml(l, fallback);
        el.replaceWith(t.content.firstElementChild);
      });
    return el;
  }

  // ----- Ricerche e collegamenti nella pagina -----
  function renderSearches() {
    const box = document.getElementById("searches");
    box.replaceChildren();
    settings.searches.forEach((s, i) => {
      const f = document.createElement("form");
      f.className = "search";
      f.innerHTML = `
        <div class="search-field">
          <input type="search" autocomplete="off">
          <button type="submit">${svgIcon(ICONS.arrow)}</button>
        </div>`;
      const input = f.querySelector("input");
      f.firstElementChild.prepend(itemIcon(s, "search"));  // icona del motore al posto della lente
      input.id = "q-" + i;
      // nessun titolo sopra il campo: il nome del motore è nel testo segnaposto
      input.placeholder = fmtText(T.searchOn, s.label);
      input.setAttribute("aria-label", fmtText(T.searchOn, s.label));
      f.querySelector("button").setAttribute("aria-label", fmtText(T.searchOn, s.label));
      f.addEventListener("submit", e => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) { input.focus(); return; }
        location.href = s.url.includes("%s")
          ? s.url.split("%s").join(encodeURIComponent(q))
          : s.url + encodeURIComponent(q);
      });
      box.appendChild(f);
    });
  }
  function renderLinks() {
    const nav = document.getElementById("links");
    nav.replaceChildren();
    settings.links.forEach(l => {
      const a = document.createElement("a");
      a.href = l.url;
      a.append(itemIcon(l, "link"), l.label);
      nav.appendChild(a);
    });
    nav.hidden = settings.links.length === 0;
    pruneFavicons();
  }

  // ----- Favicon dei collegamenti -----
  // Scaricate da icon.horse (permette di leggere i pixel grazie a CORS e segnala con
  // l'intestazione X-Icon-Fallback quando non trova l'icona e ne genera una con una lettera).
  // L'immagine diventa una sagoma monocromatica (maschera alfa) salvata in localStorage per
  // dominio, così la pagina la mostra subito e anche senza rete.
  const FAVICON_KEY = "startpage-favicons";
  const FAVICON_TTL = 30 * 86400000;   // icone trovate: aggiornate ogni 30 giorni
  const FAVICON_RETRY = 86400000;      // icone non trovate: si riprova dopo un giorno
  let faviconCache = {};
  try { faviconCache = JSON.parse(localStorage.getItem(FAVICON_KEY) || "{}") || {}; } catch (e) {}
  const saveFavicons = () => { try { localStorage.setItem(FAVICON_KEY, JSON.stringify(faviconCache)); } catch (e) {} };
  const hostOf = url => { try { return new URL(url).hostname; } catch (e) { return ""; } };
  // tiene in memoria solo i domini dei collegamenti attuali
  function pruneFavicons() {
    const hosts = new Set([...settings.links, ...settings.searches].map(l => hostOf(l.url)));
    let changed = false;
    Object.keys(faviconCache).forEach(h => { if (!hosts.has(h)) { delete faviconCache[h]; changed = true; } });
    if (changed) saveFavicons();
  }

  const faviconPending = {};
  function loadFavicon(host) {
    return faviconPending[host] ||= (async () => {
      try {
        const res = await fetch(`https://icon.horse/icon/${encodeURIComponent(host)}`);
        let mask = null;
        if (res.ok && res.headers.get("X-Icon-Fallback") !== "true") mask = await toMask(await res.blob());
        faviconCache[host] = { m: mask, t: Date.now() };
        saveFavicons();
        return mask;
      } catch (e) {
        return null;  // senza rete: nessun salvataggio, si riprova alla prossima apertura
      } finally {
        delete faviconPending[host];
      }
    })();
  }

  // Converte l'immagine in una sagoma: nero con trasparenza, da usare come maschera CSS.
  // - Sfondo trasparente: conta l'opacità dei pixel; le parti quasi bianche diventano
  //   buchi, così il disegno interno resta visibile (es. la "m" bianca di Mastodon).
  //   Se così l'icona sparisce (disegno tutto bianco), si usa la sola opacità.
  // - Sfondo pieno: conta la differenza netta di luminosità rispetto al colore degli angoli.
  async function toMask(blob) {
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      await new Promise((ok, ko) => { img.onload = ok; img.onerror = ko; img.src = url; });
      const S = 64, c = document.createElement("canvas");
      c.width = c.height = S;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(img, 0, 0, S, S);
      const data = g.getImageData(0, 0, S, S), d = data.data;
      const lum = i => (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      const sat = i => (Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2])) / 255;
      const corners = [0, S - 1, S * (S - 1), S * S - 1].map(p => p * 4);
      const opaqueBg = corners.reduce((s, i) => s + d[i + 3], 0) / 4 > 128;
      const bgLum = corners.reduce((s, i) => s + lum(i), 0) / 4;
      const ink = new Float32Array(S * S);
      const fill = carve => {
        let total = 0;
        for (let p = 0; p < S * S; p++) {
          const i = p * 4, a = d[i + 3] / 255;
          let v;
          // le piccole differenze (sfumature dello sfondo) non contano, solo il disegno netto
          if (opaqueBg) v = a * Math.max(0, Math.min(1, (Math.abs(lum(i) - bgLum) - 0.15) / 0.2));
          else if (carve) v = a * (1 - Math.max(0, Math.min(1, (lum(i) - 0.8) / 0.15)) * (sat(i) < 0.15 ? 1 : 0));
          else v = a;
          ink[p] = v; total += v;
        }
        return total / (S * S);  // copertura media
      };
      if (fill(true) < 0.04 && !opaqueBg) fill(false);
      if (ink.reduce((s, v) => s + v, 0) / (S * S) < 0.02) return null;  // icona vuota o uniforme
      for (let p = 0; p < S * S; p++) {
        d[p * 4] = d[p * 4 + 1] = d[p * 4 + 2] = 0;
        d[p * 4 + 3] = Math.round(ink[p] * 255);
      }
      g.putImageData(data, 0, 0);
      return c.toDataURL("image/png");
    } catch (e) {
      return null;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  // disegna tutto ciò che cambia una volta al giorno (o con le preferenze)
  let lastDay = null;
  function renderDay(now) {
    lastDay = key(now);
    renderDate(now);
    renderCalendars(now);
    renderYear(now);
    renderSunDay(now);
    renderFavicon(now);
  }
  // la vista della linea dell'anno segue la preferenza all'avvio e quando la preferenza
  // cambia; salvare altre preferenze non annulla lo zoom scelto col clic sul pallino
  let appliedYearView = null;
  function applySettings() {
    if (settings.yearView !== appliedYearView) {
      appliedYearView = settings.yearView;
      yearZoom = settings.yearView === "today";
    }
    applyLanguage(settings.language);
    applyTheme(settings.theme);
    renderSearches();
    renderLinks();
    renderDay(new Date());  // lingua, marcatori e posizione cambiano date, calendari, anno e sole
    renderSunDot(new Date());
  }
  applySettings();

  // ----- Finestra preferenze -----
  const dlg = document.getElementById("prefs");
  const prefsForm = document.getElementById("prefs-form");
  const prefSearches = document.getElementById("pref-searches");
  const prefLinks = document.getElementById("pref-links");
  const prefMarkers = document.getElementById("pref-markers");
  const prefsError = document.getElementById("prefs-error");
  const findBtn = prefsForm.querySelector('[data-action="find-place"]');
  let draft = null;
  // true se il nome della località è stato cambiato dopo l'ultima impostazione delle
  // coordinate: al salvataggio la località viene cercata, così le coordinate corrispondono
  let locNameEdited = false;

  const normUrl = u => {
    u = (u || "").trim();
    if (u && !/^[a-z][a-z0-9+.-]*:/i.test(u)) u = "https://" + u;
    return u;
  };
  const iconBtn = (icon, action, label, disabled) =>
    `<button class="icon-btn" type="button" data-action="${action}" aria-label="${label}" title="${label}"${disabled ? " disabled" : ""}>${svgIcon(ICONS[icon])}</button>`;

  // Pannello per scegliere l'icona di un motore o di un collegamento. Uno solo aperto
  // alla volta: iconPicker vale "search:2", "link:0"… oppure "" se chiuso.
  let iconPicker = "";
  const pickBtn = (kind, item, i) => {
    const open = iconPicker === `${kind}:${i}`;
    return `<button class="icon-pick" type="button" data-action="pick-icon" aria-label="Choose icon" title="Choose icon" aria-expanded="${open}">${linkIconHtml(item, kind)}</button>`;
  };
  function iconPanel(kind, l, i) {
    const cur = l.icon || "auto";
    const choice = (id, [label, svg]) =>
      `<button class="icon-choice" type="button" data-action="set-icon" data-icon="${id}" title="${label}" aria-label="${label}" aria-pressed="${cur === id}">${svgIcon(svg)}</button>`;
    const grid = icons => `<div class="icon-grid">${Object.entries(icons)
      .sort((a, b) => a[1][0].localeCompare(b[1][0])).map(([id, v]) => choice(id, v)).join("")}</div>`;
    const panel = document.createElement("div");
    panel.className = "icon-panel";
    panel.dataset.index = i;
    panel.dataset.kind = kind;
    panel.innerHTML = `
      <div class="icon-panel-head">
        <input type="text" class="icon-filter" placeholder="Filter icons…" aria-label="Filter icons">
        <button class="btn" type="button" data-action="set-icon" data-icon="auto" aria-pressed="${cur === "auto"}">Automatic</button>
        <button class="btn" type="button" data-action="set-icon" data-icon="favicon" aria-pressed="${cur === "favicon"}">Site icon</button>
      </div>
      <div class="icon-scroll">
        <div class="icon-group">Brands</div>${grid(BRAND_ICONS)}
        <div class="icon-group">Generic</div>${grid(GENERIC_ICONS)}
      </div>`;
    return panel;
  }

  function renderDraft() {
    prefsError.textContent = "";
    prefsError.classList.remove("info");
    // ricerche
    prefSearches.replaceChildren();
    draft.searches.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "row search-row";
      row.dataset.index = i;
      row.dataset.kind = "search";
      const opts = ENGINES.map(e => `<option value="${e.id}">${e.label}</option>`).join("") +
                   `<option value="custom">Custom…</option>`;
      row.innerHTML = `
        ${pickBtn("search", s, i)}
        <select data-field="engine" aria-label="Engine">${opts}</select>
        <input type="text" data-field="label" aria-label="Label">
        <input type="text" class="tpl" data-field="url" aria-label="Search address" placeholder="https://example.com/search?q=%s">
        <input type="text" class="key" data-field="key" aria-label="Shortcut key" maxlength="1">
        ${iconBtn("trash", "del-search", "Remove", draft.searches.length <= 1)}`;
      row.querySelector('[data-field="engine"]').value = engineById(s.engine) ? s.engine : "custom";
      row.querySelector('[data-field="label"]').value = s.label;
      const tpl = row.querySelector('[data-field="url"]');
      tpl.value = s.url;
      tpl.disabled = !!engineById(s.engine);
      row.querySelector('[data-field="key"]').value = s.key || "";
      prefSearches.appendChild(row);
      if (iconPicker === `search:${i}`) prefSearches.appendChild(iconPanel("search", s, i));
    });
    // collegamenti
    prefLinks.replaceChildren();
    draft.links.forEach((l, i) => {
      const row = document.createElement("div");
      row.className = "row link-row";
      row.dataset.index = i;
      row.dataset.kind = "link";
      row.innerHTML = `
        ${pickBtn("link", l, i)}
        <input type="text" data-field="label" aria-label="Label">
        <input type="text" class="url" data-field="url" aria-label="Address" placeholder="https://…">
        ${iconBtn("up", "up-link", "Move up", i === 0)}
        ${iconBtn("down", "down-link", "Move down", i === draft.links.length - 1)}
        ${iconBtn("trash", "del-link", "Remove", false)}`;
      row.querySelector('[data-field="label"]').value = l.label;
      row.querySelector('[data-field="url"]').value = l.url;
      prefLinks.appendChild(row);
      if (iconPicker === `link:${i}`) prefLinks.appendChild(iconPanel("link", l, i));
    });
    // marcatori
    prefMarkers.replaceChildren();
    draft.markers.forEach((mk, i) => {
      const row = document.createElement("div");
      row.className = "row marker-row";
      row.dataset.index = i;
      row.innerHTML = `
        <input type="date" data-field="from" aria-label="From">
        <input type="date" data-field="to" aria-label="To (optional)">
        <input type="text" class="mlabel" data-field="label" aria-label="Name" placeholder="Holiday, birthday…">
        <div class="swatches" role="radiogroup" aria-label="Color">${MARKER_COLORS.map(c =>
          `<label title="${c.label}"><input type="radio" name="mk-color-${i}" value="${c.id}" data-field="color" aria-label="${c.label}"${(mk.color || "grey") === c.id ? " checked" : ""}><span style="--sw: ${c.css}"></span></label>`).join("")}</div>
        <label class="yearly"><input type="checkbox" data-field="yearly"> Every year</label>
        ${iconBtn("trash", "del-marker", "Remove", false)}`;
      row.querySelector('[data-field="from"]').value = mk.from || "";
      row.querySelector('[data-field="to"]').value = mk.to || "";
      row.querySelector('[data-field="label"]').value = mk.label || "";
      row.querySelector('[data-field="yearly"]').checked = !!mk.yearly;
      prefMarkers.appendChild(row);
    });
    prefsForm.querySelectorAll('input[name="theme"]').forEach(r => { r.checked = r.value === draft.theme; });
    prefsForm.querySelectorAll('input[name="yearView"]').forEach(r => { r.checked = r.value === draft.yearView; });
    prefsForm.querySelector('select[name="language"]').value = draft.language;
    const coord = v => typeof v === "number" ? String(v) : (v || "");
    prefsForm.querySelectorAll(".loc-row input").forEach(i => i.classList.remove("bad"));
    prefsForm.querySelector('input[name="locName"]').value = draft.location.name || "";
    prefsForm.querySelector('input[name="lat"]').value = coord(draft.location.lat);
    prefsForm.querySelector('input[name="lon"]').value = coord(draft.location.lon);
  }

  // elenco delle lingue: "Automatic" indica quale lingua del browser verrebbe usata
  prefsForm.querySelector('select[name="language"]').innerHTML =
    `<option value="auto">Automatic (${I18N[resolveLanguage("auto").lang].name})</option>` +
    Object.entries(I18N).map(([id, l]) => `<option value="${id}">${l.name}</option>`).join("");

  // aggiorna la bozza mentre si modifica
  prefsForm.addEventListener("input", e => {
    const el = e.target;
    el.classList.remove("bad");
    if (el.name === "theme") { draft.theme = el.value; applyTheme(draft.theme); return; } // anteprima
    if (el.name === "yearView") { draft.yearView = el.value; return; }
    if (el.name === "language") { draft.language = el.value; return; }
    if (el.classList.contains("icon-filter")) {  // filtra le icone per nome
      const q = el.value.trim().toLowerCase();
      el.closest(".icon-panel").querySelectorAll(".icon-choice").forEach(b => {
        b.hidden = !!q && !b.title.toLowerCase().includes(q);
      });
      return;
    }
    if (el.name === "locName") { draft.location.name = el.value; locNameEdited = true; return; }
    if (el.name === "lat" || el.name === "lon") { draft.location[el.name] = el.value; locNameEdited = false; return; }
    const row = el.closest(".row");
    if (!row || !el.dataset.field) return;
    const list = row.classList.contains("search-row") ? draft.searches
               : row.classList.contains("marker-row") ? draft.markers : draft.links;
    const item = list[+row.dataset.index];
    if (el.type === "checkbox") { item[el.dataset.field] = el.checked; return; }
    if (el.type === "radio") { item[el.dataset.field] = el.value; return; }
    if (el.dataset.field === "engine") {
      const eng = engineById(el.value), prevEng = engineById(item.engine);
      item.engine = el.value;
      if (eng) {
        // cambia l'etichetta solo se era quella del motore precedente (o vuota)
        // (anche se era una forma breve, es. "Wikipedia" per "Wikipedia (en)")
        if (!item.label || (prevEng && prevEng.label.startsWith(item.label))) item.label = eng.label;
        item.url = eng.url;
      }
      renderDraft();  // ricrea le righe: rimetti il focus dove serve
      prefSearches.querySelector(`.search-row[data-index="${row.dataset.index}"]`)
        .querySelector(eng ? '[data-field="engine"]' : '[data-field="url"]').focus();
      return;
    }
    item[el.dataset.field] = el.dataset.field === "key" ? el.value.toLowerCase() : el.value;
    // l'icona automatica dipende da nome e indirizzo: aggiorna l'anteprima
    const pick = row.querySelector(".icon-pick");
    if (pick) pick.innerHTML = linkIconHtml(item, row.dataset.kind);
  });
  // Invio nel filtro sceglie la prima icona visibile invece di salvare
  prefsForm.addEventListener("keydown", e => {
    if (e.key !== "Enter" || !e.target.classList.contains("icon-filter")) return;
    e.preventDefault();
    const first = e.target.closest(".icon-panel").querySelector(".icon-choice:not([hidden])");
    if (first) first.click();
  });

  prefsForm.addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const row = btn.closest("[data-index]");  // riga o pannello delle icone
    const i = row ? +row.dataset.index : -1;
    const kind = row && row.dataset.kind;     // "search" o "link"
    const action = btn.dataset.action;
    const picker = iconPicker;
    if (action !== "pick-icon") iconPicker = "";  // ogni altra azione chiude il pannello
    switch (action) {
      case "pick-icon": iconPicker = picker === `${kind}:${i}` ? "" : `${kind}:${i}`; break;
      case "set-icon": (kind === "search" ? draft.searches : draft.links)[i].icon = btn.dataset.icon; break;
      case "add-search": {
        const used = new Set(draft.searches.map(s => s.engine));
        const eng = ENGINES.find(x => !used.has(x.id)) || ENGINES[0];
        draft.searches.push({ engine: eng.id, label: eng.label, url: eng.url, key: "", icon: "auto" });
        break;
      }
      case "del-search": draft.searches.splice(i, 1); break;
      case "add-link": draft.links.push({ label: "", url: "", icon: "auto" }); break;
      case "add-marker": draft.markers.push({ from: "", to: "", label: "", yearly: false, color: "grey" }); break;
      case "del-marker": draft.markers.splice(i, 1); break;
      case "del-link": draft.links.splice(i, 1); break;
      case "up-link": [draft.links[i - 1], draft.links[i]] = [draft.links[i], draft.links[i - 1]]; break;
      case "down-link": [draft.links[i + 1], draft.links[i]] = [draft.links[i], draft.links[i + 1]]; break;
      case "reset": draft = clone(DEFAULTS); locNameEdited = false; applyTheme(draft.theme); break;
      case "export": exportSettings(); return;
      case "import": importFile.click(); return;
      case "cancel": closePrefs(false); return;
      case "find-place": findPlace(); return;
      default: return;
    }
    renderDraft();
    if (action === "pick-icon" || action === "set-icon") {
      const panel = prefsForm.querySelector(".icon-panel");
      if (panel) panel.querySelector(".icon-filter").focus();
      else prefsForm.querySelector(`.row[data-kind="${kind}"][data-index="${i}"] .icon-pick`).focus();
    }
    if (action.startsWith("add-")) {
      const box = { "add-link": prefLinks, "add-marker": prefMarkers }[btn.dataset.action] || prefSearches;
      const last = box.lastElementChild;
      if (last) last.querySelector(action === "add-marker" ? '[data-field="from"]' : '[data-field="label"]').focus();
    }
  });

  // cerca le coordinate della località scritta nel nome (geocodifica di Open-Meteo,
  // gratuita e senza chiave). Si cerca solo la parte prima della virgola: il risultato
  // viene salvato come "Città, Regione" e così si può cercare di nuovo.
  // Coordinate arrotondate a 4 decimali (circa 10 m). Restituisce true se ha trovato la località.
  async function findPlace() {
    if (findBtn.disabled) return false;  // ricerca già in corso
    const nameInput = prefsForm.querySelector('input[name="locName"]');
    const fail = msg => { prefsError.textContent = msg; prefsError.classList.remove("info"); nameInput.classList.add("bad"); nameInput.focus(); return false; };
    const q = (draft.location.name || "").split(",")[0].trim();
    if (!q) return fail("Type the name of the place to find.");
    const text = findBtn.textContent;
    findBtn.disabled = true;
    findBtn.textContent = "Finding…";
    prefsError.textContent = "";
    try {
      const res = await fetch("https://geocoding-api.open-meteo.com/v1/search?count=1&format=json&language=" + document.documentElement.lang + "&name="
                              + encodeURIComponent(q));
      if (!res.ok) throw new Error(res.status);
      const r = ((await res.json()).results || [])[0];
      if (!dlg.open) return false;  // finestra chiusa nel frattempo
      if (!r) return fail(`No place found for "${q}".`);
      const round = n => Math.round(n * 1e4) / 1e4;
      draft.location = {
        name: [r.name, r.admin1 && r.admin1 !== r.name ? r.admin1 : r.country].filter(Boolean).join(", "),
        lat: round(r.latitude), lon: round(r.longitude)
      };
      locNameEdited = false;
      renderDraft();
      return true;
    } catch (e) {
      return fail("Search failed (are you online?): enter the coordinates by hand.");
    } finally {
      findBtn.disabled = false;
      findBtn.textContent = text;
    }
  }
  // ----- Esportazione e importazione delle preferenze -----
  // Si esportano le preferenze salvate (non la bozza, che potrebbe non essere valida).
  // L'importazione carica il file nella bozza: diventa effettiva solo con Save, dopo la validazione.
  const importFile = document.getElementById("import-file");
  function exportSettings() {
    const data = { app: "startpage", version: 1, exported: new Date().toISOString(), settings };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2) + "\n"], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    const d = new Date(), p = n => String(n).padStart(2, "0");
    a.download = `startpage-settings-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  importFile.addEventListener("change", async () => {
    const file = importFile.files[0];
    importFile.value = "";  // permette di scegliere di nuovo lo stesso file
    if (!file) return;
    let data = null;
    try { data = JSON.parse(await file.text()); } catch (e) {}
    // accetta sia il file esportato ({ app, settings }) sia l'oggetto delle preferenze da solo
    const s = data && data.app === "startpage" ? data.settings : data;
    const known = ["language", "theme", "yearView", "searches", "links", "markers", "location"];
    if (!s || typeof s !== "object" || Array.isArray(s) || !known.some(k => k in s)) {
      prefsError.textContent = "This file does not contain startpage preferences.";
      prefsError.classList.remove("info");
      return;
    }
    draft = normalizeSettings(s);
    iconPicker = "";
    locNameEdited = false;
    applyTheme(draft.theme);
    renderDraft();
    prefsError.textContent = "Preferences loaded from the file: press Save to keep them.";
    prefsError.classList.add("info");
  });

  // Invio nel campo del nome avvia la ricerca invece di salvare
  prefsForm.querySelector('input[name="locName"]').addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); findPlace(); }
  });

  // validazione e salvataggio
  prefsForm.addEventListener("submit", async e => {
    e.preventDefault();
    // nome della località cambiato senza cercarlo: cerca ora, altrimenti le
    // coordinate resterebbero quelle della località precedente
    if (locNameEdited && (draft.location.name || "").trim() && !(await findPlace())) return;
    // le righe dei collegamenti lasciate vuote vengono scartate
    iconPicker = "";  // le righe vuote vengono tolte: gli indici cambiano
    draft.links = draft.links.filter(l => (l.label || "").trim() || (l.url || "").trim());
    draft.markers = draft.markers.filter(m => (m.label || "").trim() || m.from || m.to);
    renderDraft();
    const errors = [];
    const bad = (row, field, msg) => {
      row.querySelector(`[data-field="${field}"]`).classList.add("bad");
      errors.push(msg);
    };
    const keys = new Set();
    [...prefSearches.querySelectorAll(":scope > .row")].forEach((row, i) => {
      const s = draft.searches[i];
      s.label = (s.label || "").trim();
      if (!s.label) bad(row, "label", "A search engine has no label.");
      if (s.engine === "custom") {
        s.url = normUrl(s.url);
        row.querySelector('[data-field="url"]').value = s.url;
        if (!/^https?:\/\/\S*%s/.test(s.url)) bad(row, "url", "A custom search address must contain %s.");
      }
      s.key = (s.key || "").trim().toLowerCase().slice(0, 1);
      if (s.key) {
        if (keys.has(s.key)) bad(row, "key", `The key "${s.key}" is used twice.`);
        keys.add(s.key);
      }
    });
    [...prefLinks.querySelectorAll(":scope > .row")].forEach((row, i) => {
      const l = draft.links[i];
      l.label = (l.label || "").trim();
      l.url = normUrl(l.url);
      row.querySelector('[data-field="url"]').value = l.url;
      if (!l.label) bad(row, "label", "A link has no label.");
      if (!/^https?:\/\/\S+$/.test(l.url)) bad(row, "url", "A link has an invalid address.");
    });
    [...prefMarkers.children].forEach((row, i) => {
      const mk = draft.markers[i];
      mk.label = (mk.label || "").trim();
      mk.yearly = !!mk.yearly;
      if (!parseYMD(mk.from)) bad(row, "from", "A marker has no date.");
      if (!mk.label) bad(row, "label", "A marker has no name.");
      // date ISO: il confronto tra stringhe segue l'ordine cronologico.
      // Per i marcatori annuali una fine "prima" dell'inizio è un periodo a cavallo di capodanno.
      if (!mk.yearly && mk.to && parseYMD(mk.from) && mk.to < mk.from)
        bad(row, "to", "A marker ends before it starts.");
    });
    const loc = draft.location;
    loc.name = (loc.name || "").trim();
    const lat = parseCoord(loc.lat, 90), lon = parseCoord(loc.lon, 180);
    const locBad = name => { prefsForm.querySelector(`input[name="${name}"]`).classList.add("bad"); };
    if (lat === null) { locBad("lat"); errors.push("Latitude must be a number between -90 and 90."); }
    else loc.lat = lat;
    if (lon === null) { locBad("lon"); errors.push("Longitude must be a number between -180 and 180."); }
    else loc.lon = lon;
    if (errors.length) {
      prefsError.textContent = errors[0];
      const first = prefsForm.querySelector(".bad");
      if (first) first.focus();
      return;
    }
    settings = clone(draft);
    applySettings();
    if (!saveSettings(settings)) {
      // finestra lasciata aperta, altrimenti il messaggio non si vedrebbe
      prefsError.classList.remove("info");
      prefsError.textContent = "Could not save in the browser: changes last only while the page stays open.";
      return;
    }
    closePrefs(true);
  });

  function openPrefs() {
    draft = clone(settings);
    iconPicker = "";
    locNameEdited = false;
    renderDraft();
    dlg.showModal();
  }
  function closePrefs(saved) {
    if (!saved) applyTheme(settings.theme);  // annulla l'anteprima del tema
    dlg.close();
  }
  dlg.addEventListener("cancel", e => { e.preventDefault(); closePrefs(false); }); // tasto Esc
  // clic sullo sfondo: chiude solo se anche la pressione è iniziata sullo sfondo, così
  // selezionare il testo di un campo trascinando fuori dalla finestra non perde le modifiche
  let pressedOnBackdrop = false;
  dlg.addEventListener("pointerdown", e => { pressedOnBackdrop = e.target === dlg; });
  dlg.addEventListener("click", e => { if (e.target === dlg && pressedOnBackdrop) closePrefs(false); });
  document.getElementById("open-prefs").addEventListener("click", openPrefs);

  // ---------- Favicon: il giorno del mese ----------
  // Disegnata su canvas e usata come PNG, così funziona in tutti i browser (Safari compreso).
  // Segue il tema chiaro/scuro del sistema, perché è quello delle schede del browser.
  function renderFavicon(now) {
    const S = 64, c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d");
    const dark = darkQuery && darkQuery.matches;
    const round = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
    // foglio del calendario
    round(2, 2, S - 4, S - 4, 12);
    g.fillStyle = dark ? "#2c2c30" : "#ffffff";
    g.fill();
    if (!dark) { g.lineWidth = 2; g.strokeStyle = "#d6d6d6"; g.stroke(); }
    // fascia superiore arancione
    g.save();
    round(2, 2, S - 4, S - 4, 12);
    g.clip();
    g.fillStyle = "#f0912f";
    g.fillRect(0, 0, S, 12);
    g.restore();
    // numero grande, senza grazie e in grassetto per leggerlo anche a 16 px
    const day = String(now.getDate());
    g.fillStyle = dark ? "#f2f0ed" : "#1a1a1a";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = `700 ${day.length > 1 ? 44 : 48}px -apple-system, "Helvetica Neue", Arial, sans-serif`;
    g.fillText(day, S / 2, 39);
    document.getElementById("favicon").href = c.toDataURL("image/png");
  }
  if (darkQuery) darkQuery.addEventListener("change", () => renderFavicon(new Date()));

  // ---------- Loop ----------
  // controlla ogni secondo se è cambiato il giorno; il pallino del sole ogni 30 s
  setInterval(() => { const now = new Date(); if (key(now) !== lastDay) renderDay(now); }, 1000);
  setInterval(() => renderSunDot(new Date()), 30000);

  // Orologio analogico: movimento continuo (sweep) a ogni frame
  const sweep = () => { renderAnalog(new Date()); requestAnimationFrame(sweep); };
  requestAnimationFrame(sweep);

  // Focus sulla prima ricerca all'apertura
  const focusFirstSearch = () => { const i = document.getElementById("q-0"); if (i && !dlg.open) i.focus(); };
  focusFirstSearch();
  window.addEventListener("load", focusFirstSearch);

  // Scorciatoie: il tasto scelto nelle preferenze porta al relativo campo di ricerca
  document.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || e.altKey || dlg.open) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
      if (e.key === "Escape") document.activeElement.blur();
      return;
    }
    const i = settings.searches.findIndex(s => s.key && s.key === e.key.toLowerCase());
    if (i >= 0) {
      e.preventDefault();
      const input = document.getElementById("q-" + i);
      input.focus();
      input.select();
    }
  });
})();
