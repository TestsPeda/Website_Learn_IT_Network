/* Play/Pause für die OSI-Kapselungs-Animation (Seite 19).
   Respektiert prefers-reduced-motion: bei reduzierter Bewegung ist die
   Animation per CSS ohnehin aus — der Button wird dann deaktiviert. */
(function () {
  "use strict";
  var btn = document.getElementById("osi-anim-toggle");
  var paket = document.querySelector(".osi-paket");
  var fig = document.getElementById("osi-fluss-figur");
  if (!btn || !paket || !fig) return;

  function setPaused(paused) {
    fig.classList.toggle("osi-anim-paused", paused);
    btn.setAttribute("aria-pressed", paused ? "false" : "true");
    btn.textContent = paused ? "Animation abspielen" : "Animation anhalten";
  }
  function applyPref(reduced) {
    setPaused(reduced);
    btn.disabled = reduced;
    btn.title = reduced ? "Deaktiviert, weil das System reduzierte Bewegung wünscht" : "";
  }

  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  applyPref(mq.matches);
  if (mq.addEventListener) mq.addEventListener("change", function (e) { applyPref(e.matches); });

  btn.addEventListener("click", function () {
    setPaused(!fig.classList.contains("osi-anim-paused"));
  });
})();
