/* Hybrid-Code-Komponente (Modul) — für frei konstruierte Lösungen (Programmcode,
   Diagramme, längere Freitexte) mit KI-Feedback.

   Statische Seite (GitHub Pages): kein Server, kein API-Key. Ablauf:
     1. Antwort ins Feld schreiben (wird lokal gespeichert).
     2. „KI-Bewertungs-Prompt kopieren" → fertigen Prompt (Aufgabe + Kriterien +
        eigene Lösung) in eine KI einfügen und nach den Kriterien bewerten lassen.

   Die Freitextaufgaben dienen auf den Themenseiten nur dem Üben; sie fließen NICHT
   in den Seiten-Score ein — eine Punktevergabe gibt es ausschließlich in der Probe-SA.

   Vanilla JS, keine Abhängigkeiten. Muss NACH quiz.js eingebunden werden. */
(function () {
  "use strict";

  var PAGE = location.pathname;
  var CODE_PREFIX = "fuit-code:" + PAGE + "#";

  /* ---- Hilfen ---- */
  function qidOf(q, idx) {
    var num = q.querySelector(".q-num");
    return num ? num.textContent.trim() : "i" + idx;
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---- KI-Bewertungs-Prompt aus <template class="prompt-tpl"> + Eingabe bauen ---- */
  function buildPrompt(q) {
    var tpl = q.querySelector("template.prompt-tpl");
    var input = q.querySelector(".code-input");
    var tplText = tpl ? tpl.innerHTML : "";
    var code = input ? input.value : "";
    if (!code.trim()) code = "// (keine Antwort eingegeben — bitte oben eintragen)";
    return tplText.replace(/\{\{CODE\}\}/g, code).trim();
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "absolute"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  function flash(btn, msg) {
    var orig = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", orig);
    btn.textContent = msg; btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = btn.getAttribute("data-label");
      btn.classList.remove("copied");
    }, 1800);
  }
  function copyText(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { flash(btn, "✓ kopiert"); },
        function () { flash(btn, fallbackCopy(text) ? "✓ kopiert" : "Kopieren fehlgeschlagen"); }
      );
    } else {
      flash(btn, fallbackCopy(text) ? "✓ kopiert" : "Kopieren fehlgeschlagen");
    }
  }

  /* ---- Code-Eingabe persistieren ---- */
  function initCodePersist(q, id) {
    var input = q.querySelector(".code-input");
    if (!input) return;
    var key = CODE_PREFIX + id;
    var saved = lsGet(key);
    if (saved !== null) input.value = saved;
    input.addEventListener("input", function () { lsSet(key, input.value); });
  }

  /* ---- Prompt-Button ---- */
  function initCopy(q) {
    var btn = q.querySelector(".q-copyprompt");
    if (!btn) return;
    btn.setAttribute("data-label", btn.textContent);
    btn.addEventListener("click", function () { copyText(buildPrompt(q), btn); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".q").forEach(function (q, idx) {
      var id = qidOf(q, idx);
      initCodePersist(q, id);
      initCopy(q);
    });
  });
})();
