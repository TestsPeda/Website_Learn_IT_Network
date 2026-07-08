/* Anker-Korrektur für die Lernseite.
   Die Abschnitte nutzen content-visibility: auto (Task: schnelles Erstrendern).
   Beim Sprung zu einem Anker können darüberliegende, noch nicht gerenderte
   Abschnitte ihre Höhe ändern — das Ziel „wandert". Nach jedem Hash-Sprung
   wird das Ziel daher nach dem Layout-Settling exakt angefahren
   (scroll-padding-top aus style.css wird von scrollIntoView berücksichtigt). */
(function () {
  "use strict";
  function alignToHash() {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var tries = 0;
    (function align() {
      el.scrollIntoView({ block: "start", behavior: "instant" });
      requestAnimationFrame(function () {
        var top = el.getBoundingClientRect().top;
        // 84px = scroll-padding-top (sticky Topbar); kleiner Toleranzbereich
        if (Math.abs(top - 84) > 6 && ++tries < 20) align();
      });
    })();
  }
  window.addEventListener("hashchange", function () { setTimeout(alignToHash, 60); });
  if (document.readyState === "complete") alignToHash();
  else window.addEventListener("load", function () { setTimeout(alignToHash, 50); });
})();
