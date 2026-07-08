/* Logik-Self-Test der Probe-SA (Node + node:vm, ohne Abhängigkeiten).
   Lädt pruefung.js in einer Sandbox und prüft Notenschlüssel + Punkteverrechnung
   inkl. Übernahme der KI-Punkte (offener Teil) und Clamping.
   Ausführen im Zielordner:  node assets/pruefung.test.js  */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const src = fs.readFileSync(path.join(__dirname, "pruefung.js"), "utf8");

// Minimal-Stubs: readyState="loading" verhindert sofortiges init() (kein DOM nötig).
const sandbox = {
  window: {},
  document: { readyState: "loading", addEventListener() {} },
  localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
  setInterval() { return 0; }, clearInterval() {}, setTimeout() { return 0; },
  navigator: {}, console
};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const S = sandbox.window.ProbeSaScoring;
assert.ok(S && S.getIhkGrade && S.calculateExamResult, "ProbeSaScoring nicht exportiert");
let checks = 0;
const ok = (c, m) => { assert.ok(c, m); checks++; };
const eq = (a, b, m) => { assert.equal(a, b, m + " (ist " + a + ", soll " + b + ")"); checks++; };

/* --- Notenschlüssel-Schwellen --- */
eq(S.getIhkGrade(100).grade, 1, "100% → Note 1");
eq(S.getIhkGrade(92).grade, 1, "92% → Note 1");
eq(S.getIhkGrade(91.9).grade, 2, "91,9% → Note 2");
eq(S.getIhkGrade(81).grade, 2, "81% → Note 2");
eq(S.getIhkGrade(80).grade, 3, "80% → Note 3");
eq(S.getIhkGrade(67).grade, 3, "67% → Note 3");
eq(S.getIhkGrade(50).grade, 4, "50% → Note 4");
eq(S.getIhkGrade(49).grade, 5, "49% → Note 5");
eq(S.getIhkGrade(30).grade, 5, "30% → Note 5");
eq(S.getIhkGrade(29).grade, 6, "29% → Note 6");
eq(S.getIhkGrade(0).grade, 6, "0% → Note 6");

/* --- Punkteverrechnung: Auswahlteil + KI-Punkte (offener Teil) --- */
// Generische Beispielrechnung: 30 Auswahl + 18 offen = 48 P (die Live-SA nutzt 34 + 21 = 55 P). Volle Punkte → 100%.
let r = S.calculateExamResult(30, 30, 18, 18);
eq(r.totalScore, 48, "voll: Gesamtpunkte");
eq(r.totalMax, 48, "voll: Höchstpunkte");
eq(r.percentage, 100, "voll: 100%");
eq(r.grade, 1, "voll: Note 1");

// KI-Punkte werden korrekt addiert: 24/30 Auswahl + 12/18 offen = 36/48 = 75% → Note 3
r = S.calculateExamResult(24, 30, 12, 18);
eq(r.choiceScore, 24, "Auswahl übernommen");
eq(r.openScore, 12, "KI-/Offen-Punkte übernommen");
eq(r.totalScore, 36, "Summe Auswahl+Offen");
eq(r.grade, 3, "36/48 → Note 3");

/* --- Clamping: Überschreitung wird gekappt --- */
r = S.calculateExamResult(35, 30, 99, 18);   // beide über Max
eq(r.choiceScore, 30, "Auswahl auf Max gekappt");
eq(r.openScore, 18, "Offen auf Max gekappt");
eq(r.totalScore, 48, "Gesamt auf Höchstwert gekappt");

/* --- Clamping: negative Eingabe → 0 --- */
r = S.calculateExamResult(-5, 30, -3, 18);
eq(r.choiceScore, 0, "negative Auswahl → 0");
eq(r.openScore, 0, "negative Offen → 0");

/* --- Reiner Auswahlteil (kein offener Teil) --- */
r = S.calculateExamResult(15, 30, 0, 0);
eq(r.totalMax, 30, "ohne Offen: Höchstpunkte = Auswahl");
eq(r.percentage, 50, "15/30 → 50%");
eq(r.grade, 4, "50% → Note 4");

/* --- A11y-Zeitsteuerung (WCAG 2.2.1): Markup + Logik vorhanden --- */
{
  const html = fs.readFileSync(path.join(__dirname, "..", "pruefung.html"), "utf8");
  ok(html.includes('id="no-timelimit"'), "pruefung.html: Checkbox „Ohne Zeitlimit üben\" fehlt");
  ok(html.includes('id="extend-time"'), "pruefung.html: Button „+10 min\" fehlt");
  ok(/id="time-warning"[^>]*aria-live="polite"|aria-live="polite"[^>]*id="time-warning"/.test(html),
     "pruefung.html: Zeit-Warnung ohne aria-live=polite");
  ok(src.includes("noLimit"), "pruefung.js: keine Ohne-Zeitlimit-Logik");
  ok(src.includes("extend-time"), "pruefung.js: kein Verlängerungs-Handler");
}

/* --- Verlängerung: Anzeige-Chip + Erfassung im Verlauf --- */
{
  const html = fs.readFileSync(path.join(__dirname, "..", "pruefung.html"), "utf8");
  ok(html.includes('id="extend-total"'), "pruefung.html: Anzeige der Zusatzzeit (extend-total) fehlt");
  ok(src.includes("addedSeconds"), "pruefung.js: Verlängerungszeit wird nicht erfasst (addedSeconds)");
  // addedSeconds landet in beiden saveResult-Zweigen (finalisiert + offen-ausstehend)
  ok((src.match(/addedSeconds: addedSeconds/g) || []).length >= 2,
     "pruefung.js: addedSeconds nicht in beiden saveResult-Zweigen gespeichert");
  // Verlauf liest das Feld für die Zeit-Zelle
  ok(src.includes("r.addedSeconds"), "pruefung.js: Verlauf zeigt die Verlängerung nicht (r.addedSeconds)");
}

console.log("pruefung.test.js: OK (" + checks + " Prüfungen bestanden)");
