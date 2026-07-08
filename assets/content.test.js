/* Inhalts-/Wiring-Self-Test (Node, ohne Abhängigkeiten).
   Prüft die erweiterte Website: KI-Freitextaufgaben auf Themenseiten, Probe-SA,
   Navigation zur Probe-SA und die Verdrahtung der Assets.
   Ausführen im Zielordner:  node assets/content.test.js  */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const DIR = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(DIR, f), "utf8");
let checks = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); checks++; };

const kiPages = ["10-adressierung.html","11-dhcp-dns.html","13-topologien.html","14-speichersysteme.html",
  "15-raid.html","16-email-protokolle.html","17-netzwerktechnologien.html","18-vlan.html",
  "19-osi-modell.html","20-vpn.html","21-virtualisierung.html"];
const allTopics = ["1-grundbegriffe","2-verkabelungsplan","3-uebertragungsmedien","4-stueckliste",
  "5-geraeteklassen","6-strukturierte-verkabelung","7-it-infrastruktur","8-edgecomputing",
  "9-server-betriebssystem","10-adressierung","11-dhcp-dns","12-uebertragungsarten","13-topologien",
  "14-speichersysteme","15-raid","16-email-protokolle","17-netzwerktechnologien","18-vlan",
  "19-osi-modell","20-vpn","21-virtualisierung"].map(n=>n+".html");

/* --- Kern-Assets existieren --- */
for (const a of ["assets/style.css","assets/quiz.js","assets/print.css","assets/code.css","assets/code.js","assets/pruefung.js"]) {
  ok(fs.existsSync(path.join(DIR,a)), "Asset fehlt: " + a);
}

/* --- Alle Themenseiten + index/lernseite verlinken print.css und Probe-SA --- */
for (const f of allTopics.concat(["index.html","lernseite.html"])) {
  const s = read(f);
  ok(s.includes('href="assets/print.css"'), f + ": print.css nicht verlinkt");
  ok(s.includes('pruefung.html'), f + ": kein Probe-SA-Link/Verweis");
}

/* --- KI-Themenseiten: Modul-Wiring + Freitextaufgabe (KI-Feedback, ohne Score) --- */
for (const f of kiPages) {
  const s = read(f);
  ok(s.includes('href="assets/code.css"'), f + ": code.css fehlt");
  ok(s.includes('src="assets/code.js"'), f + ": code.js fehlt");
  ok(/<script src="assets\/quiz\.js"><\/script>\s*<script src="assets\/code\.js">/.test(s),
     f + ": code.js nicht NACH quiz.js");
  ok(s.includes('data-ki-max='), f + ": keine KI-Aufgabe (data-ki-max)");
  ok(s.includes('class="q-copyprompt"'), f + ": kein KI-Prompt-Button");
  ok(s.includes('template class="prompt-tpl"') || s.includes('<template class="prompt-tpl">'),
     f + ": kein prompt-tpl");
  ok(s.includes('{{CODE}}'), f + ": Prompt ohne {{CODE}}-Platzhalter");
  ok(s.includes('class="code-input"'), f + ": kein code-input");
}

/* --- quiz.js: KI-Punkte-Score-Einbindung entfernt (nur noch Auto-Fragen) --- */
{
  const s = read("assets/quiz.js");
  ok(!s.includes("KiScore"), "quiz.js: KI-Punkte-Score-Einbindung nicht entfernt");
  ok(!s.includes('score:update'), "quiz.js: score:update-Listener nicht entfernt");
  ok(s.includes('.code-input') && s.includes('initAnswerField'), "quiz.js: kein code-input-Guard");
}

/* --- code.js: Freitext-Persistenz + Prompt-Button, KEINE Punktevergabe --- */
{
  const s = read("assets/code.js");
  ok(!s.includes("fuit-kiscore:"), "code.js: KI-Punkte-Persistenz nicht entfernt");
  ok(!s.includes("score:update"), "code.js: Score-Event nicht entfernt");
  ok(!s.includes("ki-score"), "code.js: KI-Punkte-Panel nicht entfernt");
  ok(s.includes("fuit-code:"), "code.js: keine Code-Eingabe-Persistenz");
  ok(s.includes("buildPrompt") && s.includes("q-copyprompt"), "code.js: kein Prompt-Kopierbutton");
}

/* --- Probe-SA (pruefung.html) --- */
{
  const s = read("pruefung.html");
  ok(s.includes('id="exam-gate"'), "pruefung: kein Start-Gate");
  ok(s.includes('id="exam-content"') && /id="exam-content"\s+hidden/.test(s), "pruefung: exam-content nicht hidden");
  ok(s.includes('id="start-btn"'), "pruefung: kein Start-Button");
  ok(s.includes('id="submit-btn"'), "pruefung: kein Abgeben-Button");
  ok(s.includes('id="timer"'), "pruefung: kein Timer");
  ok(s.includes('id="history"'), "pruefung: kein Verlauf");
  ok(s.includes('src="assets/pruefung.js"'), "pruefung: pruefung.js nicht geladen");
  ok(!s.includes('src="assets/code.js"'), "pruefung: code.js darf NICHT geladen sein (Konflikt)");
  ok(!s.includes('src="assets/quiz.js"'), "pruefung: quiz.js darf NICHT geladen sein");
  ok(s.includes('href="assets/code.css"'), "pruefung: code.css (Styling) fehlt");
  const examQ = (s.match(/class="q exam-q"/g) || []).length;
  ok(examQ === 34, "pruefung: erwartet 34 exam-q, gefunden " + examQ);
  const openQ = (s.match(/class="q open-q"/g) || []).length;
  ok(openQ === 6, "pruefung: erwartet 6 open-q, gefunden " + openQ);
  // jede exam-q hat data-answer im gültigen Bereich
  const blocks = s.split('class="q exam-q"').slice(1);
  blocks.forEach((b, i) => {
    const ans = b.match(/data-answer="(\d+)"/);
    ok(ans, "exam-q " + (i+1) + ": kein data-answer");
    const nOpts = (b.split('class="opt"').length - 1);
    ok(nOpts >= 2 && parseInt(ans[1],10) < nOpts, "exam-q " + (i+1) + ": data-answer außerhalb der Optionen");
  });
}

/* --- index: Probe-SA in der Navigation --- */
{
  const s = read("index.html");
  ok(s.includes('href="pruefung.html"'), "index: kein Probe-SA-Link");
  ok(s.includes('<h3>Probe-SA</h3>'), "index: keine Probe-SA-Karte");
  ok(s.includes('Probe-SA starten'), "index: keine Probe-SA-Hero-Pill");
  ok(s.includes('17-netzwerktechnologien.html') && s.includes('18-vlan.html'),
     "index: Themen 17/18 fehlen in der Sterntopologie");
  ok(!s.includes('die 16 Themen'), "index: veralteter Text „16 Themen\"");
}

/* --- Nav: Themen 19–21 überall verlinkt, keine veralteten Themenzahl-Beschriftungen --- */
for (const f of allTopics.concat(["index.html","lernseite.html","pruefung.html"])) {
  const s = read(f);
  ok(s.includes('href="19-osi-modell.html"'), f + ": Nav-Link auf Thema 19 fehlt");
  ok(s.includes('href="20-vpn.html"'), f + ": Nav-Link auf Thema 20 fehlt");
  ok(s.includes('href="21-virtualisierung.html"'), f + ": Nav-Link auf Thema 21 fehlt");
  ok(!s.includes("Themen 1–18") && !s.includes("Themen 1 bis 18"),
     f + ": veraltete Beschriftung „Themen 1–18\"");
  ok(!s.includes("Themen 1–19") && !s.includes("Themen 1 bis 19"),
     f + ": veraltete Beschriftung „Themen 1–19\"");
}
{
  const s = read("index.html");
  ok(!/Achtzehn Themen/.test(s), "index: veralteter Hero-Text „Achtzehn Themen\"");
  ok(!/Neunzehn Themen/.test(s), "index: veralteter Hero-Text „Neunzehn Themen\"");
  ok(s.includes("<b>21</b> Themen"), "index: Themen-Pill nicht auf 21 aktualisiert");
  ok(!/die 18 Themen/.test(s), "index: veralteter Text „die 18 Themen\"");
  ok(!/die 19 Themen/.test(s), "index: veralteter Text „die 19 Themen\"");
}
{
  const s = read("18-vlan.html");
  ok(/class="next" href="19-osi-modell\.html"/.test(s), "18-vlan: Pager führt nicht zu Thema 19");
}
{
  const s = read("19-osi-modell.html");
  ok(/class="next" href="20-vpn\.html"/.test(s), "19-osi: Pager führt nicht zu Thema 20");
}
{
  const s = read("20-vpn.html");
  ok(/class="next" href="21-virtualisierung\.html"/.test(s), "20-vpn: Pager führt nicht zu Thema 21");
}
{
  const s = read("lernseite.html");
  ok(s.includes("<h2>OSI-Modell &amp; TCP/IP</h2>"), "lernseite: Abschnitt 19 fehlt");
  ok(s.includes('href="#t19"'), "lernseite: TOC-Pill für Abschnitt 19 fehlt");
  ok(s.includes('href="#t20"'), "lernseite: TOC-Pill für Abschnitt 20 fehlt");
  ok(s.includes('href="#t21"'), "lernseite: TOC-Pill für Abschnitt 21 fehlt");
  ok(/id="t20"/.test(s) && /id="t21"/.test(s), "lernseite: sec-head-Anker t20/t21 fehlen");
}

/* --- explore.js: alle 19 Themen in der Navigations-Datenbank --- */
{
  const s = read("assets/explore.js");
  ok(s.includes('18-vlan.html'), "explore.js: Thema 18 fehlt in TOPICS");
  ok(s.includes('19-osi-modell.html'), "explore.js: Thema 19 fehlt in TOPICS");
  const entries = (s.match(/\{ n: \d+,/g) || []).length;
  ok(entries === 21, "explore.js: erwartet 21 TOPICS-Einträge, gefunden " + entries);
  // Anzeige-Zähler nicht auf eine alte Themenzahl hartkodiert (16er/18er)
  ok(!/\/1[68] (Paare|frei|gefunden)/.test(s) && !/Alle 1[68] (Paare|Themen)/.test(s),
     "explore.js: veralteter 16er/18er-Zähler in einer Spiel-Ansicht");
}

/* --- quiz.js: MC-Persistenz, Wiederherstellung, Status-Rolle; Reset auf jeder Themenseite --- */
{
  const s = read("assets/quiz.js");
  ok(s.includes("fuit-mc:"), "quiz.js: keine MC-Persistenz (fuit-mc:)");
  ok(s.includes("restoreState"), "quiz.js: keine Wiederherstellung (restoreState)");
  ok(s.includes('"status"'), "quiz.js: Score-Chip ohne role=status");
  ok(s.includes("reset-answers"), "quiz.js: kein Reset-Handler");
}
for (const f of allTopics) {
  ok(read(f).includes('id="reset-answers"'), f + ": kein Reset-Button");
}

/* --- Zähler: Hero-Pills und Themenkarten des Index = echte Zahlen der Seiten --- */
{
  const idx = read("index.html");
  let qSum = 0, svgSum = 0;
  for (const f of allTopics) {
    const s = read(f);
    const nq = (s.match(/<article class="q"/g) || []).length;
    const ns = (s.match(/<svg /g) || []).length;
    qSum += nq; svgSum += ns;
    const card = idx.match(new RegExp('<a class="topic-card" href="' + f.replace(".", "\\.") + '"[\\s\\S]*?class="tc-meta">([^<]+)<'));
    ok(card, "index: keine Themenkarte für " + f);
    ok(card[1] === nq + " Aufgaben · " + ns + " Diagramme",
       "index: Karten-Meta für " + f + " ist „" + card[1] + "“, echt: " + nq + " Aufgaben · " + ns + " Diagramme");
  }
  ok(idx.includes("<b>" + qSum + "</b> Aufgaben"), "index: Aufgaben-Pill entspricht nicht " + qSum);
  ok(idx.includes("<b>" + svgSum + "</b> Diagramme"), "index: Diagramme-Pill entspricht nicht " + svgSum);
}

/* --- lernseite: 19 lern-sek-Wrapper (content-visibility-Performance) --- */
{
  const s = read("lernseite.html");
  const n = (s.match(/<section class="lern-sek"/g) || []).length;
  ok(n === 21, "lernseite: erwartet 21 lern-sek-Abschnitte, gefunden " + n);
  ok(read("assets/style.css").includes("content-visibility: auto"), "style.css: lern-sek ohne content-visibility");
  ok(read("assets/print.css").includes("content-visibility: visible"), "print.css: Druck-Override fehlt");
}

/* --- Zähler: Lernseiten-Diagrammzahl = echte SVG-Anzahl der Lernseite --- */
{
  const s = read("lernseite.html");
  const nsvg = (s.match(/<svg /g) || []).length;
  ok(s.includes(nsvg + " Diagramme"), "lernseite: Diagramm-Zähler entspricht nicht " + nsvg);
  const idx = read("index.html");
  ok(idx.includes("allen " + nsvg + " Diagrammen"), "index: Lernseiten-Beschreibung nennt nicht " + nsvg + " Diagramme");
}

/* --- explore.js: qTotal je Thema == Anzahl MC-Karten (q-options) der Seite --- */
{
  const ex = read("assets/explore.js");
  for (let i = 0; i < allTopics.length; i++) {
    const s = read(allTopics[i]);
    const mc = s.split('<article class="q"').slice(1)
      .filter(b => b.includes('class="q-options"')).length;
    const m = ex.match(new RegExp("\\{ n: " + (i + 1) + ",[^}]*qTotal: (\\d+)"));
    ok(m, "explore.js: qTotal für Thema " + (i + 1) + " fehlt");
    ok(m && parseInt(m[1], 10) === mc,
       "explore.js: qTotal Thema " + (i + 1) + " = " + (m && m[1]) + ", Seite hat " + mc);
  }
}

/* --- keine externen URLs (offline/GitHub Pages) --- */
for (const f of allTopics.concat(["index.html","lernseite.html","pruefung.html"])) {
  const s = read(f);
  ok(!/https?:\/\/(cdn|fonts|unpkg|ajax|maxcdn)/i.test(s), f + ": externe Ressource gefunden");
}

console.log("content.test.js: OK (" + checks + " Prüfungen bestanden)");
