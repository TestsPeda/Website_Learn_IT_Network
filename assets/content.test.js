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
  "15-raid.html","16-email-protokolle.html","17-netzwerktechnologien.html","18-vlan.html"];
const allTopics = ["1-grundbegriffe","2-verkabelungsplan","3-uebertragungsmedien","4-stueckliste",
  "5-geraeteklassen","6-strukturierte-verkabelung","7-it-infrastruktur","8-edgecomputing",
  "9-server-betriebssystem","10-adressierung","11-dhcp-dns","12-uebertragungsarten","13-topologien",
  "14-speichersysteme","15-raid","16-email-protokolle","17-netzwerktechnologien","18-vlan"].map(n=>n+".html");

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
  ok(examQ === 26, "pruefung: erwartet 26 exam-q, gefunden " + examQ);
  const openQ = (s.match(/class="q open-q"/g) || []).length;
  ok(openQ === 4, "pruefung: erwartet 4 open-q, gefunden " + openQ);
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

/* --- explore.js: alle 18 Themen in der Navigations-Datenbank --- */
{
  const s = read("assets/explore.js");
  ok(s.includes('17-netzwerktechnologien.html'), "explore.js: Thema 17 fehlt in TOPICS");
  ok(s.includes('18-vlan.html'), "explore.js: Thema 18 fehlt in TOPICS");
  const entries = (s.match(/\{ n: \d+,/g) || []).length;
  ok(entries === 18, "explore.js: erwartet 18 TOPICS-Einträge, gefunden " + entries);
  // Anzeige-Zähler nicht mehr auf 16 hartkodiert (Swipe-Schwelle < 16 ausgenommen)
  ok(!/\/16 (Paare|frei|gefunden)/.test(s) && !/Alle 16 (Paare|Themen)/.test(s),
     "explore.js: veralteter 16er-Zähler in einer Spiel-Ansicht");
}

/* --- keine externen URLs (offline/GitHub Pages) --- */
for (const f of allTopics.concat(["index.html","lernseite.html","pruefung.html"])) {
  const s = read(f);
  ok(!/https?:\/\/(cdn|fonts|unpkg|ajax|maxcdn)/i.test(s), f + ": externe Ressource gefunden");
}

console.log("content.test.js: OK (" + checks + " Prüfungen bestanden)");
