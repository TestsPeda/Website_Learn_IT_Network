# Design: Thema 19 (OSI-Modell) + Optimierung der FUIT-Lernwebsite

**Datum:** 2026-07-07 · **Projekt:** `_Test_Themen_10-15` (statische Lern-/Selbsttest-Website, GitHub Pages)
**Vorgabe:** Kein Commit/Push — alle Änderungen bleiben ausschließlich im Arbeitsverzeichnis.

## Kontext

Die Website deckt die FUIT-Themen 1–18 ab (18 Themenseiten mit 288 Aufgabenkarten, `lernseite.html`
mit 18 Konzept-Abschnitten und 63 SVGs, `pruefung.html` als Probe-SA mit 26 Auswahl- + 4 offenen
Aufgaben, Startseite mit Sterntopologie + 5 Mini-Spielen). Stack: statisches HTML, Vanilla JS
(ES5-Stil), keine Abhängigkeiten, kein Build-Schritt, CSP `script-src 'self'`, lokale Fonts,
Print-CSS, Node-Selbsttests (`assets/content.test.js`, `assets/pruefung.test.js`).

Im Workspace liegt neu der Ordner `19. OSI-Modell/` (OSI.pdf, TCP IP.pdf, Windows Netzwerktools.pdf,
Fehlerquellen.png, Vorlage.xlsx). Die Website, das CLAUDE.md-Routing und ein `_INHALT.md` für den
Ordner fehlen. Nutzer-Entscheidungen (bestätigt): **Vollintegration** von Thema 19 inkl. Probe-SA;
Schwerpunkte **Inhalts-Audit 1–18, UX/Animationen, Code-Qualität, Barrierefreiheit**; Ansatz **B**
(Erweiterung + gezielte Optimierung, kein Architektur-Umbau).

## Ziele

1. Thema 19 vollständig integrieren (Themenseite, Lernseite, Navigation, Startseite/Spiele, Probe-SA).
2. Inhalte ausschließlich aus dem Workspace-Material — kein Stoff über die Unterrichtsmitschriften hinaus.
3. Bestehende Themen 1–18 gegen das Workspace-Material auditieren; Zähler/Beschriftungen korrigieren.
4. MC-Persistenz + Themen-Fortschritt (schließt Diskrepanz zwischen README-Versprechen und Verhalten).
5. Dezente, abschaltbare Animationen; vertiefter A11y-Pass; erweiterte Selbsttests.
6. Workspace-Hygiene: `_INHALT.md` für Ordner 19, CLAUDE.md-Routing-Zeile 19.

## Nicht-Ziele

- Kein Framework, kein Build-Schritt, keine externen Ressourcen (CSP bleibt unverändert streng).
- Kein datengetriebener Umbau (Fragen bleiben statisches HTML).
- Kein Commit/Push, keine Änderung am GitHub-Pages-Deployment.
- Keine inhaltliche Vertiefung über die Quelldateien hinaus.

## 1. Neue Themenseite `19-osi-modell.html`

Aufbau exakt nach Muster von `18-vlan.html` (Topbar mit Nav, Hero mit Pills, Controls,
Sektionen mit `sec-head`, Aufgabenkarten `article.q`, Skripte `quiz.js` + `code.js`).

**Sektionen (Quelle → Inhalt):**
- **A · OSI-Modell** (`OSI.pdf`): konzeptionelles Modell (gibt Funktionalitäten vor, nicht das Wie);
  7 Schichten mit deutschen Namen aus der Mitschrift (Physische Schicht, Datenverbindungsschicht
  mit LLC + MAC, Netzwerkschicht, Transportschicht, Sitzungsschicht mit Kontrollpunkten,
  Darstellungsschicht, Anwendungsschicht); 5 Vorteile.
- **B · TCP/IP-Modell & Vergleich** (`TCP IP.pdf`): protokollgestütztes Modell; 4 Schichten
  (Netzwerkzugangsschicht, Internetschicht, Transportschicht, Anwendungsschicht); 4 Vorteile;
  Gegenüberstellung OSI ↔ TCP/IP.
- **C · Windows-Netzwerktools** (`Windows Netzwerktools.pdf`, `Vorlage.xlsx`): ipconfig, ping (ICMP),
  tracert, nslookup (DNS; Beispiel Berufsschul-Webserver 213.95.20.51), arp, netstat (TCP);
  systematisches Troubleshooting nach Schichten 1–4 (Vorlage: OSI-Schicht → zu prüfende
  Hardware/Protokoll → Werkzeug → Überprüft).
- **D · Fehlerquellen** (`Fehlerquellen.png`): Fehlerquellen aus der Kartenabfrage (z. B. LAN-Kabel,
  AP defekt, WLAN-Treiber, falsch gepatcht, kaputter Switch, Netzwerkkarte defekt, Router-Konfig,
  DHCP, Störung beim Provider, Firewall blockt Endgerät) den OSI-Schichten zuordnen; Vorgehen bottom-up.

**Aufgaben:** ca. 16 Karten — Mix aus Single-/Multi-Choice, Ausfüll-Tabelle (`?`-Zellen:
Tool → Schicht), Zuordnungs-/Szenarioaufgaben mit Musterlösung, genau **1 KI-Freitextaufgabe**
(`data-ki-max`, `template.prompt-tpl` mit `{{CODE}}`, `.code-input`, `.q-copyprompt`),
damit die Seite in die `kiPages`-Testliste aufgenommen werden kann.

**Diagramme:** 4 inline SVGs mit `role="img"` + aussagekräftigem `aria-label`;
Farbcodierung stets mit Text-Label kombiniert (WCAG 1.4.1):
1. OSI-Schichtenturm (7 Schichten, nummeriert, mit Kurzfunktion) — mit Datenfluss-Animation (s. §5).
2. OSI ↔ TCP/IP-Mapping (Gegenüberstellung).
3. Kapselung: Daten → Segment → Paket → Frame → Bits.
4. Troubleshooting-Leiter (Schicht 1→4 mit Werkzeug je Schicht, nach `Vorlage.xlsx`).

## 2. Integration in Bestand

- **Navigation:** `<a href="19-osi-modell.html">19</a>` in der Topbar aller 21 Seiten (nach 18,
  vor „Lernen"); Brand-Text `Themen 1–18` → `Themen 1–19`; `index.html`-Hero und -Pills sowie
  alle Texte mit „1–18"/„Achtzehn" aktualisiert; `<title>`s konsistent.
- **Startseite/Spiele (`assets/explore.js`):** TOPICS-Array um Eintrag 19 erweitert (Nummer, Datei,
  Titel, Icon/Emoji, Suchbegriffe wie „OSI", „TCP/IP", „ipconfig", „ping", „tracert", „nslookup");
  alle Ansichten (Sterntopologie, Schnellsuche, Memory, Quiz-Tor, Schatzsuche, Glücksrad, Snake)
  müssen mit 19 Einträgen korrekt funktionieren (Layout/Zähler prüfen, keine hartkodierten 18er).
- **Lernseite (`lernseite.html`):** neuer Abschnitt „OSI-Modell & TCP/IP" (h2, Muster der übrigen
  Abschnitte) mit Konzept-Zusammenfassung + 2–3 der o. g. SVGs; interne Sprungnavigation ergänzt.
- **Probe-SA (`pruefung.html` + `assets/pruefung.js`):** +4 Auswahlfragen zu Thema 19
  (26 → 30 `exam-q`, `data-answer` korrekt); +1 offene Aufgabe
  `{ id: "open-osi", label: "Aufgabe O5 · OSI-Troubleshooting", max: 3 }` (4 → 5 OPEN_TASKS);
  `DURATION` 70 → 80 min; Punkte-/Notenlogik bleibt unverändert (skaliert automatisch).
- **README.md:** Themenliste 1–19, korrigierte Zähler (Aufgaben/Diagramme/Seiten), Beschreibung
  der neuen Persistenz/Fortschrittsanzeige.

## 3. Inhalts-Audit Themen 1–18

Je Themenseite Abgleich gegen die Schlüsseldateien laut CLAUDE.md-Routing (nur vorhandenes
Material; erkannte fachliche Fehler oder fehlende Kernpunkte der Mitschriften werden ergänzt/
korrigiert, Umfang bleibt maßvoll). Beschriftungs-/Zähler-Fixes überall
(„287 Aufgaben" ist schon heute falsch — tatsächlich 288; nach Erweiterung neu zählen und
die Zähler künftig per Test gegen den Ist-Stand prüfen).

## 4. MC-Persistenz + Themen-Fortschritt

**Problem:** README verspricht Wiederherstellung aller Antworten; tatsächlich persistieren nur
Freitexte (`fuit-answer:*`, `fuit-code:*`) und Prüfungsergebnisse — MC-Zustände gehen verloren.

**Lösung (`assets/quiz.js`):**
- Beim Bewerten einer Karte Ergebnis speichern: Key `fuit-mc:<pathname>#<q-num>`,
  Wert kompakt (gewählte Option(en) + richtig/falsch). `try/catch` wie bestehende Helfer.
- Beim Laden gespeicherte Karten wieder in den bewerteten Zustand versetzen
  (gleiche Klassen/`aria-checked`/Ticks wie bei Live-Bewertung; Lösung aufgedeckt).
- Neuer Button „Antworten zurücksetzen" neben „Alle Lösungen einblenden" in den `controls`
  jeder Themenseite: löscht `fuit-mc:`-Keys der Seite und stellt Karten zurück (ohne Reload
  oder mit `location.reload()` — einfachster robuster Weg).
- Score-Chip zählt wiederhergestellte Antworten mit.

**Startseiten-Fortschritt (`assets/explore.js` oder kleines Zusatzmodul):**
- Pro Thema: Anzahl beantworteter/richtig beantworteter MC-Fragen aus `fuit-mc:`-Keys lesen;
  Gesamtzahl je Seite als Konstante in der TOPICS-Datenbank hinterlegt (per Test gegen
  Ist-Stand der Seiten abgesichert).
- Anzeige als Fortschrittsring/-balken am Themen-Knoten der Sterntopologie + in der Schnellsuche;
  `aria-label` mit Klartext („Thema 12: 8 von 16 beantwortet").

## 5. Animationen (dezent, CSS-first, abschaltbar)

Umsetzung nach den recherchierten Best Practices (web.dev/MDN):

- **OSI-Datenfluss** (Seite 19, Diagramm 1): kleines „Paket"-Element wandert die Schichten
  hinab, über das Medium und beim Empfänger hinauf (CSS `@keyframes`, nur `transform`/`opacity`
  — compositor-freundlich; Dauer ~8 s, dezent, Schleife mit Pause). Play/Pause-Button (JS, CSP-konform).
- **SVG-Spezifik:** animierte SVG-Elemente erhalten `transform-box: fill-box` +
  `transform-origin: center` (sonst rotieren/skalieren sie um den SVG-Canvas-Ursprung).
- **Lösungs-Reveal:** sanftes Einblenden der `.q-solution` (opacity/translateY, ~200 ms).
- **Fortschrittsanzeige:** animierter Füllstand beim ersten Rendern.
- **Reduced Motion invertiert (sicherer Default):** Bewegungs-Animationen werden ausschließlich
  innerhalb `@media (prefers-reduced-motion: no-preference) { … }` definiert — ohne Präferenz-Signal
  gibt es keine Bewegung. JS-getriebene Animationen koppeln an
  `matchMedia("(prefers-reduced-motion: reduce)")` **inkl. `change`-Listener** (Laufzeit-Umschaltung).
- Keine Layout-triggernden Properties (kein width/height/top-Animieren), `will-change` nur gezielt
  und temporär, keine Endlos-Bewegung im Sichtfeld beim Lesen (Ablenkungsarmut).

## 6. Barrierefreiheit (A11y-Pass)

Umsetzung nach W3C-WAI/APG/NN-g (Research-Ergebnis):

- **Probe-SA-Timer (WCAG 2.2.1, WAI-Präferenz „abschalten > einstellen > verlängern"):**
  Vor dem Start Checkbox **„Ohne Zeitlimit üben"** (Timer aus; Ergebnis wird im Verlauf als
  „ohne Zeitlimit" markiert) **plus** Button „+10 min" während des Laufs (mind. 10× nutzbar);
  Warnung bei knapper Zeit über `aria-live="polite"` mit ausreichender Reaktionszeit.
- **Fokus-Management (Disclosure-Pattern):** Nach „Lösung anzeigen" bleibt der Fokus auf dem
  Button, nur `aria-expanded` toggelt; kein Fokus-Sprung in den Inhalt.
- **Ergebnis-Ansagen:** Bewertungsergebnis (richtig/falsch, Score-Chip) zusätzlich in einen
  Container mit `role="status"` schreiben — Screenreader kündigt an, ohne Fokus zu stehlen.
- **Kontraste:** Text ≥ 4.5:1; bedeutungstragende Grafikelemente und UI-Zustände (gewählte
  Antwort, Fokusring, SVG-Linien/Knoten) ≥ 3:1 zur angrenzenden Farbe (WCAG 1.4.11);
  SVG-Grautöne (z. B. `#5C6B78`) prüfen und ggf. nachdunkeln.
- **Farbe nie alleiniger Träger (WCAG 1.4.1):** Diagramme kombinieren Farbe mit Textlabeln,
  Formen oder Linientypen (gestrichelt/durchgezogen) — bestehende ✓/✕-Ticks beibehalten.
- **Eingaben erhalten (NN-g):** Freitext-Antworten bleiben beim Aufdecken der Musterlösung
  unverändert stehen (Ist-Verhalten — absichern per Test); exploratives Anklicken bei
  Multi-Select wird weiterhin erst bei „Auswerten" bewertet.
- **Spiele:** Tastaturbedienbarkeit prüfen (Fokusreihenfolge, sichtbarer Fokus, Snake/Memory
  mit Tastatur steuerbar oder klar übersprungbar); Tab-Leiste der Startseite folgt dem
  APG-Tabs-Pattern (roving tabindex, Pfeiltasten — Ist-Stand prüfen).

## 6a. Performance der Lernseite

- `content-visibility: auto` + `contain-intrinsic-size: auto 800px` auf die Themen-Sektionen
  der `lernseite.html` (web.dev: übersprungenes Rendering off-screen, typ. > 50 % schnelleres
  Initial-Rendering; Strg+F und Anker-Links funktionieren weiter, Inhalt bleibt im A11y-Tree).
- Print-Override: `@media print { .lern-sektion { content-visibility: visible; } }`,
  damit der PDF-Export vollständig rendert.

## 7. Tests & Verifikation

**`assets/content.test.js` erweitern:**
- `allTopics` + `kiPages` um `19-osi-modell.html`; explore.js-Erwartung 18 → 19 Einträge.
- `exam-q === 30`, `open-q === 5`; keine veralteten „1–18"/„Achtzehn"-Beschriftungen in
  Topbar/Hero (Negativ-Checks analog zu bestehenden „16er"-Checks).
- Neue Checks: Zähler der Startseiten-Pills stimmen mit gezählten `article.q`/SVG-Beständen
  überein; jede Themenseite hat den Nav-Link auf 19; MC-Persistenz-Marker in quiz.js vorhanden.
- `assets/pruefung.test.js` an neue Aufgabenzahl/Dauer anpassen.

**Verifikation vor Abschluss:**
1. `node assets/content.test.js` und `node assets/pruefung.test.js` fehlerfrei.
2. Browser-Durchlauf (Chrome DevTools MCP): Startseite (alle 7 Ansichten), Seite 19
   (MC bewerten, Multi-Select, Tabelle ausfüllen, KI-Prompt kopieren, Reload → Zustand erhalten,
   Reset-Button), Lernseite (Abschnitt 19, Anker), Probe-SA (Start, +10 min, Abgeben, Note),
   Konsole ohne Fehler, reduced-motion-Emulation ohne Animationen.
3. Stichprobe Print-Ansicht (Lösungen aufgedeckt, Bedienelemente ausgeblendet).

## 8. Workspace-Hygiene (außerhalb des Website-Ordners)

- `19. OSI-Modell/_INHALT.md` neu: beschreibt `Fehlerquellen.png` (Kartenabfrage) und
  `Vorlage.xlsx` (Troubleshooting-Tabelle); PDFs sind direkt lesbar → nur Verweis.
- `CLAUDE.md`: Routing-Zeile 19 (Ordner, Schlüsseldateien, Notion-Abschnitt offen/„—",
  da Notion-Sync nicht Teil dieses Auftrags) + Hinweis in der Hilfsmaterial-Tabelle,
  dass die Test-Website nun 1–19 abdeckt.

## Fehlerbehandlung & Risiken

- localStorage kann fehlen/voll sein → alle Zugriffe in `try/catch` (Muster besteht bereits);
  Website bleibt ohne Speicher voll funktionsfähig.
- Alte gespeicherte Zustände (bestehende Nutzer): neue `fuit-mc:`-Keys kollidieren nicht mit
  bestehenden Keys; Prüfungs-Verlauf (`fuit:probe-sa:results`) bleibt kompatibel — neue Versuche
  haben andere Maximalpunkte, Anzeige rechnet pro Eintrag (bereits gespeicherte Max-Werte je Versuch).
- Spiele-Layouts mit 19 statt 18 Einträgen (ungerade Zahl: Memory braucht Paar-Logik-Check!) —
  Memory legt Paare pro Thema, 19 Paare = 38 Karten: Grid-Layout prüfen; ggf. Spaltenzahl anpassen.
- OneDrive-Pfad: keine Datei-Locks erwartet; Tests laufen lokal mit Node.
