/* IT-Lernmaterial — generic quiz interaction.
   Works on any page that uses the .q / .opt / .q-reveal markup.
   No build step, no dependencies. */
(function () {
  "use strict";

  /* ----- Multiple-choice handling ----- */
  function initOptions(q) {
    var list = q.querySelector(".q-options");
    if (!list) return;
    var multi = list.getAttribute("data-multi") === "true";
    var opts = Array.prototype.slice.call(list.querySelectorAll(".opt"));

    opts.forEach(function (opt) {
      opt.setAttribute("role", multi ? "checkbox" : "radio");
      opt.setAttribute("tabindex", "0");
      opt.setAttribute("aria-checked", "false");
      opt.setAttribute("data-multi", multi ? "true" : "false");

      function choose() {
        if (list.classList.contains("locked")) return;
        if (multi) {
          opt.classList.toggle("picked");
          opt.setAttribute("aria-checked", opt.classList.contains("picked"));
          return;
        }
        lockSingle();
      }
      function lockSingle() {
        list.classList.add("locked");
        opts.forEach(function (o) {
          var ok = o.getAttribute("data-correct") === "true";
          if (o === opt) {
            o.classList.add(ok ? "correct" : "wrong");
            o.setAttribute("aria-checked", "true");
          }
          if (ok) o.classList.add("reveal-correct");
          o.querySelector(".tick").textContent = ok ? "✓" : (o === opt ? "✕" : "");
        });
        markCard(q, opt.getAttribute("data-correct") === "true");
        revealSolution(q, true);
      }

      opt.addEventListener("click", choose);
      opt.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); choose(); }
      });
    });

    /* multi-select: a check button grades the set */
    if (multi) {
      var chk = q.querySelector(".q-check");
      if (chk) chk.addEventListener("click", function () {
        list.classList.add("locked");
        var allRight = true;
        opts.forEach(function (o) {
          var ok = o.getAttribute("data-correct") === "true";
          var picked = o.classList.contains("picked");
          o.querySelector(".tick").textContent = ok ? "✓" : (picked ? "✕" : "");
          if (ok) o.classList.add("correct");
          else if (picked) o.classList.add("wrong");
          if (ok !== picked) allRight = false;
        });
        markCard(q, allRight);
        revealSolution(q, true);
      });
    }
  }

  function markCard(q, ok) {
    q.classList.remove("answered-ok", "answered-bad");
    q.classList.add(ok ? "answered-ok" : "answered-bad");
    updateScore();
  }

  /* ----- Reveal solution ----- */
  function revealSolution(q, force) {
    var btn = q.querySelector(".q-reveal");
    var sol = q.querySelector(".q-solution");
    if (!sol) return;
    var show = force === true ? true : sol.hidden;
    sol.hidden = !show;
    if (btn) {
      btn.setAttribute("aria-expanded", show ? "true" : "false");
      btn.textContent = show ? "Lösung ausblenden" : "Lösung anzeigen";
    }
  }

  function initReveal(q) {
    var btn = q.querySelector(".q-reveal");
    if (btn) btn.addEventListener("click", function () { revealSolution(q, false); });
  }

  /* ----- Antwortfeld für manuelle Aufgaben -----
     Freitext-, Zuordnungs-, Rechen-, Szenario- und Lückentext-Aufgaben haben
     keine auswählbaren Optionen, sondern nur eine Musterlösung zum Aufdecken.
     Hier bekommt jede solche Karte ein echtes Eingabefeld, in das man seine
     Antwort schreiben kann — ohne automatische Bewertung. Man notiert seine
     Lösung, deckt die Musterlösung auf und gleicht selbst ab. Der Text wird
     pro Aufgabe lokal gespeichert, damit er beim Auf-/Zuklappen erhalten bleibt. */
  /* ----- Inline-Eingabe in Ausfüll-Tabellen (Zuordnungsaufgaben) -----
     Manche Aufgaben zeigen eine Tabelle, in der eine Spalte vorgegeben ist und
     man in die zugehörige Zelle einen Wert einträgt (Platzhalter „?“). Statt
     eines separaten Textfeldes darunter wird hier direkt in der Zelle ein
     Eingabefeld erzeugt, sodass man an Ort und Stelle schreiben kann. Die
     Eingaben werden pro Zelle lokal gespeichert. Gibt true zurück, wenn
     mindestens eine Platzhalterzelle umgewandelt wurde. */
  function initTableInputs(q) {
    var body = q.querySelector(".q-body");
    if (!body) return false;

    var num = q.querySelector(".q-num");
    var baseKey = "fuit-answer:" + location.pathname + "#" +
      (num ? num.textContent.trim() : "") + ":cell:";
    var cellIndex = 0;
    var converted = false;

    Array.prototype.forEach.call(body.querySelectorAll("table"), function (table) {
      var headers = Array.prototype.map.call(
        table.querySelectorAll("thead th"),
        function (th) { return th.textContent.trim(); }
      );
      Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), function (row) {
        var cells = Array.prototype.slice.call(row.children);
        var rowLabel = cells.length ? cells[0].textContent.trim() : "";
        cells.forEach(function (cell, colIdx) {
          if (cell.textContent.trim() !== "?") return;
          converted = true;
          var key = baseKey + (cellIndex++);

          var input = document.createElement("input");
          input.type = "text";
          input.className = "q-cell-input";
          input.setAttribute("spellcheck", "false");
          input.setAttribute("autocomplete", "off");
          input.setAttribute("placeholder", "…");
          var colLabel = headers[colIdx] || "";
          input.setAttribute("aria-label",
            (rowLabel ? rowLabel + " — " : "") + colLabel);

          try { var saved = localStorage.getItem(key); if (saved) input.value = saved; } catch (e) {}
          input.addEventListener("input", function () {
            try { localStorage.setItem(key, input.value); } catch (e) {}
          });

          cell.textContent = "";
          cell.classList.add("q-cell-fill");
          cell.appendChild(input);
        });
      });
    });
    return converted;
  }

  function initAnswerField(q) {
    if (q.querySelector(".q-options")) return;   // Multiple-Choice → wird automatisch bewertet
    if (q.querySelector(".code-input")) return;  // KI-/Code-Aufgabe → eigenes Feld (code.js)
    if (q.querySelector(".q-cell-input")) return; // Ausfüll-Tabelle → Inline-Felder in den Zellen
    if (!q.querySelector(".q-solution")) return; // ohne Musterlösung nichts zum Abgleichen
    var body = q.querySelector(".q-body");
    if (!body || q.querySelector(".q-answer")) return;

    var num = q.querySelector(".q-num");
    var key = "fuit-answer:" + location.pathname + "#" + (num ? num.textContent.trim() : "");
    var id = "ans-" + Math.random().toString(36).slice(2, 9);

    var wrap = document.createElement("div");
    wrap.className = "q-answer";

    var label = document.createElement("label");
    label.className = "q-answer-label";
    label.setAttribute("for", id);
    label.textContent = "Deine Antwort (Selbstabgleich)";

    var ta = document.createElement("textarea");
    ta.className = "q-answer-input";
    ta.id = id;
    ta.rows = 3;
    ta.setAttribute("spellcheck", "false");
    ta.setAttribute("placeholder",
      "Hier deine Lösung notieren — danach „Lösung anzeigen“ und selbst vergleichen.");

    try { var saved = localStorage.getItem(key); if (saved) ta.value = saved; } catch (e) {}
    ta.addEventListener("input", function () {
      try { localStorage.setItem(key, ta.value); } catch (e) {}
    });

    wrap.appendChild(label);
    wrap.appendChild(ta);
    body.appendChild(wrap);
  }

  /* ----- Score chip ----- */
  function updateScore() {
    var chip = document.getElementById("scorechip");
    if (!chip) return;
    var qs = document.querySelectorAll(".q");
    var total = qs.length;
    var ok = document.querySelectorAll(".q.answered-ok").length;
    var done = document.querySelectorAll(".q.answered-ok, .q.answered-bad").length;
    var html = "Auto-Fragen: <b>" + ok + "</b>/" + done + " richtig · " + total + " gesamt";
    chip.innerHTML = html;
  }

  /* ----- Global controls ----- */
  function initControls() {
    var showAll = document.getElementById("show-all");
    var hideAll = document.getElementById("hide-all");
    if (showAll) showAll.addEventListener("click", function () {
      document.querySelectorAll(".q").forEach(function (q) { revealSolution(q, true); });
    });
    if (hideAll) hideAll.addEventListener("click", function () {
      document.querySelectorAll(".q .q-solution").forEach(function (s) {
        s.hidden = true;
        var q = s.closest(".q"); var b = q.querySelector(".q-reveal");
        if (b) { b.setAttribute("aria-expanded", "false"); b.textContent = "Lösung anzeigen"; }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".q").forEach(function (q) {
      initOptions(q);
      initReveal(q);
      initTableInputs(q);
      initAnswerField(q);
    });
    initControls();
    updateScore();
  });
})();
