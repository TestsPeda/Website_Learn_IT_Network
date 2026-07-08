# Thema 19 (OSI-Modell) + Website-Optimierung — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thema 19 (OSI-Modell/TCP-IP/Windows-Tools) vollständig in die FUIT-Lernwebsite integrieren und die Website gemäß Spec optimieren (Audit, MC-Persistenz + Fortschritt, Animationen, A11y, Performance, Tests, Workspace-Hygiene).

**Architecture:** Statische Website ohne Build-Schritt; jede Änderung folgt exakt den bestehenden Mustern (Aufgabenkarten `article.q`, Vanilla-JS-IIFEs, Node-Selbsttests). Neue Features (Persistenz, Fortschritt, Animationen) werden additiv in `quiz.js`/`explore.js`/`style.css` integriert.

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES5-Stil), Node (nur Selbsttests), Chrome DevTools MCP (Verifikation).

**Spec:** `docs/superpowers/specs/2026-07-07-thema19-optimierung-design.md`

## Global Constraints

- **KEIN `git commit`, KEIN `git push`** — alle Änderungen bleiben im Arbeitsverzeichnis (Nutzer-Vorgabe). Task-Abschluss = Testlauf, nicht Commit.
- Keine externen Ressourcen; CSP-Header bleibt auf jeder Seite unverändert: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'`.
- Inhalte NUR aus den Workspace-Quellen (`19. OSI-Modell/*`, CLAUDE.md-Routing für 1–18) — kein Stoff über die Mitschriften hinaus.
- Deutsch als Inhaltssprache, Terminologie der Mitschriften (z. B. „Physische Schicht", „Datenverbindungsschicht", „Sitzungsschicht").
- Bewegungs-Animationen ausschließlich in `@media (prefers-reduced-motion: no-preference)`; nur `transform`/`opacity` animieren; SVG-Animationen mit `transform-box: fill-box; transform-origin: center`.
- Arbeitsverzeichnis aller Pfade: `C:\Users\PVK\OneDrive - Hahn Softwareentwicklung GmbH\BSZ\BSZ-Workspace\FU-IT\_Test_Themen_10-15\` (Workspace-Hygiene-Task 12 liegt eine Ebene höher).
- Testlauf immer: `node assets/content.test.js` und `node assets/pruefung.test.js` (im Website-Ordner).

---

### Task 1: Themenseite `19-osi-modell.html`

**Files:**
- Create: `19-osi-modell.html`
- Modify: `assets/content.test.js:15-20` (kiPages, allTopics)
- Test: `assets/content.test.js`

**Interfaces:**
- Produces: Seite `19-osi-modell.html` mit Topbar-Nav-Muster (`<a href="19-osi-modell.html" class="current">19</a>`), 16 `article.q`-Karten, 4 SVGs, 1 KI-Aufgabe. Spätere Tasks (2, 3, 8) verlinken exakt auf diesen Dateinamen.

- [ ] **Step 1: Failing Test — Listen erweitern**

In `assets/content.test.js` beide Listen erweitern:

```js
const kiPages = ["10-adressierung.html","11-dhcp-dns.html","13-topologien.html","14-speichersysteme.html",
  "15-raid.html","16-email-protokolle.html","17-netzwerktechnologien.html","18-vlan.html",
  "19-osi-modell.html"];
const allTopics = ["1-grundbegriffe","2-verkabelungsplan","3-uebertragungsmedien","4-stueckliste",
  "5-geraeteklassen","6-strukturierte-verkabelung","7-it-infrastruktur","8-edgecomputing",
  "9-server-betriebssystem","10-adressierung","11-dhcp-dns","12-uebertragungsarten","13-topologien",
  "14-speichersysteme","15-raid","16-email-protokolle","17-netzwerktechnologien","18-vlan",
  "19-osi-modell"].map(n=>n+".html");
```

- [ ] **Step 2: Test rot laufen lassen**

Run: `node assets/content.test.js` → Expected: FAIL (ENOENT `19-osi-modell.html`).

- [ ] **Step 3: Seite bauen**

`19-osi-modell.html` nach dem exakten Muster von `18-vlan.html` (gleicher `<head>` inkl. CSP, `code.css`, Topbar mit Nav 1–19 — Link 19 mit `class="current"` —, Hero, Controls, Skripte `quiz.js` dann `code.js`). Hero: Eyebrow „Referenzmodelle & Troubleshooting", `#19`, Titel „OSI-Modell — Referenzmodelle & Netzwerk-Troubleshooting", Pills `16 Aufgaben / 4 Diagramme / MC · Multi-Select · Zuordnung · KI-Freitext`.

**Sektion A · Das OSI-Modell** (Quelle OSI.pdf): Intro-Text: konzeptionelles Modell (gibt Funktionalitäten vor, nicht *wie*); hilft beim Verstehen, Designen, Fehlerbeheben. **SVG 1 „OSI-Schichtenturm"**: 7 gestapelte Rechtecke (unten 1 → oben 7) mit Nr., deutschem Namen und Kurzfunktion (1 Physische Schicht — Bits/Kabel/Funk/Bitrate · 2 Datenverbindungsschicht — Rahmen, LLC + MAC · 3 Netzwerkschicht — Routing, IP-Adressen · 4 Transportschicht — Segmente · 5 Sitzungsschicht — Sitzungen, Kontrollpunkte · 6 Darstellungsschicht — codieren/verschlüsseln/komprimieren · 7 Anwendungsschicht — Browser, E-Mail); daneben ein animierbares „Paket"-Rechteck (`class="osi-paket"`, Animation erst in Task 9). Farbpalette der Website (`#16242E`, `#15786E`, `#DD5430`, `#E4F1EF`, `#FBEAE3`), jede Schicht mit Textlabel (nie nur Farbe).

Aufgaben A (Muster: `article.q` mit `q-head`/`q-num`/`q-type`/`q-src`/`q-pts`, Optionen `ul.q-options > li.opt` mit `span.tick`, Lösung `div.q-solution`):
1. **MC** „Was für ein Modell ist das OSI-Modell?" — richtig: *konzeptionelles Modell: gibt die Funktionalitäten der Schichten vor, aber nicht, wie sie zu erfüllen sind*; Distraktoren: protokollgestütztes Modell / physisches Gerätemodell / Verschlüsselungsstandard.
2. **Ausfüll-Tabelle** (`?`-Zellen, `initTableInputs`-Muster): Spalten „Nr. | Schichtname"; Zeilen 1–7, Namen als `?`. Lösung: vollständige Tabelle.
3. **MC** „Welche Schicht zerlegt Pakete in Rahmen und besteht aus LLC und MAC?" — richtig: Datenverbindungsschicht (Schicht 2).
4. **Multi-Select** „Welche Aufgaben übernimmt der LLC-Teil der Schicht 2?" — richtig: identifiziert Netzwerkprotokolle · führt Fehlerprüfungen durch · synchronisiert Rahmen; falsch: verwendet MAC-Adressen zum Verbinden von Geräten (= MAC-Teil) · routet Pakete (= Schicht 3).
5. **MC** „Wofür sind die Kontrollpunkte der Sitzungsschicht gut?" — richtig: Bei Unterbrechung kann die Übertragung ab dem letzten Kontrollpunkt fortgesetzt werden.
6. **Multi-Select** „Vorteile des OSI-Modells" — richtig (aus den 5 Bullets): erleichtert Identifizierung benötigter Hard-/Software · unterstützt Verstehen der Kommunikation · hilft bei Fehlerbehebung durch Schicht-Identifikation · ermöglicht Herstellern offene Interoperabilität; falsch: legt konkrete Protokolle je Schicht fest · macht Netzwerke automatisch schneller.

**Sektion B · TCP/IP-Modell & Vergleich** (Quelle TCP IP.pdf): Intro: protokollgestütztes Modell (gibt Protokolle je Schicht vor); Aufgabe: zuverlässige/genaue Übertragung. **SVG 2 „OSI ↔ TCP/IP"**: links 7 OSI-Schichten, rechts 4 TCP/IP-Schichten (Netzwerkzugangsschicht ↔ OSI 1–2, Internetschicht ↔ OSI 3, Transportschicht ↔ OSI 4, Anwendungsschicht ↔ OSI 5–7), Verbindungsbänder + Textlabels.

Aufgaben B:
7. **MC** „Worin unterscheidet sich das TCP/IP-Modell grundsätzlich vom OSI-Modell?" — richtig: TCP/IP ist protokollgestützt (gibt konkrete Protokolle vor), OSI ist konzeptionell.
8. **Ausfüll-Tabelle**: „TCP/IP-Schicht | entspricht OSI-Schicht(en)" — 4 Zeilen, OSI-Spalte als `?`. Lösung: 1–2 / 3 / 4 / 5–7.
9. **MC** „Welche Aufgabe hat die Internetschicht?" — richtig: Routing von Datenpaketen über das Netzwerk mittels eindeutiger IP-Adressen.
10. **Multi-Select** „Vorteile des TCP/IP-Modells" — richtig (4 Bullets): weltweit gültiger Standard, herstellerunabhängig · auf einfachen Computern bis Supercomputern implementierbar · in LANs und WANs nutzbar · macht Anwendung vom Übertragungssystem unabhängig; falsch: schreibt eine bestimmte Verkabelung vor.

**Sektion C · Windows-Netzwerktools** (Quellen: Windows Netzwerktools.pdf, Vorlage.xlsx): Intro: Tools fürs Troubleshooting; systematisch Schicht 1→4 prüfen. **SVG 3 „Troubleshooting-Leiter"**: 4 Stufen (1 Bitübertragung — Kabel/Adapter — ipconfig · 2 Sicherung — MAC/Switch — arp · 3 Vermittlung — IP/Router — ping, tracert, nslookup · 4 Transport — TCP — netstat), nach `Vorlage.xlsx`-Spalten „OSI-Schicht | zu prüfende Hardware bzw. Protokoll | Werkzeug".

Aufgaben C:
11. **Ausfüll-Tabelle** „Werkzeug | Zweck" — 6 Zeilen (ipconfig/ping/tracert/nslookup/arp/netstat), Zweck als `?`. Lösung: Netzwerkkonfiguration anzeigen / Erreichbarkeit + Laufzeiten (ICMP) / Route eines IP-Pakets aufzeichnen / DNS-Abfrage Name↔IP / ARP-Tabelle (IP↔MAC) anzeigen/ändern / offene TCP-Verbindungen anzeigen.
12. **MC** „Zu welchem Protokoll gehört ping?" — richtig: ICMP (Internet Control Message Protocol).
13. **MC** „Ein Kollege kennt nur den Namen eines Servers und braucht die IP-Adresse — welches Tool?" — richtig: nslookup (DNS wie ein Telefonbuch; Beispiel aus der Mitschrift: Berufsschul-Webserver 213.95.20.51).

**Sektion D · Fehlerquellen & systematisches Vorgehen** (Quelle Fehlerquellen.png): Intro: Fehlerquellen-Kartenabfrage; bottom-up prüfen. **SVG 4 „Fehlerquellen → Schichten"**: 4-spaltige Zuordnung mit Karten aus der PNG (Schicht 1: LAN-/RJ45-Kabel, Kabel nicht eingesteckt/abgefackelt, AP defekt, falsch gepatcht, kaputter Switch (Hardware), Netzwerkkarte defekt, Störung beim Provider · Schicht 2: WLAN-/Treiber falsch oder defekt, ARP, VLAN, Switch-Konfiguration · Schicht 3: Router/Router-Konfig, DHCP, feste IP einrichten, Proxy · Schicht 4: TCP, UDP, Endgerät wird von Firewall geblockt).
14. **Multi-Select** „Welche Fehlerquellen gehören zur Schicht 1 (Bitübertragung)?" — richtig: defektes LAN-Kabel · falsch gepatchtes Patchfeld · defekte Netzwerkkarte; falsch: falscher WLAN-Treiber (2) · DHCP-Fehlkonfiguration (3).
15. **Szenario (manuell, Musterlösung)** „PC ohne Netz: Beschreibe die systematische Fehlersuche nach Schichten 1–4 mit je einem Werkzeug." — Musterlösung: 1 Kabel/Adapter prüfen + ipconfig → 2 arp → 3 ping/tracert/nslookup → 4 netstat (nach Vorlage.xlsx).
16. **KI-Freitextaufgabe** (`data-ki-max="6"`, `.code-input`, `.q-copyprompt`, `<template class="prompt-tpl">` mit `{{CODE}}`): „Erkläre den Weg einer Nachricht vom Browser bis aufs Kabel anhand der 7 OSI-Schichten (Kapselung) und nenne, was jede Schicht beiträgt." Kriterien im Prompt: alle 7 Schichten richtig benannt (3 P.), Reihenfolge/Kapselung korrekt (2 P.), LLC/MAC erwähnt (1 P.).

- [ ] **Step 4: Test grün**

Run: `node assets/content.test.js` → Expected: OK. (Hinweis: schlägt jetzt ggf. noch bei anderen Seiten fehl, weil deren Nav den 19er-Link noch nicht hat — das ist Task 2; falls der Test bereits Nav-Checks enthält, Task 2 vorziehen. Stand heute prüft er das nicht → grün.)

---

### Task 2: Navigation & Beschriftungen auf allen Seiten

**Files:**
- Modify: alle 18 bestehenden Themenseiten (`1-grundbegriffe.html` … `18-vlan.html`), `index.html`, `lernseite.html`, `pruefung.html`
- Modify: `assets/content.test.js` (neue Checks)

**Interfaces:**
- Consumes: `19-osi-modell.html` (Task 1).
- Produces: Auf jeder Seite Nav-Link `<a href="19-osi-modell.html">19</a>` (vor „Lernen"); Brand `<b>Themen 1–19</b>` überall.

- [ ] **Step 1: Failing Tests ergänzen** (in `content.test.js`, nach dem bestehenden index-Block):

```js
/* --- Nav: Thema 19 überall verlinkt, keine veralteten 1–18-Beschriftungen --- */
for (const f of allTopics.concat(["index.html","lernseite.html","pruefung.html"])) {
  const s = read(f);
  ok(s.includes('href="19-osi-modell.html"'), f + ": Nav-Link auf Thema 19 fehlt");
  ok(!s.includes("Themen 1–18") && !s.includes("Themen 1&ndash;18"),
     f + ": veraltete Beschriftung „Themen 1–18\"");
}
{
  const s = read("index.html");
  ok(!/Achtzehn Themen/.test(s), "index: veralteter Hero-Text „Achtzehn Themen\"");
  ok(s.includes("<b>19</b> Themen"), "index: Themen-Pill nicht auf 19 aktualisiert");
}
```

- [ ] **Step 2: Rot laufen lassen** — `node assets/content.test.js` → FAIL bei jeder Seite ohne 19er-Link.

- [ ] **Step 3: Umsetzen** — in allen 21 Dateien: (a) Nav-Zeile `<a href="18-vlan.html">18</a>` um `\n    <a href="19-osi-modell.html">19</a>` ergänzen (auf Seite 19 selbst trägt der 19er-Link `class="current"`); (b) `Themen 1–18` → `Themen 1–19` (Brand, `<title>` von index, Hero-H1 „Themen 1 bis 18" → „… 19", Lede „Achtzehn Themen" → „Neunzehn Themen — … bis … VLAN und OSI-Modell/Troubleshooting"); (c) index-Pills: `18 Themen` → `19`, Aufgaben-/Diagramm-Zähler erst in Task 6 final setzen.

- [ ] **Step 4: Grün** — `node assets/content.test.js` → OK.

---

### Task 3: Startseiten-Spiele (`assets/explore.js`)

**Files:**
- Modify: `assets/explore.js` (TOPICS-Array + ggf. Layout-Konstanten)
- Modify: `assets/content.test.js:110-115` (Erwartung 18 → 19)

**Interfaces:**
- Consumes: `19-osi-modell.html`.
- Produces: TOPICS-Eintrag `{ n: 19, file: "19-osi-modell.html", … }` — exakt dem Feldschema der bestehenden Einträge folgend (vorher Eintrag 18 lesen und Felder 1:1 übernehmen: Titel „OSI-Modell", Kurzbeschreibung, Such-/Quiz-Metadaten mit Begriffen „OSI", „TCP/IP", „Schichtenmodell", „ipconfig", „ping", „tracert", „nslookup", „arp", „netstat").

- [ ] **Step 1: Test anpassen** — `entries === 18` → `entries === 19`; Meldung „erwartet 19 TOPICS-Einträge". Rot laufen lassen.
- [ ] **Step 2: TOPICS-Eintrag 19 ergänzen** (Schema von Eintrag 18 kopieren und Inhalte ersetzen). Danach alle 7 Ansichten auf hartkodierte 18er prüfen: `grep -n "18" assets/explore.js` — Zähler-Texte („x/18"), Schleifen, Grid-Spalten, Memory-Paare (19 Paare = 38 Karten → Grid-Layout prüfen, ggf. Spaltenzahl), Glücksrad-Segmentwinkel (360/19 — muss aus `TOPICS.length` berechnet sein, sonst umstellen), Snake-Ziellogik.
- [ ] **Step 3: Grün** — `node assets/content.test.js` → OK.
- [ ] **Step 4: Browser-Smoke** (Chrome DevTools MCP): index.html öffnen, alle 7 Tabs durchschalten, Konsole fehlerfrei, Sterntopologie zeigt 19 Knoten, Memory/Glücksrad/Snake funktionsfähig.

---

### Task 4: Lernseite — Abschnitt 19

**Files:**
- Modify: `lernseite.html`
- Modify: `assets/content.test.js` (h2-Check)

**Interfaces:**
- Consumes: SVG-Vorlagen aus Task 1 (Schichtenturm, OSI↔TCP/IP, Troubleshooting-Leiter — angepasste Kopien, keine identischen IDs).

- [ ] **Step 1: Failing Test**

```js
{
  const s = read("lernseite.html");
  ok(s.includes("<h2>OSI-Modell &amp; TCP/IP</h2>") || s.includes("<h2>OSI-Modell & TCP/IP</h2>"),
     "lernseite: Abschnitt 19 fehlt");
}
```

- [ ] **Step 2: Abschnitt bauen** — nach dem VLAN-Abschnitt, exakt im Muster der bestehenden Abschnitte (gleiche Wrapper-/Klassenstruktur wie „VLAN"; vorher den VLAN-Abschnitt lesen): Konzept-Zusammenfassung (OSI konzeptionell / TCP-IP protokollgestützt, 7↔4 Schichten, Kapselung, Tools je Schicht, Fehlerquellen bottom-up) + 3 SVGs (Turm, Mapping, Leiter). Interne Sprung-Navigation der Lernseite (falls vorhanden — prüfen!) um Anker 19 ergänzen.
- [ ] **Step 3: Grün** — `node assets/content.test.js` → OK.

---

### Task 5: Probe-SA erweitern (30 Auswahl + O5, 80 min)

**Files:**
- Modify: `pruefung.html` (4 neue `article.q.exam-q` + 1 `article.q.open-q`)
- Modify: `assets/pruefung.js:8` (`DURATION`), `:17-22` (`OPEN_TASKS`)
- Modify: `assets/content.test.js:81,83`, `assets/pruefung.test.js` (Erwartungen)

**Interfaces:**
- Produces: `OPEN_TASKS`-Eintrag `{ id: "open-osi", label: "Aufgabe O5 · OSI-Troubleshooting", max: 3 }`; `DURATION = 80 * 60`.

- [ ] **Step 1: Tests anpassen (rot):** `content.test.js`: `examQ === 30`, `openQ === 5`. `pruefung.test.js` lesen und Dauer-/Zähler-Erwartungen analog anpassen. Run → FAIL.
- [ ] **Step 2: 4 Auswahlfragen ergänzen** (Muster bestehender `exam-q` mit `data-answer`; Themenblock „Thema 19"):
  1. „Auf welcher OSI-Schicht arbeitet ein Router (Routing über IP-Adressen)?" → Schicht 3, Netzwerkschicht.
  2. „OSI vs. TCP/IP: Welche Aussage stimmt?" → OSI = konzeptionell (7 Schichten), TCP/IP = protokollgestützt (4 Schichten).
  3. „Mit welchem Windows-Tool zeichnet man die Route eines IP-Pakets auf?" → tracert.
  4. „Die TCP/IP-Netzwerkzugangsschicht entspricht welchen OSI-Schichten?" → 1 und 2.
- [ ] **Step 3: O5 ergänzen** — `open-q` nach Muster von O4 (`id="open-osi"`, Textarea, Prompt-Template): „Ein Rechner erreicht das Internet nicht. Beschreibe das systematische Troubleshooting nach OSI-Schichten 1–4 und nenne je Schicht ein passendes Windows-Tool." (max 3 P.; Kriterien: Reihenfolge bottom-up 1 P., Schichten korrekt 1 P., Tools passend 1 P.)
- [ ] **Step 4: `pruefung.js`:** `DURATION = 80 * 60;` (Kommentar aktualisieren) + OPEN_TASKS-Eintrag. Punkte-/Notenlogik unangetastet.
- [ ] **Step 5: Grün** — beide Testdateien → OK. Browser-Smoke: Start → Timer 80:00, Abgeben rechnet, O5 erscheint im Open-Panel und im Verlauf.

---

### Task 6: Inhalts-Audit 1–18, Zähler, README

**Files:**
- Modify: betroffene Themenseiten (nach Audit-Befund), `index.html` (Pills), `README.md`
- Modify: `assets/content.test.js` (Zähler-Ist-Check)

- [ ] **Step 1: Audit durchführen** — je Thema 1–18 die Schlüsseldateien laut Workspace-CLAUDE.md gegen die Themenseite halten (Stichprobe pro Seite: decken die Sektionen die Kernpunkte der Mitschrift ab? Fachliche Fehler?). Befunde als Liste sammeln; NUR belegbare Lücken/Fehler fixen (kein neuer Stoff). Erwartete Größenordnung: Einzelkorrekturen, keine Umbauten.
- [ ] **Step 2: Zähler-Test (rot → grün):**

```js
/* --- index-Pills stimmen mit dem Ist-Stand überein --- */
{
  let q = 0, svg = 0;
  for (const f of allTopics) {
    const s = read(f);
    q += (s.match(/<article class="q"/g) || []).length;
    svg += (s.match(/<svg /g) || []).length;
  }
  const idx = read("index.html");
  ok(idx.includes("<b>" + q + "</b> Aufgaben"), "index: Aufgaben-Pill ≠ " + q);
  ok(idx.includes("<b>" + svg + "</b> Diagramme"), "index: Diagramm-Pill ≠ " + svg);
}
```

  Dann `index.html`-Pills und Hero auf die realen Zahlen setzen (Zählweise der Diagramm-Pill dokumentieren: Summe der Themenseiten-SVGs).
- [ ] **Step 3: README.md aktualisieren** — 19 Themen + OSI-Zeile in der Themenliste, reale Zähler, neuer Absatz „Fortschritt": MC-Antworten werden jetzt tatsächlich gespeichert (nach Task 7), Reset-Button, Fortschritt auf der Startseite, „Ohne Zeitlimit üben" in der Probe-SA (nach Task 10).
- [ ] **Step 4: Grün** — `node assets/content.test.js` → OK.

---

### Task 7: MC-Persistenz + Reset + Statusausgabe

**Files:**
- Modify: `assets/quiz.js`
- Modify: alle 19 Themenseiten (Reset-Button in `.controls`)
- Modify: `assets/content.test.js`

**Interfaces:**
- Produces: localStorage-Schema `fuit-mc:<pathname>#<q-num>` mit Wert `JSON.stringify({picked:[optIndexes], ok:boolean})`; Button-ID `reset-answers`. Task 8 liest dieselben Keys.

- [ ] **Step 1: Failing Tests**

```js
{
  const s = read("assets/quiz.js");
  ok(s.includes("fuit-mc:"), "quiz.js: keine MC-Persistenz");
  ok(s.includes("restoreState"), "quiz.js: keine Wiederherstellung");
}
for (const f of allTopics) {
  ok(read(f).includes('id="reset-answers"'), f + ": kein Reset-Button");
}
{
  const s = read("assets/quiz.js");
  ok(s.includes('role="status"') || s.includes("'status'"), "quiz.js: Score ohne role=status");
}
```

- [ ] **Step 2: Implementieren in `quiz.js`** (ES5-Stil des Bestands):
  - Helfer oben: `function mcKey(q){var n=q.querySelector(".q-num");return "fuit-mc:"+location.pathname+"#"+(n?n.textContent.trim():"");}`
  - In `lockSingle()` und im Multi-`q-check`-Handler nach `markCard(...)`: Zustand speichern (`picked` = Indizes der gewählten `.opt`, `ok` = Ergebnis) via bestehendem try/catch-Muster.
  - Neue Funktion `restoreState(q)`: Key lesen; wenn vorhanden → Optionen wie bei Live-Bewertung markieren (gleiche Klassen `locked/correct/wrong/reveal-correct/picked`, `aria-checked`, Ticks ✓/✕), `markCard(q, ok)` OHNE erneutes Speichern (Flag-Parameter), `revealSolution(q,true)`. Aufruf in `DOMContentLoaded` vor `updateScore()`.
  - Reset: `initControls()` erweitert — Click auf `#reset-answers` löscht alle Keys mit Präfix `"fuit-mc:"+location.pathname` und `"fuit-answer:"+location.pathname` (Zellen + Textareas) und ruft `location.reload()`.
  - Score-Chip: im HTML bekommt `span.scorechip#scorechip` das Attribut `role="status"` (alle Themenseiten; alternativ setzt quiz.js es per JS — dann nur 1 Stelle: in `updateScore()` `chip.setAttribute("role","status")` einmalig). **Entscheidung: per JS in quiz.js — eine Stelle statt 19.** (Der Testcheck oben deckt das.)
  - Reset-Button-Markup je Themenseite: `<button class="btn" id="reset-answers">Antworten zurücksetzen</button>` hinter „Alle ausblenden".
- [ ] **Step 3: Grün + Browser-Check** — Tests OK; im Browser: Frage beantworten → Reload → Zustand wiederhergestellt, Score zählt; Reset → leer.

---

### Task 8: Themen-Fortschritt auf der Startseite

**Files:**
- Modify: `assets/explore.js` (TOPICS um `qTotal`, Rendering Stern + Schnellsuche)
- Modify: `assets/style.css` (Fortschritts-Styles)
- Modify: `assets/content.test.js` (qTotal == Ist)

**Interfaces:**
- Consumes: `fuit-mc:`-Keys aus Task 7; TOPICS aus Task 3.
- Produces: TOPICS-Feld `qTotal` (Anzahl auto-bewertbarer MC-Karten der Seite = Karten mit `.q-options`).

- [ ] **Step 1: Failing Test** (nach dem Audit sind die Zahlen stabil):

```js
/* --- explore.js: qTotal je Thema == Anzahl MC-Karten der Seite --- */
{
  const ex = read("assets/explore.js");
  for (let i = 0; i < allTopics.length; i++) {
    const s = read(allTopics[i]);
    const blocks = s.split('<article class="q"').slice(1);
    const mc = blocks.filter(b => b.indexOf('class="q-options"') !== -1
      && b.indexOf('class="q-options"') < (b.indexOf('<article class="q"') + 1 || Infinity)).length;
    const m = ex.match(new RegExp('\\{ n: ' + (i + 1) + ',[^}]*qTotal: (\\d+)'));
    ok(m, "explore.js: qTotal für Thema " + (i + 1) + " fehlt");
    ok(m && parseInt(m[1], 10) === mc,
       "explore.js: qTotal Thema " + (i + 1) + " = " + (m && m[1]) + ", Seite hat " + mc);
  }
}
```

  (Zählung „MC-Karten": `article.q`-Blöcke, die eine `q-options`-Liste enthalten. Die Split-Logik oben zählt pro Block nur die eigene Liste — beim Implementieren mit realen Zahlen gegenprüfen.)
- [ ] **Step 2: `qTotal` in alle 19 TOPICS-Einträge eintragen** (Werte per Zählung, z. B. `grep -c` je Datei mit Block-Zuordnung).
- [ ] **Step 3: Rendering:** Stern-Knoten und Schnellsuche-Liste bekommen einen Fortschritts-Indikator: kleine Leiste/Ring, gefüllt = `beantwortet/qTotal` (aus `localStorage`-Keys `fuit-mc:/<file-pathname>#…` gezählt; Pfad-Präfix wie quiz.js über `location.pathname`-Ableitung des Zielpfads: `new URL(file, location.href).pathname`). `aria-label` z. B. „Thema 12: 8 von 16 beantwortet, 6 richtig". CSS: `.node-progress { … }` mit `transform: scaleX(var(--p))`-Füllung (compositor-freundlich); Einfärbung + Textlabel (Zahl), nicht nur Farbe.
- [ ] **Step 4: Grün + Browser-Check** — Tests OK; Browser: Thema beantworten, zurück zur Startseite → Fortschritt sichtbar; localStorage leeren → 0.

---

### Task 9: Animationen

**Files:**
- Modify: `assets/style.css` (Animations-Block am Ende), `19-osi-modell.html` (Play/Pause-Button), `assets/quiz.js` (Reveal-Transition-Klasse)

**Interfaces:**
- Consumes: `.osi-paket`-Element aus Task 1 (SVG 1).

- [ ] **Step 1: CSS — invertiertes Gate:**

```css
/* ===== Animationen (nur bei ausdrücklicher Bewegungs-Präferenz) ===== */
@media (prefers-reduced-motion: no-preference) {
  .osi-paket { transform-box: fill-box; transform-origin: center;
    animation: osi-fluss 9s ease-in-out infinite; }
  @keyframes osi-fluss { /* Stationen: Schicht 7→1 (Sender), Medium, 1→7 (Empfänger) —
    ausschließlich translate/opacity; konkrete Prozentwerte beim Bauen an die
    SVG-Koordinaten von Task 1 anpassen */
    0% { transform: translate(0, 0); opacity: 0; }
    5% { opacity: 1; }
    45% { transform: translate(0, var(--osi-drop)); }
    55% { transform: translate(var(--osi-medium), var(--osi-drop)); }
    95% { transform: translate(var(--osi-medium), 0); opacity: 1; }
    100% { opacity: 0; }
  }
  .q-solution:not([hidden]) { animation: sol-in 0.2s ease-out; }
  @keyframes sol-in { from { opacity: 0; transform: translateY(4px); } }
  .node-progress-fill { transition: transform 0.6s ease-out; }
}
.osi-anim-paused .osi-paket { animation-play-state: paused; }
```

- [ ] **Step 2: Play/Pause** — Button unter SVG 1 (`<button class="btn" id="osi-anim-toggle" aria-pressed="true">Animation anhalten</button>`); kleines Inline-Skript ist durch CSP verboten → Logik ans Ende von `19-osi-modell.html` als eigene Datei? Nein: **in `code.js` gehört das nicht; kleinste Lösung = 15-Zeilen-Datei `assets/osi-anim.js`** (IIFE: Toggle der Klasse `osi-anim-paused` auf dem `figure`-Element, `aria-pressed` + Text umschalten; `matchMedia('(prefers-reduced-motion: reduce)')` inkl. `change`-Listener → bei reduce: Klasse setzen + Button auf „Animation abspielen"). Auf Seite 19 nach `code.js` einbinden.
- [ ] **Step 3: Browser-Check** — Animation läuft dezent; DevTools-Emulation `prefers-reduced-motion: reduce` → keine Bewegung, Button zeigt „abspielen"; Konsole sauber; Tests weiter grün.

---

### Task 10: A11y — Timer, Statusmeldungen, Kontraste

**Files:**
- Modify: `pruefung.html` (Checkbox + Verlängerungs-Button), `assets/pruefung.js`, `assets/style.css` (Kontrast-Fixes), `assets/pruefung.test.js`

- [ ] **Step 1: Failing Tests** (`pruefung.test.js`, Muster der Datei zuerst lesen): Checks auf `id="no-timelimit"`, `id="extend-time"`, `aria-live` am Timer-Warn-Container.
- [ ] **Step 2: „Ohne Zeitlimit üben":** Checkbox im Start-Gate (`<label><input type="checkbox" id="no-timelimit"> Ohne Zeitlimit üben</label>`). In `pruefung.js`: wenn gecheckt → kein Countdown, Timer-Anzeige „ohne Zeitlimit"; Ergebnis-Eintrag im Verlauf erhält Flag `noLimit: true` und wird in der Verlaufsliste mit „(ohne Zeitlimit)" gerendert. Bestehende Verlaufs-Einträge ohne Flag rendern unverändert (Abwärtskompatibilität).
- [ ] **Step 3: „+10 min":** Button neben Timer (nur sichtbar wenn Timer läuft): `remaining += 600` — unbegrenzt oft klickbar (erfüllt „mind. 10×"). Warnung < 5 min: Text in Container mit `aria-live="polite"` (z. B. „Noch 5 Minuten — über +10 min verlängerbar").
- [ ] **Step 4: Kontraste:** mit DevTools/Kontrastrechner prüfen: `#5C6B78` auf `#FFF`/hellen Flächen (Text < 18 px braucht 4.5:1 — 5C6B78 hat ~4.6:1 auf Weiß, auf `#E4F1EF` weniger → dort auf `#4A5864` nachdunkeln); SVG-Linien/Rahmen bedeutungstragend ≥ 3:1. Fundstellen in `style.css` bzw. SVG-Attributen korrigieren (site-weit suchen: `grep -n "5C6B78" *.html assets/style.css`).
- [ ] **Step 5: Grün + Browser-Check** — beide Tests OK; Durchlauf: ohne Zeitlimit üben, mit Zeitlimit + verlängern, Screenreader-Region prüfbar (`role`/`aria-live` im A11y-Tree).

---

### Task 11: Lernseite-Performance

**Files:**
- Modify: `lernseite.html` bzw. `assets/style.css`, `assets/print.css`

- [ ] **Step 1:** Sektionsstruktur der Lernseite ermitteln (Wrapper-Element je Themenabschnitt; ggf. Abschnitte in `<section class="lern-sek">` fassen, falls noch nicht vorhanden).
- [ ] **Step 2:** CSS:

```css
.lern-sek { content-visibility: auto; contain-intrinsic-size: auto 900px; }
@media print { .lern-sek { content-visibility: visible; } }
```

  (Print-Regel in `print.css`.)
- [ ] **Step 3: Browser-Check** — Anker-Links + Strg+F funktionieren; Performance-Trace vorher/nachher (DevTools MCP `performance_start_trace`): Initial-Rendering der Lernseite messbar schneller bzw. keine Regression; Print-Vorschau vollständig.

---

### Task 12: Workspace-Hygiene (eine Ebene über dem Website-Ordner)

**Files:**
- Create: `..\19. OSI-Modell\_INHALT.md`
- Modify: `..\CLAUDE.md` (Routing-Zeile 19 + Hilfsmaterial-Hinweis)

- [ ] **Step 1: `_INHALT.md`** nach dem Muster bestehender Stubs (z. B. `18. VLAN/_INHALT.md` zuerst lesen): beschreibt `Fehlerquellen.png` (Kartenabfrage Fehlerquellen, farbige Karten, Zuordnung zu OSI-Schichten offen) und `Vorlage.xlsx` (Tabelle: OSI-Schicht 1–4 | zu prüfende Hardware/Protokoll | Werkzeug | Überprüft); PDFs als direkt lesbar vermerken.
- [ ] **Step 2: CLAUDE.md:** Routing-Zeile `| 19 | \`19. OSI-Modell\` | \`OSI.pdf\`, \`TCP IP.pdf\`, \`Windows Netzwerktools.pdf\`; **Binär → \`_INHALT.md\`** (\`Fehlerquellen.png\`, \`Vorlage.xlsx\`) | *(noch kein Notion-Abschnitt — Sync offen)* |` + in der Hilfsmaterial-Tabelle „deckt … alle Themen ab" auf 1–19 präzisieren.
- [ ] **Step 3:** Kein Test — Sichtprüfung der Tabellen-Syntax (Markdown-Pipes).

---

### Task 13: Endverifikation

- [ ] **Step 1:** `node assets/content.test.js` && `node assets/pruefung.test.js` → beide OK (Anzahl Checks nennen).
- [ ] **Step 2: Browser-Durchlauf** (Chrome DevTools MCP, lokaler Static-Server oder file://):
  index (7 Ansichten, Fortschritt), Seite 19 komplett durchspielen (MC richtig+falsch, Multi-Select, Tabellen, KI-Prompt kopieren, Reload-Persistenz, Reset), 2 Stichproben-Altseiten, Lernseite (Anker, Abschnitt 19), Probe-SA (beide Modi, +10 min, Abgeben, Note, Verlauf), Konsole überall fehlerfrei.
- [ ] **Step 3:** reduced-motion-Emulation (keine Bewegung), Print-Vorschau Lernseite + eine Themenseite.
- [ ] **Step 4:** `git status` zeigen (nur geänderte/neue Dateien, NICHTS committen) und Abschlussbericht an den Nutzer.

## Self-Review (durchgeführt)

- **Spec-Abdeckung:** §1→Task 1, §2→Tasks 2–5, §3→Task 6, §4→Tasks 7–8, §5→Task 9, §6→Task 10, §6a→Task 11, §7→Tests in allen Tasks + Task 13, §8→Task 12. Keine Lücke.
- **Platzhalter:** Frage-/Antwortinhalte, Testcode und CSS sind ausformuliert; bewusst offen (mit Anweisung „zuerst lesen") sind nur Stellen, deren Ist-Muster beim Bauen zu übernehmen ist (Feldschema TOPICS, pruefung.test.js-Stil, Lernseiten-Wrapper) — das ist Muster-Treue, kein Platzhalter.
- **Konsistenz:** Keys `fuit-mc:` (Task 7) == Task 8; `qTotal` (Task 8) == Test; `19-osi-modell.html` überall identisch; `open-osi`/O5 und 80 min in Task 5 == Spec.
