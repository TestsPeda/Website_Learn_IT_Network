# Themen 20 (VPN) + 21 (Virtualisierung) + OSI-Abgleich — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die FUIT-Lernwebsite um zwei vollständige Themenseiten (20 VPN, 21 Virtualisierung) erweitern, Thema 19 (OSI) gegen die Quell-PDFs abgleichen und **alle** Zähler/Trackingpunkte + Selbsttests konsistent nachziehen.

**Architecture:** Statische Website ohne Build-Schritt. Jede Änderung folgt exakt den bestehenden Mustern (Themenseite nach `19-osi-modell.html`; Aufgabenkarten `article.q`; Vanilla-JS-IIFEs `quiz.js`/`code.js`/`explore.js`/`pruefung.js`; Node-Selbsttests). Neue Inhalte kommen **nur** aus dem jeweiligen Workspace-Material.

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES5-Stil), Node (nur Selbsttests). Verifikation im Ordner `_Test_Themen_10-15/`.

**Spec:** `docs/superpowers/specs/2026-07-08-thema20-21-vpn-virtualisierung-design.md`

## Global Constraints

- **KEIN `git commit`, KEIN `git push`** (CLAUDE.md; Ordner ist aus Bash-Sicht ohnehin kein funktionierendes Repo). **Task-Abschluss = Testlauf**, nicht Commit.
- CSP-Header auf jeder Seite unverändert: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'`. Keine externen Ressourcen.
- Inhalte NUR aus den Workspace-Quellen (`20 VPN/03 Infotext.pdf`, `21 Virtualisierungen/*`, OSI-PDFs). Deutsch, Terminologie der Vorlagen.
- Arbeitsverzeichnis aller relativen Pfade: `C:\Users\PVK\OneDrive - Hahn Softwareentwicklung GmbH\BSZ\BSZ-Workspace\FU-IT\_Test_Themen_10-15\` (Task 10 liegt eine Ebene höher).
- Testläufe: `node assets/content.test.js` und `node assets/pruefung.test.js` (im Website-Ordner).
- **Farbpalette der SVGs:** `#16242E` (Text/Rahmen dunkel), `#15786E` (Teal), `#DD5430` (Orange), `#C9A227` (Gold), `#E4F1EF`/`#FBEAE3`/`#FFF6DF`/`#EDF1F4` (Flächen), `#4A5864`/`#5C6B78` (Grautext). Farbe **immer** mit Textlabel kombinieren (WCAG 1.4.1). Jedes `<svg>` mit `role="img"` + aussagekräftigem `aria-label`.
- **Zähler-Kaskade:** Die Zähler-Checks in `content.test.js` (index-Pills, Karten-Metas, `qTotal`, lernseite-Diagramme, exam/open-q) schlagen nach dem Ergänzen **bewusst** fehl, bis die finalen Zahlen gesetzt sind (Task 8/9). Das ist Absicht. Zwischen-Testläufe dürfen diese Checks rot zeigen; **grün** wird die Gesamt-Suite erst in Task 9.

---

### Task 1: Themenseite `20-vpn.html`

**Files:**
- Create: `20-vpn.html`
- Modify: `assets/content.test.js:15-22` (kiPages + allTopics)

**Interfaces:**
- Produces: Seite `20-vpn.html` mit Topbar-Nav-Muster (Link 20 mit `class="current"`), Skripten `quiz.js` dann `code.js`, **≥1** `article.q` mit `data-ki-max`. Tasks 3/5/6/8 verlinken exakt auf diesen Dateinamen.

- [ ] **Step 1: Listen erweitern (Test wird rot)**

In `assets/content.test.js` beide Arrays ergänzen:

```js
const kiPages = ["10-adressierung.html","11-dhcp-dns.html","13-topologien.html","14-speichersysteme.html",
  "15-raid.html","16-email-protokolle.html","17-netzwerktechnologien.html","18-vlan.html",
  "19-osi-modell.html","20-vpn.html","21-virtualisierung.html"];
const allTopics = ["1-grundbegriffe","2-verkabelungsplan","3-uebertragungsmedien","4-stueckliste",
  "5-geraeteklassen","6-strukturierte-verkabelung","7-it-infrastruktur","8-edgecomputing",
  "9-server-betriebssystem","10-adressierung","11-dhcp-dns","12-uebertragungsarten","13-topologien",
  "14-speichersysteme","15-raid","16-email-protokolle","17-netzwerktechnologien","18-vlan",
  "19-osi-modell","20-vpn","21-virtualisierung"].map(n=>n+".html");
```

- [ ] **Step 2: Test rot laufen lassen**

Run: `node assets/content.test.js` → Expected: FAIL (ENOENT `20-vpn.html`).

- [ ] **Step 3: Seite bauen**

`20-vpn.html` nach dem **exakten Muster von `19-osi-modell.html`** (zuerst lesen): gleicher `<head>` inkl. CSP + `style.css`/`code.css`/`print.css`; Topbar-Brand `Themen 1–21`; Nav 1–21 (Zeile pro Thema; **20** trägt `class="current"`; Reihenfolge 1…19, 20, 21, dann `lernseite.html`, `pruefung.html`); `scorechip`; Controls `show-all`/`hide-all`/`reset-answers`; am Ende Skripte `<script src="assets/quiz.js"></script>` dann `<script src="assets/code.js"></script>` (KEIN osi-anim.js). Footer „Thema 20 — VPN".

Hero: Eyebrow „Sichere Verbindungen", `<div class="hero-num"><span class="hash">#</span>20</div>`, H1 „VPN — Virtual Private Network", Lede (VPN = privates, verschlüsseltes Netz / „Tunnel" durchs unsichere Internet; Fernzugriff + Ländersperren), Pills `<span class="pill"><b>12</b> Aufgaben</span><span class="pill"><b>3</b> Diagramme</span><span class="pill">MC · Multi-Select · Zuordnung · KI-Freitext</span>` (Zahlen final = Ist-Stand, s. Step 4).

**Sektion A · Was ist ein VPN — und wozu?** (`sec-head` ix „A") — Intro: VPN (Virtual Private Network) = privates Netz, bildlich ein **Tunnel**, durch den man das Internet für Außenstehende unsichtbar/abhörsicher nutzt. Zwei Ziele: (a) Fernzugriff von außen aufs Firmennetz (Außendienst), (b) Ländersperren umgehen (Privatpersonen).
**SVG 1 „VPN-Tunnel":** Client-Kasten links → Tunnel-Rechteck „verschlüsselter VPN-Tunnel" durch eine „Internet"-Wolke → „VPN-Server" → Ziel-Server; Beschriftung „Empfänger sieht fiktive IP".

Aufgaben A (Muster: `article.q` mit `q-head`/`q-num`/`q-type`/`q-src`/`q-pts`, `ul.q-options[data-multi]` mit `li.opt`+`span.tick`, `q-foot`>`q-reveal`, `q-solution[hidden]`):
1. **MC** „Was ist ein VPN?" — richtig: *ein privates, verschlüsseltes Netzwerk („Tunnel") durch das unsichere Internet*; Distraktoren: ein neuer Verkabelungsstandard / ein Protokoll zur automatischen IP-Vergabe / eine spezielle Firewall-Bauart.
2. **MC** „Wozu dient ein VPN u. a.?" — richtig: *externen Zugriff von außen auf ein Firmennetz ermöglichen (z. B. Außendienstmitarbeiter)*; Distraktoren: Dateien komprimieren / IP-Adressen im LAN vergeben / die Leitungsbandbreite erhöhen.
3. **Multi-Select** „Welchen Nutzen bietet ein VPN?" — richtig: *Kommunikation ist verschlüsselt und nicht mitlesbar* · *Aktivitäten sind nicht nachverfolgbar (fiktive, mehrfach vergebene IP)* · *virtuelle Zuordnung zum Firmenstandort* · *sichere Nutzung in öffentlichem WLAN (z. B. Flughafen)*; falsch: *erhöht die physische Bandbreite der Leitung* · *ersetzt die Verkabelung im Gebäude*.

**Sektion B · Funktionsweise: IP-Tunneling** (ix „B") — Intro: VPN nutzt das Internet als Basis; der **VPN-Client** verschlüsselt Anfragen/Datenpakete und verpackt sie in IP-Internetpakete (Briefumschlag-Bild, doppelte Verpackung); Empfänger sieht die **fiktive IP**. Begriffe **IP-Tunneling** (Verschlüsseln + nochmaliges Verpacken) und **VPN-Tunnel** (die erstellte Verbindung).
**SVG 2 „Kapselung / Umschlag":** Request → [verschlüsselt] → in IP-Paket verpackt → über Internet → VPN-Server; Rücklabel „Response verschlüsselt zurück".

Aufgaben B:
4. **MC** „Wie nennt man das Verschlüsseln und nochmalige Verpacken der Datenpakete beim VPN?" — richtig: *IP-Tunneling*; Distraktoren: NAT / Routing / Broadcasting.
5. **MC** „Was bezeichnet man als VPN-Tunnel?" — richtig: *die beim VPN erstellte (verschlüsselte) Verbindung*; Distraktoren: den physischen LWL-Strang / die Firewall-Regel / die öffentliche IP des Routers.

**Sektion C · Die drei VPN-Typen** (ix „C") — Intro: End-to-Site, Site-to-Site, End-to-End.
**SVG 3 „Die 3 VPN-Typen":** drei Zeilen (End-to-Site / Site-to-Site / End-to-End), je Host–LAN–Router–„Internet"–Router–LAN–Host, mit markierter verschlüsselter Strecke (nach der PDF-Grafik).

Aufgaben C:
6. **MC (Szenario)** „Ein Außendienstmitarbeiter soll mit seinem einzelnen Laptop ins Firmennetz — welcher VPN-Typ?" — richtig: *End-to-Site (Remote-Access; VPN-Client auf dem PC, z. B. OpenVPN)*; Distraktoren: Site-to-Site / End-to-End / Proxy-VPN.
7. **MC (Szenario)** „Eine Zweigstelle soll dauerhaft mit der Hauptstelle gekoppelt werden — welcher Typ?" — richtig: *Site-to-Site (LAN-to-LAN, über VPN-Gateways)*; Distraktoren: End-to-Site / End-to-End / DNS-VPN.
8. **MC (Szenario)** „Verschlüsselte Verbindung zwischen genau zwei Hosts (Remote-Desktop, z. B. TeamViewer)?" — richtig: *End-to-End*; Distraktoren: End-to-Site / Site-to-Site / Broadcast-VPN.
9. **Multi-Select** „Welche Merkmale gelten für Site-to-Site-VPN?" — richtig: *verbindet mehrere LANs (LAN-to-LAN-Kopplung)* · *keine VPN-Clients auf den Hosts nötig* · *nutzt VPN-Gateways (VPN-fähige Router mit abgestimmter Konfiguration)* · *Zugriffskontrolle über Firewalls*; falsch: *jeder Host benötigt einen OpenVPN-Client* · *dient v. a. Privatpersonen zum Umgehen von Ländersperren*. (`button.q-check`)
10. **Zuordnung (manuell, `?`-Zellen, `table.ref` im `tbl-wrap`)** — Spalten „VPN-Typ | Client auf dem Host nötig? | Was wird gekoppelt? | Beispiel/Einsatz"; Zeilen End-to-Site / Site-to-Site / End-to-End als `?`. Musterlösung: End-to-Site → ja (VPN-Client) / einzelner Rechner ↔ Firmennetz / OpenVPN, Außendienst · Site-to-Site → nein / LAN ↔ LAN (Standorte) / VPN-Gateways, Zweigstellen · End-to-End → ja (beide Hosts) / Host ↔ Host über Gateway / TeamViewer, Remote-Desktop.
11. **Szenario (manuell)** „Beschreibe in Stichpunkten, wie eine Anfrage vom Laptop am Flughafen sicher zum Firmen-Mailserver gelangt (IP-Tunneling, fiktive IP)." Musterlösung als `div.step`-Kette: VPN-Client aktivieren → Anfrage verschlüsseln + in IP-Paket verpacken → über den VPN-Tunnel an den VPN-Server → Server sieht fiktive (Firmen-)IP → Antwort verschlüsselt zurück → niemand kann mitlesen/nachverfolgen.

**Freitext (KI):** `sec-head` ix „★" + `article.q data-ki-max="6"` nach dem OSI-Muster (`textarea.code-input`, `button.q-copyprompt`, `<template class="prompt-tpl">…{{CODE}}</template>`, `q-solution` mit Musterlösung + `ul.rubric`):
- F1 „Erkläre die **drei VPN-Typen** (End-to-Site, Site-to-Site, End-to-End) mit je einem Einsatzbeispiel und gib an, ob ein VPN-Client auf dem Host nötig ist." Prompt-Kriterien: 3 Typen korrekt benannt (3 P), je ein passendes Beispiel (2 P), Client-ja/nein je Typ (1 P).

Pager: `<nav class="pager"><a class="prev" href="19-osi-modell.html"><span>Vorheriges Thema</span><b>19 · OSI-Modell</b></a><a class="next" href="21-virtualisierung.html"><span>Weiter · Thema 21</span><b>Virtualisierung →</b></a></nav>`.

- [ ] **Step 4: `article.q`-Zahlen in Hero-Pills setzen**

Zähle nach dem Bau: `grep -c '<article class="q"' 20-vpn.html` (Aufgaben-Pill) und `grep -c '<svg ' 20-vpn.html` (Diagramm-Pill). Setze die zwei Hero-Pill-Zahlen auf die Ist-Werte. (Erwartung: 12 Aufgaben, 3 Diagramme — bei Abweichung die Pills an den Ist-Stand anpassen.)

- [ ] **Step 5: KI-Wiring prüfen**

Run: `node assets/content.test.js`
Expected: Der `kiPages`-Block für `20-vpn.html` ist **grün** (code.css, code.js nach quiz.js, `data-ki-max`, `q-copyprompt`, `prompt-tpl`, `{{CODE}}`, `code-input`). Andere Checks (Nav 21, Zähler) dürfen noch rot sein — das erledigen spätere Tasks.

---

### Task 2: Themenseite `21-virtualisierung.html`

**Files:**
- Create: `21-virtualisierung.html`

**Interfaces:**
- Consumes: — (allTopics/kiPages bereits in Task 1 ergänzt).
- Produces: Seite `21-virtualisierung.html` (Link 21 `class="current"`), `quiz.js`→`code.js`, ≥1 `data-ki-max`.

- [ ] **Step 1: Seite bauen**

`21-virtualisierung.html` nach demselben Muster wie Task 1 (Nav 1–21; **21** `class="current"`). Hero: Eyebrow „Virtuelle Systeme", `#21`, H1 „Virtualisierung — VM, Hypervisor & Virtualisierungsarten", Lede (Software simuliert Hardware; VM = virtueller Rechner auf einem Wirt; Hypervisor Typ 1/2; Server-/Desktop-/App-Virtualisierung), Pills `<b>16</b> Aufgaben` · `<b>4</b> Diagramme` · Typen (final = Ist-Stand).

**Sektion A · Virtuelle Maschine & Hypervisor** (ix „A") — Intro: Virtualisierung = mit Software das Vorhandensein von Hardware simulieren; **VM** = virtueller Rechner, verhält sich wie eigenständiger physischer Rechner (eigene HW, eigenes BS) = **virtuelles Gastsystem**; läuft auf physischem **Wirt/Host**; HW und SW **logisch entkoppelt**. **Hypervisor** (Virtual Machine Monitor, VMM) = Abstraktionsschicht; ermöglicht parallelen Betrieb mehrerer VMs; **partitioniert** RAM/CPU/Speicher/Peripherie.
**SVG 1 „VM-Stack":** unten „Hardware (Wirt)" → „Hypervisor (VMM)" → drei Kästen „VM/Gast 1|2|3 — eigenes BS".

Aufgaben A:
1. **MC** „Was ist eine virtuelle Maschine (VM)?" — richtig: *ein virtueller Rechner, der sich wie ein eigenständiger physischer Rechner mit eigener Hardware und eigenem Betriebssystem verhält*; Distraktoren: ein zweiter physischer Server im Rack / ein Cloud-Speicherdienst / ein Netzwerkprotokoll.
2. **MC** „Was ist ein Hypervisor?" — richtig: *Software (Virtual Machine Monitor), die den parallelen Betrieb mehrerer VMs auf einem Wirt ermöglicht und die Hardwareressourcen partitioniert*; Distraktoren: ein besonders schneller Prozessor / ein Backup-Programm / ein VPN-Gateway.
3. **Zuordnung (manuell, `?`-Zellen)** — „Merkmal | Typ 1 (Bare-Metal) | Typ 2 (Hosted)"; Zeilen: *Betriebssystem nötig?* / *Hardware-Zugriff* / *Beispiel* / *Vorteil*. Musterlösung: BS nötig? → nein / ja · Zugriff → direkt auf HW / über BS-Treiber (Brücke) · Beispiel → Hyper-V, XenServer, ESX / VirtualBox, VMware Workstation · Vorteil → Performance/Sicherheit/Flexibilität / bessere HW-Kompatibilität.

**Sektion B · Hypervisor-Typen 1 & 2** (ix „B") — Intro wie Spec §2.B.
**SVG 2 „Bare-Metal vs. Hosted":** links Stapel Hardware→Hypervisor(VMM)→OS1/OS2 („Bare-Metal, Typ 1"); rechts Hardware→Host-OS→Hypervisor(VMM)→OS1/OS2 („Hosted, Typ 2").

Aufgaben B:
4. **MC** „Was gilt für einen Typ-1- (Bare-Metal-)Hypervisor?" — richtig: *setzt direkt auf der Hardware auf, kein vorinstalliertes Betriebssystem nötig*; Distraktoren: läuft als App auf Windows / ist immer langsamer als Typ 2 / funktioniert nur in der Cloud.
5. **MC** „Welches ist ein Typ-2- (Hosted-)Hypervisor?" — richtig: *Oracle VirtualBox*; Distraktoren: Microsoft Hyper-V / VMware ESX / Citrix XenServer (alle Typ 1).
6. **MC** „Warum hat ein Typ-2-Hypervisor tendenziell geringere Performance, dafür bessere Hardware-Kompatibilität?" — richtig: *er greift über die Treiber des Host-BS auf die Hardware zu (Brücke) → mehr Overhead, aber das BS verwaltet die Treiber*; Distraktoren-Formulierungen.

**Sektion C · Virtualisierungsarten** (ix „C") — Server- / Desktop- (VDI vs. DaaS, persistent/non-persistent) / Applikationsvirtualisierung (Sandbox; XenApp/ThinApp/App-V).
**SVG 3 „VDI ↔ DaaS":** links „VDI — unternehmenseigenes Rechenzentrum (on-premises)", rechts „DaaS — Cloud-Anbieter"; darunter „persistent vs. non-persistent".

Aufgaben C:
7. **MC** „Worin unterscheiden sich VDI und DaaS?" — richtig: *VDI wird on-premises im eigenen Rechenzentrum gehostet, DaaS von einem Cloud-Anbieter*; Distraktoren umgekehrt/identisch.
8. **MC** „Was kennzeichnet einen non-persistenten VDI-Desktop?" — richtig: *er wird beim Abmelden auf den Ursprungszustand zurückgesetzt (Bearbeitungsfortschritt gelöscht)*; Distraktoren: individuell gespeichert / liegt immer in der Cloud / benötigt keinen Server.
9. **MC (Szenario)** „Ein Klassenzimmer wird von physischen PCs auf virtuelle Arbeitsplätze umgestellt — welche Virtualisierungsart?" — richtig: *Desktopvirtualisierung (VDI)*; Distraktoren: Servervirtualisierung / Applikationsvirtualisierung / Netzwerkvirtualisierung.
10. **MC** „Was beschreibt Applikationsvirtualisierung?" — richtig: *die Anwendung wird vom Betriebssystem isoliert und in einer eigenen Umgebung/Sandbox bzw. zentral über einen Server bereitgestellt*; Distraktoren.
11. **Ausfüll-Tabelle (manuell, `?`-Zellen)** — „Kategorie | Beispiel(e)"; Zeilen: Typ-1-Hypervisor / Typ-2-Hypervisor / Applikationsvirtualisierung / Sandbox-Tools. Musterlösung: Hyper-V, XenServer, ESX, Oracle VM · VirtualBox, VMware Workstation, Virtual-PC · Citrix XenApp, VMware ThinApp, Microsoft App-V · Bufferzone, Sandboxie.

**Sektion D · Vor- & Nachteile** (ix „D") — Vorteile/Nachteile wie Spec §2.D.
**SVG 4 „Vor- vs. Nachteile":** zwei Spalten (grün „Vorteile" / rot „Nachteile") mit den Stichpunkten als Kärtchen.

Aufgaben D:
12. **Multi-Select** „Welche Aussagen nennen einen echten **Vorteil** der Virtualisierung?" — richtig: *Serverkonsolidierung (weniger Hardware/Kosten)* · *bessere Ressourcenauslastung* · *schnelles Klonen/Bereitstellen von VMs* · *Isolation/Hochverfügbarkeit (Absturz einer VM betrifft andere nicht)* · *Live-Migration ohne Downtime* · *einfacheres Backup/Disaster Recovery*; falsch: *beseitigt jeden Single Point of Failure* · *macht Software-Lizenzen überflüssig*. (`q-check`)
13. **Multi-Select** „Welche Aussagen nennen einen **Nachteil** der Virtualisierung?" — richtig: *Single Point of Failure* · *Lizenzkosten mancher Hypervisor-/Management-Tools* · *Performance-Overhead (v. a. Typ 2)* · *steigende Komplexität im Management*; falsch: *höherer Stromverbrauch durch mehr physische Server* · *keine Isolation der Systeme möglich*. (`q-check`)
14. **Multi-Select** „Was trifft auf **Servervirtualisierung** zu?" — richtig: *ein physischer Server wird in mehrere virtuelle Server aufgeteilt* · *Hardware und Software sind logisch entkoppelt* · *der Hypervisor teilt RAM/CPU/Speicher auf die Gastsysteme auf*; falsch: *jeder VM wird ein eigener physischer Server zugeteilt* · *funktioniert nur mit einem Cloud-Anbieter*. (`q-check`)
15. **Szenario (manuell)** „Für den Dateiserver und den ERP-Zugang der Schule ist eine Virtualisierung geplant. Erkläre das **Prinzip der Servervirtualisierung**." Musterlösung (`div.step`): physischen Server per Virtualisierungssoftware in mehrere isolierte VMs aufteilen → HW/SW logisch entkoppeln → Hypervisor verteilt/partitioniert Ressourcen → bessere Auslastung, Serverkonsolidierung, Isolation.

**Freitext (KI):** `sec-head` ix „★" + `article.q data-ki-max="6"`:
- F1 „Erkläre den Begriff **virtuelle Maschine** und den Aufbau der **Servervirtualisierung** mit Hypervisor **Typ 1 vs. Typ 2**; nenne je ein Beispiel und 2 Vorteile der Virtualisierung." Prompt-Kriterien: VM/Wirt-Gast korrekt (2 P), Hypervisor + Typ-1/2-Unterschied + je Beispiel (2 P), 2 stichhaltige Vorteile (2 P).

Pager: prev → `20-vpn.html` (`20 · VPN`); next → `lernseite.html` („Weiter" / „Konzepte wiederholen →").

- [ ] **Step 2: Hero-Pill-Zahlen setzen**

`grep -c '<article class="q"' 21-virtualisierung.html` und `grep -c '<svg ' 21-virtualisierung.html` → die zwei Pills auf die Ist-Werte setzen (Ziel 16 / 4).

- [ ] **Step 3: KI-Wiring prüfen**

Run: `node assets/content.test.js` → Der `kiPages`-Block für `21-virtualisierung.html` ist **grün**. (Nav/Zähler dürfen noch rot sein.)

---

### Task 3: OSI-Abgleich (Thema 19)

**Files:**
- Modify: `19-osi-modell.html` (nur bei belegbaren Abweichungen)

**Interfaces:**
- Produces: ggf. korrigierte Inhalte/Zähler auf der OSI-Seite; **stabile** Aufgaben-/SVG-Zahlen für die Zähler-Finalisierung in Task 8.

- [ ] **Step 1: Quellen lesen**

Lies `../19. OSI-Modell/Windows Netzwerktools.pdf` (bisher nur über `_INHALT.md` bekannt) sowie erneut `OSI.pdf` und `TCP IP.pdf`.

- [ ] **Step 2: Absatzweiser Abgleich**

Gehe `19-osi-modell.html` Sektion A–D gegen die PDFs durch. Prüfe insbesondere:
- Schicht-Namen/-Nummern und Funktionen (Sektion A), LLC/MAC-Aufgaben, Sitzungs-Kontrollpunkte, die 5 Vorteile.
- TCP/IP: 4 Schichten, „protokollgestützt", die 4 Vorteile, OSI↔TCP/IP-Mapping (Q08: Netzwerkzugang=1+2, Internet=3, Transport=4, Anwendung=5-7).
- Windows-Tools (Sektion C): Zweck von `ipconfig`/`ping`(ICMP)/`tracert`/`nslookup`(DNS, Beispiel `213.95.20.51`)/`arp`/`netstat`(TCP) exakt gegen `Windows Netzwerktools.pdf`.
- Fehlerquellen-Zuordnung (Sektion D).
`Transportschicht/`-Tickets **nicht** verwenden (Nutzer-Entscheidung).

- [ ] **Step 3: Nur belegbare Abweichungen korrigieren**

Korrigiere ausschließlich echte fachliche Fehler/fehlende Kernpunkte (kein neuer Stoff). Bei jeder Änderung, die eine `article.q`- oder `<svg`-Zahl der Seite verändert, die neuen Ist-Zahlen notieren (für Hero-Pills der OSI-Seite + Task 8).

- [ ] **Step 4: Zähler der OSI-Seite konsistent halten**

Falls Aufgaben/Diagramme hinzukamen/entfielen: Hero-Pills der OSI-Seite anpassen (`grep -c '<article class="q"' 19-osi-modell.html`, `grep -c '<svg ' 19-osi-modell.html`).

- [ ] **Step 5: Notieren**

Falls **keine** Abweichung: kurz vermerken „OSI-Seite quellentreu, keine Änderung". Kein Testlauf nötig (Task 8/9 fangen die Zähler ab).

---

### Task 4: Navigation, Brand & Pager auf allen Seiten

**Files:**
- Modify: alle 21 Themenseiten (`1-grundbegriffe.html` … `21-virtualisierung.html`), `index.html`, `lernseite.html`, `pruefung.html`
- Modify: `assets/content.test.js` (Nav-/Beschriftungs-Checks)

**Interfaces:**
- Consumes: `20-vpn.html`, `21-virtualisierung.html`.
- Produces: auf jeder Seite Nav-Links auf 20 **und** 21 (vor „Lernen"); Brand/Beschriftung `Themen 1–21`; Pager 19→20→21→lernseite.

- [ ] **Step 1: Failing Tests anpassen**

In `assets/content.test.js` den Nav-Block (aktuell „Thema 19 überall") auf 20 **und** 21 erweitern und die Beschriftungs-Negativchecks nachziehen:

```js
/* --- Nav: Themen 20 + 21 überall verlinkt, keine veralteten 1–19/1–18-Beschriftungen --- */
for (const f of allTopics.concat(["index.html","lernseite.html","pruefung.html"])) {
  const s = read(f);
  ok(s.includes('href="19-osi-modell.html"'), f + ": Nav-Link auf Thema 19 fehlt");
  ok(s.includes('href="20-vpn.html"'), f + ": Nav-Link auf Thema 20 fehlt");
  ok(s.includes('href="21-virtualisierung.html"'), f + ": Nav-Link auf Thema 21 fehlt");
  ok(!s.includes("Themen 1–18") && !s.includes("Themen 1 bis 18"), f + ": veraltete Beschriftung „1–18\"");
  ok(!s.includes("Themen 1–19") && !s.includes("Themen 1 bis 19"), f + ": veraltete Beschriftung „1–19\"");
}
```

Außerdem den Pager-Check von `18-vlan` (bleibt 18→19) beibehalten und einen neuen ergänzen:

```js
{
  const s = read("19-osi-modell.html");
  ok(/class="next" href="20-vpn\.html"/.test(s), "19-osi: Pager führt nicht zu Thema 20");
}
{
  const s = read("20-vpn.html");
  ok(/class="next" href="21-virtualisierung\.html"/.test(s), "20-vpn: Pager führt nicht zu Thema 21");
}
```

- [ ] **Step 2: Rot laufen lassen**

Run: `node assets/content.test.js` → Expected: FAIL bei jeder Seite ohne 20/21-Link.

- [ ] **Step 3: Umsetzen (alle 24 Dateien)**

(a) **Nav-Zeilen:** In jeder Datei nach der Zeile `<a href="19-osi-modell.html"...>19</a>` die zwei Zeilen
`    <a href="20-vpn.html">20</a>` und `    <a href="21-virtualisierung.html">21</a>` einfügen (auf der jeweils eigenen Seite trägt der eigene Link `class="current"`). `index.html` hat keine Themen-Nav in der Topbar (nur Brand) — dort nur (b)/(c).
(b) **Brand/Beschriftung:** `Themen 1–19` → `Themen 1–21` (Topbar-Brand aller Themenseiten + lernseite + pruefung; `index.html` Brand Zeile 19).
(c) **Pager:** `19-osi-modell.html` `a.next` von `lernseite.html` auf `20-vpn.html` umbiegen (`<a class="next" href="20-vpn.html"><span>Weiter · Thema 20</span><b>VPN →</b></a>`). `20-vpn.html`/`21-virtualisierung.html`-Pager sind bereits in Task 1/2 korrekt gesetzt. `21` behält `next` → `lernseite.html`.

- [ ] **Step 4: Grün (Nav-Teil)**

Run: `node assets/content.test.js` → Der Nav-/Pager-Block ist grün. (index-Pills/Karten/lernseite/explore-Zähler noch rot — spätere Tasks.)

---

### Task 5: Startseiten-Datenbasis `assets/explore.js`

**Files:**
- Modify: `assets/explore.js:13-33` (TOPICS-Array + Kommentare)
- Modify: `assets/content.test.js` (Erwartung `entries === 21`)

**Interfaces:**
- Consumes: `20-vpn.html`, `21-virtualisierung.html`.
- Produces: TOPICS-Einträge `{ n: 20, … }`, `{ n: 21, … }` mit `qTotal` = Anzahl `article.q`-Karten **mit** `q-options` der jeweiligen Seite. Task 8 (Fortschritt) liest dieselben `qTotal`.

- [ ] **Step 1: Test anpassen (rot)**

In `assets/content.test.js` den explore-Check ändern: `entries === 19` → `entries === 21` (Meldung „erwartet 21 TOPICS-Einträge"). Run → FAIL.

- [ ] **Step 2: TOPICS-Einträge ergänzen**

`qTotal` je Seite exakt zählen (MC-Karten = `article.q`-Blöcke mit `q-options`):
`node -e "const fs=require('fs');for(const f of ['20-vpn.html','21-virtualisierung.html']){const s=fs.readFileSync(f,'utf8');const mc=s.split('<article class=\"q\"').slice(1).filter(b=>b.includes('class=\"q-options\"')).length;console.log(f,mc)}"`
Dann in `assets/explore.js` nach dem Eintrag `{ n: 19, … }` ergänzen (Feldschema exakt von Eintrag 19; `qTotal` = gezählter Wert, Ziel 9 bzw. 11):

```js
    { n: 20, qTotal: 9,  name: "VPN",             href: "20-vpn.html",             hint: "Virtual Private Network: Tunnel & IP-Tunneling, fiktive IP; End-to-Site, Site-to-Site, End-to-End", kw: "vpn virtual private network tunnel ip-tunneling verschlüsselung remote access site-to-site end-to-end gateway openvpn firmennetz" },
    { n: 21, qTotal: 11, name: "Virtualisierung",  href: "21-virtualisierung.html", hint: "VM & Hypervisor (VMM), Typ 1 Bare-Metal vs. Typ 2 Hosted, Server-/Desktop-/App-Virtualisierung, VDI vs. DaaS", kw: "virtualisierung vm virtuelle maschine hypervisor vmm bare-metal hosted typ1 typ2 hyper-v virtualbox esx vdi daas desktop server applikation sandbox" }
```

Kommentare/Strings mit „19 Themen" auf **21** aktualisieren (Zeilen 3–4 Header-Kommentar, Zeile 352-Kommentar „die 19 Themen"). Keine hartkodierten Spielzähler — alle rechnen mit `TOPICS.length`.

- [ ] **Step 3: Grün (explore-Teil)**

Run: `node assets/content.test.js` → explore-Check `entries === 21` grün; `qTotal`-Check für 20/21 grün (sofern die gezählten Werte eingetragen sind).

---

### Task 6: Lernseite — Abschnitte 20 & 21

**Files:**
- Modify: `lernseite.html` (TOC-Pills, 2 neue `lern-sek`, Diagrammzähler, Footer-Beschriftung)
- Modify: `assets/content.test.js` (`lern-sek === 21`, TOC-Pills #t20/#t21)

**Interfaces:**
- Consumes: SVG-Vorlagen aus Tasks 1/2 (angepasste Kopien, **keine identischen `id`/gleichen internen Anker** — bei Bedarf umbenennen).
- Produces: `<section class="lern-sek" id="t20|t21">`-Abschnitte + TOC-Pills.

- [ ] **Step 1: Failing Tests**

Ersetze/erweitere den bestehenden lernseite-Block:

```js
{
  const s = read("lernseite.html");
  const n = (s.match(/<section class="lern-sek"/g) || []).length;
  ok(n === 21, "lernseite: erwartet 21 lern-sek-Abschnitte, gefunden " + n);
  ok(s.includes('href="#t20"'), "lernseite: TOC-Pill #t20 fehlt");
  ok(s.includes('href="#t21"'), "lernseite: TOC-Pill #t21 fehlt");
  ok(/id="t20"/.test(s) && /id="t21"/.test(s), "lernseite: sec-head-Anker t20/t21 fehlen");
}
```

(Den bestehenden Check `s.includes("<h2>OSI-Modell &amp; TCP/IP</h2>")`/`#t19` beibehalten.)
Run → FAIL.

- [ ] **Step 2: Abschnitte bauen**

Vor dem Footer (nach dem `t19`-`lern-sek`, ~Zeile 2396) im **Muster der bestehenden Abschnitte** (zuerst den `t19`-Block lesen: `<div class="sec-head" id="tN"><span class="ix">N</span><h2>…</h2></div>` + `<section class="lern-sek" style="contain-intrinsic-size: auto <px>">…</section>`):
- **t20 · VPN:** Konzept-Zusammenfassung (VPN = verschlüsselter Tunnel; IP-Tunneling/fiktive IP; 3 Typen End-to-Site/Site-to-Site/End-to-End) + 1–2 SVGs (VPN-Tunnel, 3 Typen — angepasste Kopien aus Task 1).
- **t21 · Virtualisierung:** Konzept-Zusammenfassung (VM/Wirt-Gast, Hypervisor Typ 1/2, Server-/Desktop-/App-Virtualisierung, VDI vs. DaaS, Vor-/Nachteile) + 1–2 SVGs (VM-Stack, Bare-Metal vs. Hosted).
TOC-Pills nach `#t19` ergänzen: `<a class="pill" href="#t20"><b>20</b> VPN <span class="cnt">D</span></a>` und `<a class="pill" href="#t21"><b>21</b> Virtualisierung <span class="cnt">D</span></a>` (D = SVG-Zahl des jeweiligen Abschnitts). `contain-intrinsic-size` grob an die Abschnittshöhe.

- [ ] **Step 3: Diagrammzähler der Lernseite aktualisieren**

Neu zählen: `grep -c '<svg ' lernseite.html`. Alle „66"-Stellen auf den neuen Wert setzen: `scorechip` (Zeile 40 „Konzepte & 66 Diagramme"), Lede „allen 66 Diagrammen" (48), Pill `<b>66</b> Diagramme` (53), die `cnt`-Spans der neuen TOC-Pills; Footer „Lernseite Themen 1–19" → „1–21". **Merke** den neuen Diagrammwert für Task 8 (index „allen N Diagrammen").

- [ ] **Step 4: Grün (lernseite-Teil)**

Run: `node assets/content.test.js` → lernseite-Checks (`lern-sek === 21`, TOC, Diagrammzähler `s.includes(nsvg + " Diagramme")`) grün. (index „allen N Diagrammen" wird in Task 8 gesetzt → dieser eine Check ggf. noch rot.)

---

### Task 7: Probe-SA erweitern (34 Auswahl + 6 offen, 90 min)

**Files:**
- Modify: `pruefung.html` (4 neue `exam-q`, 1 neue `open-q`, 2 Sektionsüberschriften)
- Modify: `assets/pruefung.js:8` (`DURATION`), `:20-26` (`OPEN_TASKS`)
- Modify: `assets/content.test.js:83,85` (`examQ === 34`, `openQ === 6`)
- Modify: `assets/pruefung.test.js` (erläuternder Kommentar)

**Interfaces:**
- Produces: `OPEN_TASKS`-Eintrag `{ id: "open-virt", label: "Aufgabe O6 · Server-Virtualisierung", max: 3 }`; `DURATION = 90 * 60`.

- [ ] **Step 1: Tests anpassen (rot)**

In `assets/content.test.js`: `examQ === 30` → `examQ === 34`; `openQ === 5` → `openQ === 6`. Run → FAIL (30≠34).

- [ ] **Step 2: 4 Auswahlfragen ergänzen**

In `pruefung.html` direkt **vor** `<div class="sec-head"><span class="ix">B</span>…` (Ende des Auswahlteils, ~Zeile 441) vier `article.q exam-q` nach dem Muster der bestehenden (jede mit `data-answer="<Index der richtigen Option>"`, `ul.q-options` mit `li.opt`+`span.tick`, `q-solution`). Optionsreihenfolge so, dass `data-answer` stimmt:
1. `data-answer="1"` „Welcher VPN-Typ koppelt zwei Firmenstandorte über VPN-Gateways ohne Client auf den Hosts?" — Optionen: [End-to-Site, **Site-to-Site**, End-to-End, Proxy-VPN].
2. `data-answer="1"` „Wie heißt das Verschlüsseln und nochmalige Verpacken der Datenpakete beim VPN?" — [NAT, **IP-Tunneling**, Broadcasting, Routing].
3. `data-answer="1"` „Ein Typ-1- (Bare-Metal-)Hypervisor …" — [benötigt ein vorinstalliertes Betriebssystem, **setzt direkt auf der Hardware auf (kein Host-BS)**, ist immer langsamer als Typ 2, läuft nur in der Cloud].
4. `data-answer="1"` „Worin unterscheidet sich VDI von DaaS?" — [VDI = Cloud / DaaS = on-premises, **VDI = on-premises Rechenzentrum / DaaS = Cloud-Anbieter**, beide sind identisch, VDI benötigt keinen Server].

- [ ] **Step 3: Überschrift Auswahlteil aktualisieren**

`<h2>Auswahlteil (30 Fragen · je 1 P)</h2>` → `<h2>Auswahlteil (34 Fragen · je 1 P)</h2>`.

- [ ] **Step 4: Offene Aufgabe O6 ergänzen**

Nach `open-osi` (~Zeile 658 ff.) einen `article.q open-q id="open-virt" data-ki-max="3"` nach dem Muster von `open-osi` (Textarea `.code-input`, `button.q-copyprompt`, `<template class="prompt-tpl">…{{CODE}}</template>`, gesperrter `q-reveal`, `q-solution`): „Erkläre **Server-Virtualisierung**: Was ist eine VM, wozu dient der Hypervisor, und worin unterscheiden sich Typ 1 und Typ 2? Nenne 2 Vorteile." Prompt-Kriterien: VM/Wirt-Gast (1 P), Hypervisor + Typ-1/2-Unterschied (1 P), 2 Vorteile (1 P). Überschrift `<h2>Offener Teil (5 Aufgaben · 18 P · KI-Bewertung)</h2>` → `<h2>Offener Teil (6 Aufgaben · 21 P · KI-Bewertung)</h2>`.

- [ ] **Step 5: `pruefung.js` anpassen**

Zeile 8: `var DURATION = 90 * 60;` (Kommentar auf „90 min" aktualisieren). `OPEN_TASKS` um den Eintrag ergänzen:

```js
    { id: "open-osi",        label: "Aufgabe O5 · OSI-Troubleshooting",    max: 3 },
    { id: "open-virt",       label: "Aufgabe O6 · Server-Virtualisierung", max: 3 }
```

(Punkte-/Notenlogik unangetastet — `OPEN_MAX` = 21 ergibt sich automatisch.)

- [ ] **Step 6: `pruefung.test.js`-Kommentar aktualisieren**

Zeile 44 Kommentar „30 Auswahl (30 P) + 18 offen" → „34 Auswahl (34 P) + 21 offen" (nur Kommentar; die `calculateExamResult`-Beispiele mit den Literalen 30/30/18/18 bleiben gültig — sie prüfen die generische Arithmetik).

- [ ] **Step 7: Grün (Probe-SA-Teil)**

Run: `node assets/content.test.js` → `examQ === 34`, `openQ === 6` grün; jede neue `exam-q` hat gültiges `data-answer`.
Run: `node assets/pruefung.test.js` → OK.

---

### Task 8: Startseite `index.html` — Sterntopologie, Karten, Pills

**Files:**
- Modify: `index.html` (Sterntopologie-SVG, 2 Themenkarten, Hero-Pills/Texte, Titel, Lernseiten-/Probe-SA-Karten-Meta)

**Interfaces:**
- Consumes: finale `article.q`/`<svg`-Zahlen aller Themenseiten (Tasks 1–3), Diagrammzahl der Lernseite (Task 6).
- Produces: index-Pills = echte Summen; Karten-Metas 20/21 = echte Zahlen; 21-Knoten-Sterntopologie.

- [ ] **Step 1: Sterntopologie für 21 Knoten neu generieren**

Erzeuge das SVG-Innere per Generator (Ellipse um Hub `(470,340)`, `rx=290`, `ry=300`, Start oben, im Uhrzeigersinn) — Knotenmitte = Linien-Endpunkt = Rect-Center. Lege `scratch/star.js` an:

```js
const N=[[1,"1-grundbegriffe.html","Grundbegriffe"],[2,"2-verkabelungsplan.html","Verkabelungsplan"],
[3,"3-uebertragungsmedien.html","Übertr.medien"],[4,"4-stueckliste.html","Stückliste"],
[5,"5-geraeteklassen.html","Geräteklassen"],[6,"6-strukturierte-verkabelung.html","Strukt. Verkab."],
[7,"7-it-infrastruktur.html","IT-Infrastruktur"],[8,"8-edgecomputing.html","Edge-Computing"],
[9,"9-server-betriebssystem.html","Server-BS"],[10,"10-adressierung.html","Adressierung"],
[11,"11-dhcp-dns.html","DHCP & DNS"],[12,"12-uebertragungsarten.html","Übertr.arten"],
[13,"13-topologien.html","Topologien"],[14,"14-speichersysteme.html","Speichersysteme"],
[15,"15-raid.html","RAID"],[16,"16-email-protokolle.html","E-Mail"],
[17,"17-netzwerktechnologien.html","Netzwerktech."],[18,"18-vlan.html","VLAN"],
[19,"19-osi-modell.html","OSI-Modell"],[20,"20-vpn.html","VPN"],
[21,"21-virtualisierung.html","Virtualisierung"]];
const cx=470,cy=340,rx=290,ry=300,esc=s=>s.replace(/&/g,"&amp;");
let lines="",nodes="";
N.forEach((t,i)=>{const a=(-90+i*360/N.length)*Math.PI/180;
 const x=Math.round(cx+rx*Math.cos(a)),y=Math.round(cy+ry*Math.sin(a));
 lines+=`          <line x1="470" y1="340" x2="${x}" y2="${y}"></line>\n`;
 nodes+=`        <a href="${t[1]}">\n          <g class="node">\n`+
  `            <rect x="${x-76}" y="${y-23}" width="152" height="46" rx="6" fill="#fff" stroke="#DD5430" stroke-width="2"></rect>\n`+
  `            <text x="${x}" y="${y-3}" text-anchor="middle" class="svg-title" style="font-size: 16px; fill: #dd5430">${t[0]}</text>\n`+
  `            <text x="${x}" y="${y+12}" text-anchor="middle" class="svg-label-sm">${esc(t[2])}</text>\n          </g>\n        </a>\n`;});
console.log("<!--LINES-->\n"+lines+"<!--NODES-->\n"+nodes);
```

Run: `node scratch/star.js`. Ersetze im `panel-star`-SVG (a) den `<g stroke="#B9C7D2" stroke-width="2">…</g>`-Block durch die generierten `<line>` (in dieselbe `<g>` gewrappt) und (b) **alle** `<a href="…"><g class="node">…</g></a>` durch die generierten Knoten. Danach `scratch/star.js` löschen. Prüfe visuell/Bounding: alle 21 Rects innerhalb `viewBox="0 0 940 680"` (bei Überlauf `rx/ry` leicht reduzieren und neu generieren).

- [ ] **Step 2: Sterntopologie-Beschriftungen**

`aria-label` des Stern-SVG „…mit den 19 Themenseiten" → „…21 Themenseiten". Hub-Texte: `FUIT · Test 1–19` → `FUIT · Test 1–21`.

- [ ] **Step 3: Zwei Themenkarten ergänzen**

Im ersten `topic-grid` nach der Karte für 19 zwei `a.topic-card` (Muster der bestehenden Karten) einfügen:
```html
<a class="topic-card" href="20-vpn.html">
  <span class="tc-num">20</span>
  <h3>VPN</h3>
  <p>Virtual Private Network: verschlüsselter „Tunnel" durchs Internet (IP-Tunneling, fiktive IP), Fernzugriff und die drei VPN-Typen End-to-Site, Site-to-Site und End-to-End.</p>
  <span class="tc-meta">X Aufgaben · Y Diagramme</span>
</a>
<a class="topic-card" href="21-virtualisierung.html">
  <span class="tc-num">21</span>
  <h3>Virtualisierung</h3>
  <p>Virtuelle Maschinen &amp; Hypervisor (Typ 1 Bare-Metal vs. Typ 2 Hosted), Server-, Desktop- und Applikationsvirtualisierung, VDI vs. DaaS sowie Vor- und Nachteile.</p>
  <span class="tc-meta">X Aufgaben · Y Diagramme</span>
</a>
```
`X`/`Y` = exakte Zahlen: `grep -c '<article class="q"' 20-vpn.html` / `grep -c '<svg ' 20-vpn.html` (und für 21). **Format exakt** `X Aufgaben · Y Diagramme` (Test vergleicht String-genau).

- [ ] **Step 4: Karten-Metas gegen den Ist-Stand abgleichen (auch OSI)**

Falls Task 3 die OSI-Zahlen verändert hat, die `tc-meta` der Karte `19-osi-modell.html` entsprechend anpassen. Prüfe zur Sicherheit alle 21 Karten-Metas gegen die Ist-Zahlen (der Test erzwingt exakte Gleichheit).

- [ ] **Step 5: Hero-Pills & Texte finalisieren**

Summen berechnen:
`node -e "const fs=require('fs');const T=require('./scratch/topics.json');let q=0,s=0;for(const f of T){const c=fs.readFileSync(f,'utf8');q+=(c.match(/<article class=\"q\"/g)||[]).length;s+=(c.match(/<svg /g)||[]).length;}console.log(q,s)"` — oder einfacher die Liste inline. Praktisch: zähle über alle 21 Themenseiten die `<article class="q"`- und `<svg `-Summen.
Setze:
- Hero-Pills: `<b>19</b> Themen` → `<b>21</b> Themen`; `<b>304</b> Aufgaben` → `<b>QSUM</b> Aufgaben`; `<b>69</b> Diagramme` → `<b>SSUM</b> Diagramme`.
- `<title>` „Themen 1–19" → „1–21"; H1 „Themen 1 bis 19" → „…21"; Lede „Neunzehn Themen …" → „Einundzwanzig Themen … bis VLAN, OSI-Modell, VPN und Virtualisierung"; `explore-sub` „die 19 Themen" → „die 21 Themen"; Footer „Themen 1–19" → „1–21".
- Lernseiten-Karte `tc-meta` „18 Themen · 63 Diagramme" → „21 Themen · <LernseiteSVG> Diagramme"; Text „allen 66 Diagrammen" → „allen <LernseiteSVG> Diagrammen" (Wert aus Task 6 Step 3).
- Probe-SA-Karte `tc-meta` „30 Auswahlfragen · offener Teil · 80 min" → „34 Auswahlfragen · offener Teil · 90 min"; Kartentext „über alle Themen 1–19: 30 …" → „…1–21: 34 …".

- [ ] **Step 6: Grün (index-Teil)**

Run: `node assets/content.test.js` → index-Checks grün: `<b>21</b> Themen`, Pills = Summen, alle Karten-Metas = Ist-Zahlen, „allen N Diagrammen".

---

### Task 9: Gesamt-Verifikation + Workspace-Hygiene

**Files:**
- Modify: `README.md`
- Modify (eine Ebene höher): `..\CLAUDE.md`
- Create bei Bedarf: `..\20 VPN\_INHALT.md`, `..\21 Virtualisierungen\_INHALT.md`

- [ ] **Step 1: Volle Testsuite**

Run: `node assets/content.test.js` → OK (Anzahl Checks notieren).
Run: `node assets/pruefung.test.js` → OK (Anzahl Checks notieren).
Falls rot: die gemeldete Zahl/Datei gezielt nachziehen (typisch: eine Karten-Meta oder eine Summe um 1 daneben).

- [ ] **Step 2: `README.md` aktualisieren**

Themenliste auf 1–21 (Zeilen für 20 VPN, 21 Virtualisierung ergänzen); Zähler (Aufgaben/Diagramme/Seiten) auf die Ist-Werte; Probe-SA „34 Auswahl + offener Teil, 90 min".

- [ ] **Step 3: `..\CLAUDE.md` Routing ergänzen**

Zwei Routing-Zeilen nach Thema 19 ergänzen:
`| 20 | \`20 VPN\` | \`03 Infotext.pdf\` | *(noch kein Notion-Abschnitt — Sync offen)* |`
`| 21 | \`21 Virtualisierungen\` | \`01 Virtualisierung AB_Schüler.pdf\`, \`00 Situation, Auftrag und Infos.pdf\`, \`03 Leitfragen.pdf\` | *(noch kein Notion-Abschnitt — Sync offen)* |`
In der Hilfsmaterial-Tabelle den Website-Umfang „alle Themen 1–19" → „1–21" präzisieren. Test-relevanter Hinweis unverändert lassen.

- [ ] **Step 4: `_INHALT.md` nur bei Binärdateien**

Beide Ordner (`20 VPN`, `21 Virtualisierungen`) enthalten **nur PDFs** (direkt lesbar) → gemäß CLAUDE.md-Konvention **kein** `_INHALT.md` nötig. Nur anlegen, falls beim Umsetzen doch nicht-lesbare Dateien (`.docx/.pptx/.xlsx/.drawio`/inhaltstragende `.png`) auftauchen.

- [ ] **Step 5: Browser-Smoke (falls Chrome DevTools MCP verfügbar)**

Startseite (Sterntopologie zeigt 21 Knoten ohne Überlappung; Schnellsuche/Memory/Quiz-Tor/Schatzsuche/Glücksrad/Snake funktionieren mit 21 Einträgen; Konsole fehlerfrei), Seiten 20 + 21 (MC bewerten, Multi-Select „Auswerten", Tabelle ausfüllen, KI-Prompt kopieren, Reload → Zustand erhalten, Reset), Lernseite (Abschnitte 20/21, Anker `#t20`/`#t21`), Probe-SA (Start → Timer 90:00, Abgeben, O6 im Open-Panel, Note). Falls MCP nicht verfügbar: entfällt, Selbsttests sind maßgeblich.

- [ ] **Step 6: Abschlussbericht**

Kurzbericht an den Nutzer: geänderte/neue Dateien, finale Zähler (Themen 21, Aufgaben-/Diagrammsummen, Probe-SA 34/6), OSI-Abgleich-Ergebnis, Testergebnisse. **Kein Commit** (CLAUDE.md).

## Self-Review (durchgeführt)

- **Spec-Abdeckung:** §1→Task 1, §2→Task 2, §3→Task 3, §4→Tasks 4–6+8, §5→Task 7, §6→Tests in allen Tasks + Task 9, §7→Task 9. Keine Lücke.
- **Platzhalter:** Frage-/Antwortinhalte, Testcode, Generator-Skript und Zähler-Anweisungen sind ausformuliert. Bewusst „beim Bau exakt zählen" sind nur die `qTotal`/Pill-/Meta-Zahlen — sie hängen am Ist-Stand der gebauten Seiten und werden per Test erzwungen (Muster-Treue, kein Platzhalter). Struktur-Markup wird durch „Muster von `19-osi-modell.html`/`t19`-Abschnitt lesen" übernommen.
- **Konsistenz:** Dateinamen `20-vpn.html`/`21-virtualisierung.html` überall identisch; `qTotal` (Task 5) == Test-Zählung; `open-virt`/O6 + `DURATION=90*60` (Task 7) == Spec; `examQ===34`/`openQ===6` konsistent zwischen Task 7 und Markup; Sterntopologie-Generator (Task 8) reproduziert das bestehende Rect/Line-Schema (Center = Linien-Endpunkt).
