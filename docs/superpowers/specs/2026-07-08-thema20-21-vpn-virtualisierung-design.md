# Design: Themen 20 (VPN) + 21 (Virtualisierung) + OSI-Abgleich

**Datum:** 2026-07-08 · **Projekt:** `_Test_Themen_10-15` (statische Lern-/Selbsttest-Website, GitHub Pages)
**Vorgabe:** Kein Commit/Push — alle Änderungen bleiben ausschließlich im Arbeitsverzeichnis (CLAUDE.md).

## Kontext

Die Website deckt aktuell die FUIT-Themen **1–19** ab (19 Themenseiten, `lernseite.html` mit 19
`lern-sek`-Abschnitten, `pruefung.html` als Probe-SA mit 30 Auswahl- + 5 offenen Aufgaben,
Startseite mit Sterntopologie + 6 Mini-Spielen). Stack: statisches HTML, Vanilla JS (ES5-Stil),
keine Abhängigkeiten, kein Build-Schritt, CSP `script-src 'self'`, Node-Selbsttests
(`assets/content.test.js`, `assets/pruefung.test.js`).

Im Workspace liegen **zwei neue Themen-Ordner**, die noch nicht auf der Website sind:
- `20 VPN/` — `03 Infotext.pdf` (VPN-Grundlagen, Funktionsweise/IP-Tunneling, drei VPN-Typen).
- `21 Virtualisierungen/` — `01 Virtualisierung AB_Schüler.pdf` (ausgefülltes Arbeitsblatt),
  `00 Situation, Auftrag und Infos.pdf` (Infotext „Server-Virtualisierung erklärt"),
  `03 Leitfragen.pdf` (Übungs-/Szenariofragen).

Zusätzlich existiert Thema **19 (OSI-Modell)** bereits als Seite und soll gegen die Quell-PDFs
voll abgeglichen werden.

**Nutzer-Entscheidungen (bestätigt):**
1. **Beide** Themen als Website-Themen **20 (VPN)** und **21 (Virtualisierung)** — Website-Nummern
   = Workspace-Nummern, lückenlos 1–21.
2. **Voller OSI-Abgleich** (Thema 19), Absatz für Absatz gegen die Quell-PDFs.
3. **Probe-SA wächst mit** (Fragen zu VPN + Virtualisierung).
4. OSI-Unterordner `Transportschicht/` (4 Ticket-PDFs) wird **ignoriert** (reines Übungsmaterial).

Ansatz: **Erweiterung nach der etablierten Integrations-Rezeptur** (wie Thema 19), kein
Architektur-Umbau.

## Ziele

1. Zwei neue Themenseiten `20-vpn.html`, `21-virtualisierung.html` — inhaltlich **nur** aus dem
   jeweiligen Workspace-Material (Mitschriften-/AB-Niveau, kein zusätzlicher Stoff).
2. Vollständige Integration in den Bestand: Navigation, Pager, Startseite/Spiele (`explore.js`),
   Startseiten-Sterntopologie + Themenkarten (`index.html`), Lernseite, Probe-SA.
3. **Alle Zähler/Trackingpunkte** konsistent nachziehen (Pills, Karten-Metas, `qTotal`,
   lern-sek-Zahl, exam-/open-q-Zahl) — abgesichert durch die Selbsttests.
4. OSI-Seite (19) gegen `OSI.pdf`, `TCP IP.pdf`, `Windows Netzwerktools.pdf` prüfen und echte
   Abweichungen korrigieren.
5. Workspace-Hygiene: CLAUDE.md-Routing-Zeilen 20/21, `_INHALT.md` wo nötig, README-Update.

## Nicht-Ziele

- Kein Framework, kein Build-Schritt, keine externen Ressourcen (CSP bleibt unverändert streng).
- Kein datengetriebener Umbau (Fragen bleiben statisches HTML).
- Kein Commit/Push (CLAUDE.md), keine Änderung am GitHub-Pages-Deployment.
- Keine inhaltliche Vertiefung über die Quelldateien hinaus; `Transportschicht/`-Tickets bleiben außen vor.

---

## 1. Neue Themenseite `20-vpn.html`

Aufbau exakt nach Muster `19-osi-modell.html` (gleicher `<head>` inkl. CSP + `code.css`,
Topbar mit Nav 1–21 — Link 20 mit `class="current"` —, Hero mit Pills, Controls
`show-all`/`hide-all`/`reset-answers`, Sektionen mit `sec-head`, Aufgabenkarten `article.q`,
Pager, Skripte `quiz.js` → `code.js`). Hero-Eyebrow „Sichere Verbindungen", `#20`,
Titel „VPN — Virtual Private Network", Pills `~12 Aufgaben / 3 Diagramme / MC · Multi-Select · Zuordnung · KI-Freitext`
(finale Zahlen = Ist-Stand beim Bau).

**Quelle:** `20 VPN/03 Infotext.pdf`.

**Sektion A · Was ist ein VPN — und wozu?**
Definition: VPN = **Virtual Private Network**, ein privates Netzwerk; bildlich ein **Tunnel**, durch
den man das Internet für Außenstehende unsichtbar nutzt → sichere Verbindung im unsicheren Internet
(Kommunikation kann nicht abgehört/abgegriffen werden). Zwei Ziele: (a) **Fernzugriff** von außen auf
ein Netzwerk (Außendienstmitarbeiter → Firmennetz), (b) **Ländersperren umgehen** (z. B. Facebook-Sperre
in Südkorea; von Privatpersonen).
→ **SVG 1 „VPN-Tunnel":** Client → verschlüsselter Tunnel durchs Internet → VPN-Server → Ziel; Hinweis
auf die **fiktive IP-Adresse**, die der Empfänger sieht.

**Sektion B · Funktionsweise: IP-Tunneling**
VPN nutzt das Internet als Basis. Ohne VPN wählt man sich mit eigener IP ein — unsicher (besonders
öffentliches WLAN, z. B. Flughafen). Mit VPN verschlüsselt der **VPN-Client** die Anfragen/Datenpakete
und verpackt sie in IP-Internetpakete (Briefumschlag-Bild: Anfrage → Umschlag an Server → nochmals
Umschlag fürs Firmennetz → an VPN-Server). Der Empfänger sieht die **fiktive IP**. Begriffe:
**IP-Tunneling** (= Verschlüsseln + nochmaliges Verpacken der Pakete), **VPN-Tunnel** (= die erstellte
Verbindung). Nutzen: kein Mitlesen, kein Nachverfolgen, virtuelle Zuordnung zum Firmenstandort.
→ **SVG 2 „Kapselung/Umschlag":** Request → verschlüsselt → in IP-Paket verpackt → VPN-Server.

**Sektion C · Die drei VPN-Typen**
- **End-to-Site** (Remote-Access): externe Mitarbeiter → Firmennetz; einzelne Rechner ausgelagert;
  **VPN-Client** auf dem PC nötig (z. B. OpenVPN); arbeiten, als säßen sie im Unternehmen.
- **Site-to-Site** (LAN-to-LAN / Branch-Office): verbindet mehrere verteilte Firmennetze (Zweigstellen ↔
  Hauptstelle); Zugriffskontrolle über **Firewalls**; **keine** VPN-Clients auf den Hosts, stattdessen
  **VPN-Gateways** (VPN-fähige Router mit abgestimmter Konfiguration); LAN-LAN-Kopplung.
- **End-to-End**: Verbindung zwischen zwei Hosts (Client-Client, Client-Server, Server-Server); ganze
  Strecke verschlüsselt; beide Hosts brauchen VPN-Software; läuft über eine zentrale Station (**Gateway**);
  typisch Remote-Desktop (z. B. TeamViewer).
→ **SVG 3 „Die 3 VPN-Typen":** drei Zeilen (End-to-Site / Site-to-Site / End-to-End) mit Host–LAN–Router–
  Internet–Router–LAN–Host, jeweils markierte verschlüsselte Strecke (nach der PDF-Grafik).

**Aufgaben (~12):** MC (Was ist ein VPN? / Ziel des VPN), Multi-Select (Nutzen der Technik),
Zuordnungs-Tabelle mit `?`-Zellen (Typ → Merkmal: Client nötig? Gateway/Router? Einsatzzweck),
MC (IP-Tunneling/VPN-Tunnel), MC-Szenarien (Außendienst → End-to-Site · Zweigstellen → Site-to-Site ·
TeamViewer → End-to-End), Multi-Select (Site-to-Site-Merkmale), Szenario mit Musterlösung,
genau **1 KI-Freitextaufgabe** (`data-ki-max`, `template.prompt-tpl` mit `{{CODE}}`, `.code-input`,
`.q-copyprompt`) → damit die Seite in die `kiPages`-Liste aufgenommen wird.

**Diagramme:** 3 inline SVGs mit `role="img"` + aussagekräftigem `aria-label`; Farbe stets mit Textlabel
kombiniert (Farbpalette der Website: `#16242E`, `#15786E`, `#DD5430`, `#E4F1EF`, `#FBEAE3`, `#C9A227`).

## 2. Neue Themenseite `21-virtualisierung.html`

Muster wie oben; Nav-Link 21 mit `class="current"`. Hero-Eyebrow „Virtuelle Systeme", `#21`,
Titel „Virtualisierung — VM, Hypervisor & Virtualisierungsarten", Pills
`~16 Aufgaben / 4 Diagramme / …` (finale Zahlen = Ist-Stand).

**Quellen:** `21 Virtualisierungen/01 Virtualisierung AB_Schüler.pdf`,
`00 Situation, Auftrag und Infos.pdf`, `03 Leitfragen.pdf`.

**Sektion A · Virtuelle Maschine & Hypervisor**
Virtualisierung: mit **Software** wird das Vorhandensein von **Hardware** simuliert und ein virtuelles
Computersystem erstellt. Eine **VM** ist ein virtueller Rechner, der sich wie ein eigenständiger
physischer Rechner mit eigener Hardware und eigenem BS verhält (= **virtuelles Gastsystem**); läuft auf
einem physischen **Wirt/Host**. Software und Hardware sind **logisch entkoppelt** (Hardware-Virtualisierung).
Der **Hypervisor** (Virtual Machine Monitor, VMM) ist die Abstraktionsschicht zwischen Wirt und
Gastsystemen; ermöglicht den **parallelen Betrieb** mehrerer VMs und **partitioniert** die
Hardwareressourcen (RAM, CPU, Speicherplatz, Peripherie).
→ **SVG 1 „VM-Stack":** Hardware (Wirt) → Hypervisor → mehrere VMs (Gast 1/2/3, je eigenes BS).

**Sektion B · Hypervisor-Typen 1 & 2**
- **Typ 1 — Bare-Metal:** setzt **direkt auf der Hardware** auf, **kein** vorab installiertes BS nötig;
  Beispiele Microsoft Hyper-V, Citrix XenServer, VMware ESX, Oracle VM; geringer Overhead → hohe
  **Performance**, hohe **Sicherheit**, hohe **Flexibilität**, gut skalierbar/stabil; typisch in großen
  Rechenzentren.
- **Typ 2 — Hosted:** läuft als **Applikation auf einem vorhandenen BS**; nutzt dessen Gerätetreiber als
  **Brücke** zur Hardware; Beispiele Oracle VirtualBox, VMware Workstation, Microsoft Virtual-PC; Nachteil
  **Overhead** (geringere Performance), Vorteil bessere **Hardware-Kompatibilität/Flexibilität**.
→ **SVG 2 „Bare-Metal vs. Hosted":** links Hardware→Hypervisor(VMM)→OS1/OS2; rechts Hardware→Host-OS→
  Hypervisor(VMM)→OS1/OS2 (nach AB-Grafik).

**Sektion C · Virtualisierungsarten**
- **Servervirtualisierung:** ein physischer Server wird in mehrere virtuelle Server aufgeteilt
  (Serverkonsolidierung).
- **Desktopvirtualisierung:** virtueller Desktop per Remote; Verarbeitung im Rechenzentrum; Client = PC,
  Thin-/Zero-Client, Smartphone, Tablet (vgl. Terminal-Server-Architektur). **VDI** = on-premises im
  eigenen Rechenzentrum, **persistente** (beständige) vs. **non-persistente** (nicht-beständige) Desktops;
  Abgrenzung **DaaS** = Desktop als Cloud-Service.
- **Applikations-/Anwendungsvirtualisierung:** Anwendung wird vom BS isoliert (**Sandbox**); Tools
  Bufferzone, Sandboxie; Server-Variante Citrix XenApp, VMware ThinApp, Microsoft App-V (.exe/Verknüpfung
  auf dem Client).
→ **SVG 3 „VDI ↔ DaaS" bzw. Arten-Übersicht:** VDI (unternehmenseigenes RZ) vs. DaaS (Cloud-Anbieter).

**Sektion D · Vor- & Nachteile**
Vorteile: Serverkonsolidierung (weniger Hardware/Kosten), bessere Ressourcenauslastung, schnelles
Bereitstellen/Klonen von VMs, **Isolation/Hochverfügbarkeit** (Absturz einer VM betrifft andere nicht),
einfacheres Backup/Disaster Recovery, **Live-Migration** (VM ohne Downtime verschieben), Umstellung auf
neue Hardware (Altumgebung imitieren). Nachteile: **Single Point of Failure**, Lizenzkosten mancher
Hypervisor-/Management-Tools, Performance-**Overhead** (v. a. Typ 2), steigende **Komplexität** im Management.

**Aufgaben (~16):** MC (Was ist eine VM? / Hypervisor = VMM), Zuordnungs-Tabelle mit `?`-Zellen
(Typ 1 vs. Typ 2: BS nötig? Zugriff? Beispiel? Vorteil?), Multi-Select (Vorteile), Multi-Select
(Nachteile), MC (VDI vs. DaaS: on-premises ↔ Cloud), MC-Szenario (Klassenzimmer umrüsten → Desktop-
Virtualisierung/VDI; aus den Leitfragen), Ausfüll-Tabelle (Virtualisierungsart/Hypervisor-Typ → Beispiel),
Szenario mit Musterlösung (Prinzip der Servervirtualisierung; Dateiserver/ERP aus den Leitfragen),
**1 KI-Freitextaufgabe**.

**Diagramme:** ~4 inline SVGs (Regeln wie bei Thema 20).

## 3. OSI-Abgleich (Thema 19)

Die bestehende `19-osi-modell.html` ist bereits sehr quellentreu (7 Schichten mit deutschen Namen,
LLC/MAC, Kontrollpunkte, 5 Vorteile; TCP/IP 4 Schichten + OSI↔TCP/IP-Mapping; Windows-Tools;
Fehlerquellen). Beim Abgleich:
- Seite **Absatz für Absatz** gegen `OSI.pdf`, `TCP IP.pdf` und `Windows Netzwerktools.pdf`
  (letzteres beim Umsetzen noch direkt lesen) prüfen; jede **echte** Abweichung korrigieren
  (Terminologie, Zuordnungen, Vorteile, Tool-Zwecke).
- **`Transportschicht/`-Tickets bleiben unberücksichtigt** (Nutzer-Entscheidung).
- Ändern sich dabei Aufgaben-/Diagrammzahlen der OSI-Seite, werden die zugehörigen Zähler
  (index-Karte, Pills, `qTotal`, ggf. `kiPages`) mit nachgezogen.

## 4. Integration in den Bestand („alle Trackingpunkte")

- **Navigation (alle 23 Seiten):** Nav-Links `<a href="20-vpn.html">20</a>` und
  `<a href="21-virtualisierung.html">21</a>` nach 19, vor „Lernen"; Brand `Themen 1–19` → **`Themen 1–21`**
  auf allen Seiten; `<title>`s konsistent. Negativ-Checks der Tests dürfen keine „1–19"/„1 bis 19"-Reste finden.
- **Pager:** `19-osi-modell.html` `a.next` → `20-vpn.html`; `20-vpn.html` `a.next` → `21-virtualisierung.html`;
  `21-virtualisierung.html` `a.next` → `lernseite.html` („Konzepte wiederholen"). Prev-Links analog.
- **`assets/explore.js`:** TOPICS-Einträge `{ n: 20, qTotal, name: "VPN", href, hint, kw }` und
  `{ n: 21, qTotal, name: "Virtualisierung", href, hint, kw }` (Schema exakt von Eintrag 19 übernehmen;
  `qTotal` = Anzahl `article.q`-Karten **mit** `q-options`). Alle Spiele rechnen mit `TOPICS.length` →
  laufen automatisch mit; nur Kommentare „19 Themen" auf 21 aktualisieren (keine hartkodierten Zähler).
- **`index.html`:**
  - **Sterntopologie:** zwei neue Knoten (20, 21) als `a[href] > g.node > rect`-Struktur ergänzen; Knoten
    gleichmäßig auf der Ellipse neu verteilen (Generator-Ansatz), damit `decorateStar()` sie findet.
  - **Themenkarten:** je eine `topic-card` für 20 und 21 mit `tc-meta` „X Aufgaben · Y Diagramme"
    (X = `article.q`, Y = `<svg ` der jeweiligen Seite) und Stern-SVG-Knoten.
  - **Hero-Pills / Texte:** `<b>19</b> Themen` → `<b>21</b> Themen`; Aufgaben- und Diagramm-Summen
    (Summe über alle Themenseiten) neu berechnen; „19 Themen"/„die 19 Themen"-Texte aktualisieren.
- **`lernseite.html`:** zwei neue `<section class="lern-sek" id="t20|t21">` mit `sec-head`-`<h2>` (VPN;
  Virtualisierung) im Muster der bestehenden Abschnitte (Konzept-Zusammenfassung + je 1–2 der o. g. SVGs);
  TOC-Pills `href="#t20"`, `href="#t21"`; Diagramm-Zähler der Lernseite + index-Beschreibung „allen N Diagrammen"
  anpassen. Erwartung `lern-sek === 21`.

## 5. Probe-SA erweitern (34 Auswahl + 6 offen)

- **`pruefung.html`:** +4 `article.q.exam-q` (2 VPN, 2 Virtualisierung) mit korrektem `data-answer`
  (Index der richtigen Option, `< nOpts`); +1 `article.q.open-q` (Virtualisierung) nach Muster von O5
  (`id="open-virt"`, Textarea `.code-input`, `template.prompt-tpl` mit `{{CODE}}`, `q-reveal`, `q-solution`).
  Beispiel-Auswahlfragen: „VPN-Typ für Zweigstellen-Kopplung?" → Site-to-Site · „Was verpackt/verschlüsselt
  der VPN-Client (Fachbegriff)?" → IP-Tunneling · „Typ-1-Hypervisor benötigt …?" → kein vorinstalliertes BS ·
  „VDI vs. DaaS?" → VDI on-premises, DaaS Cloud. Offene Aufgabe O6: „Erkläre Server-Virtualisierung
  (VM, Hypervisor Typ 1/2) und nenne 3 Vorteile" (max 3 P).
- **`assets/pruefung.js`:** `DURATION = 90 * 60;` (Kommentar aktualisieren); `OPEN_TASKS` um
  `{ id: "open-virt", label: "Aufgabe O6 · Server-Virtualisierung", max: 3 }` erweitern. Punkte-/Notenlogik
  bleibt unverändert (skaliert automatisch: 34 Auswahl + 21 offen).
- **Tests:** `content.test.js` `examQ === 34`, `openQ === 6`; `pruefung.test.js` bleibt gültig (prüft die
  generische `calculateExamResult`-Arithmetik, nicht die DOM-Anzahl) — der erläuternde Kommentar wird auf
  die neuen Summen aktualisiert.

## 6. Tests & Verifikation

**`assets/content.test.js` erweitern:**
- `allTopics` um `20-vpn.html`, `21-virtualisierung.html`; `kiPages` um beide (KI-Aufgabe je Seite).
- Nav-/Beschriftungs-Checks: Link auf 20 **und** 21 auf allen Seiten; keine „Themen 1–19"/„1 bis 19"-Reste;
  index-Pill `<b>21</b> Themen`; kein „19 Themen"-Resttext.
- `explore.js`-Erwartung `entries === 21`; TOPICS enthält beide neuen `href`.
- Pager-Check: `19-osi-modell` `a.next` → `20-vpn.html`; `20-vpn` `a.next` → `21-virtualisierung.html`.
- lernseite: `lern-sek === 21`; TOC-Pills `#t20`, `#t21`; Abschnitts-`<h2>` vorhanden.
- Probe-SA: `examQ === 34`, `openQ === 6` (bestehende data-answer-Validierung greift automatisch).
- Bestehende Zähler-Checks (Karten-Metas = echte `article.q`/`<svg`-Zahlen, Pills = Summen,
  `qTotal` je Thema = MC-Karten) decken 20/21 durch die erweiterte `allTopics`-Liste automatisch mit ab.

**`assets/pruefung.test.js`:** Kommentar auf neue Summen aktualisieren; Logik-Checks unverändert.

**Verifikation vor Abschluss:**
1. `node assets/content.test.js` und `node assets/pruefung.test.js` fehlerfrei (Anzahl Checks nennen).
2. Browser-Durchlauf (falls Chrome DevTools MCP verfügbar): Startseite (Sterntopologie zeigt 21 Knoten,
   Spiele funktionieren, Fortschritt), Seiten 20 + 21 (MC/Multi-Select/Tabelle/KI-Prompt kopieren,
   Reload → Zustand erhalten, Reset), Lernseite (Abschnitte 20/21, Anker), Probe-SA (Start, Abgeben,
   Note, O6 im Open-Panel), Konsole ohne Fehler.

## 7. Workspace-Hygiene (außerhalb des Website-Ordners)

- **`CLAUDE.md`:** Routing-Zeilen für Thema **20** (`20 VPN`, `03 Infotext.pdf`, Notion-Abschnitt offen)
  und **21** (`21 Virtualisierungen`, Schlüsseldateien, Notion offen); Hilfsmaterial-Hinweis „deckt
  1–19 ab" → „1–21".
- **`_INHALT.md`:** in `20 VPN/` und `21 Virtualisierungen/` nur nötig, falls nicht-direkt-lesbare
  Dateien enthalten sind — beide Ordner enthalten **nur PDFs** (direkt lesbar) → kein Stub nötig,
  nur die Routing-Zeile. (Falls beim Umsetzen Binärdateien auftauchen, Stub nachziehen.)
- **`README.md`:** Themenliste auf 1–21, korrigierte Zähler (Aufgaben/Diagramme/Seiten).

## Fehlerbehandlung & Risiken

- **Sterntopologie mit 21 Knoten:** Knotenpositionen müssen neu verteilt werden; `decorateStar()` findet
  Knoten über `a[href="…"]` → beide neuen `href` müssen exakt stimmen. Layout/Überlappung prüfen.
- **Zähler-Kaskade:** Die Zähler-Tests schlagen nach dem Ergänzen **bewusst** fehl, bis alle Zahlen
  (Pills, Karten-Metas, `qTotal`, `lern-sek`, exam-/open-q) nachgezogen sind — das ist die
  Vollständigkeits-Sicherung. Reihenfolge: erst Seiten bauen, dann Zähler final setzen.
- **localStorage:** neue `fuit-mc:`-Keys für 20/21 kollidieren nicht mit Bestehendem; alle Zugriffe
  bleiben in `try/catch` (Bestandsmuster).
- **Kein Git:** Der Ordner ist aus Sicht der Bash-Shell kein funktionierendes Git-Repo; gemäß CLAUDE.md
  ohnehin **kein Commit/Push**. Task-Abschluss = grüne Selbsttests, nicht Commit.
