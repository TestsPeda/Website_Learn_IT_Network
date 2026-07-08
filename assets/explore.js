/* IT-Lernmaterial — Startseiten-Explorer.
   Schaltet die Startseite zwischen mehreren Ansichten um: der klassischen
   Sterntopologie-Navigation und fünf Mini-Spielen, über die man die 21 Themen
   "erjagen" statt nur anklicken kann. Reines Vanilla-JS, ohne Abhängigkeiten,
   passend zum Rest der Seite (vgl. assets/quiz.js). */
(function () {
  "use strict";

  var root = document.querySelector(".explore");
  if (!root) return;

  /* ---- Themen-Datenbasis (deckt sich mit der Sterntopologie + Themenliste) ---- */
  var TOPICS = [
    { n: 1,  qTotal: 11, name: "Grundbegriffe",             href: "1-grundbegriffe.html",             hint: "Device/Host/Peripherie, aktive & passive Komponenten, Router, Switch, Hauptverteiler", kw: "vokabular device host peripherie aktiv passiv router switch hauptverteiler komponente" },
    { n: 2,  qTotal: 11, name: "Verkabelungsplan",          href: "2-verkabelungsplan.html",          hint: "Gebäude- & Verkabelungsplan, Symbole, Kanäle, Lasten- vs. Pflichtenheft", kw: "gebäude verkabelungsplan symbol kanal lastenheft pflichtenheft was wie" },
    { n: 3,  qTotal: 11, name: "Übertragungsmedien",        href: "3-uebertragungsmedien.html",       hint: "Kupfer/TP, Schirmung, Kategorien vs. Klassen, Glasfaser, Totalreflexion, Stecker", kw: "kupfer twisted pair schirmung kategorie klasse glasfaser lwl totalreflexion stecker medium" },
    { n: 4,  qTotal: 5, name: "Stückliste",                href: "4-stueckliste.html",               hint: "Aufbau & Zweck einer Stückliste (BOM), Mengen, Einzel- und Gesamtpreise", kw: "stückliste bom menge einzelpreis gesamtpreis rechnen material" },
    { n: 5,  qTotal: 9, name: "Geräteklassen",             href: "5-geraeteklassen.html",            hint: "Barebone, Notebook, Tablet, Desktop, Industrie-PC und die Zuordnung zu Rollen", kw: "barebone notebook tablet desktop industrie pc geräteklasse rolle mitarbeiter" },
    { n: 6,  qTotal: 11, name: "Strukturierte Verkabelung", href: "6-strukturierte-verkabelung.html", hint: "Sternverkabelung nach EN 50173: Primär-, Sekundär-, Tertiärebene, Maximallängen", kw: "strukturiert en50173 primär sekundär tertiär verteiler maximallänge stern ebene" },
    { n: 7,  qTotal: 14, name: "IT-Infrastruktur",          href: "7-it-infrastruktur.html",          hint: "Server, Rechenzentren (USV, Kühlung, Redundanz) und Cloud (IaaS/PaaS/SaaS)", kw: "server rechenzentrum usv kühlung redundanz cloud iaas paas saas verfügbarkeit" },
    { n: 8,  qTotal: 13, name: "Edge- & Fog-Computing",     href: "8-edgecomputing.html",             hint: "Daten am Rand des Netzes verarbeiten — geringe Latenz, IoT, Industrie 4.0", kw: "edge fog computing latenz iot industrie 4.0 netzrand knoten" },
    { n: 9,  qTotal: 12, name: "Server-Betriebssysteme",    href: "9-server-betriebssystem.html",     hint: "Aufgaben eines Server-BS, Windows Server, Linux/Unix, Lizenzen, Virtualisierung", kw: "server betriebssystem windows linux unix lizenz virtualisierung dienst" },
    { n: 10, qTotal: 13, name: "Adressierung",              href: "10-adressierung.html",             hint: "IPv4-Aufbau, Subnetzmaske & CIDR, Subnetting, Netz-/Broadcast-Adresse, IPv6", kw: "ipv4 ipv6 subnetz maske cidr subnetting broadcast adresse netz" },
    { n: 11, qTotal: 12, name: "DHCP & DNS",                href: "11-dhcp-dns.html",                 hint: "Zuweisungsarten, DORA-Ablauf, Lease-Time, DNS-Auflösung & Caching", kw: "dhcp dns dora lease auflösung caching zuweisung namen" },
    { n: 12, qTotal: 13, name: "Übertragungsarten",         href: "12-uebertragungsarten.html",       hint: "Seriell/parallel, Simplex/Halb-/Vollduplex, Multiplexing FDM·TDM·CDM·WDM", kw: "seriell parallel simplex halbduplex vollduplex multiplexing fdm tdm cdm wdm" },
    { n: 13, qTotal: 17, name: "Topologien",                href: "13-topologien.html",               hint: "Bus, Ring, Stern, Mesh — Aufbau, Vor-/Nachteile, Ausfallsicherheit", kw: "bus ring stern mesh topologie ausfallsicherheit skalierbarkeit kosten" },
    { n: 14, qTotal: 15, name: "Speichersysteme",           href: "14-speichersysteme.html",          hint: "DAS, NAS, SAN — Zugriffsebene, Datentyp, LUN, Dateisystem, Protokolle", kw: "das nas san speicher lun dateisystem protokoll zugriff block datei" },
    { n: 15, qTotal: 11, name: "RAID / Speicherablage",     href: "15-raid.html",                     hint: "RAID 0, 1, 5, 10 — Prinzip, Mindestplatten, nutzbare Kapazität, Ausfallsicherheit", kw: "raid 0 1 5 10 mirroring striping parität kapazität platten speicherablage" },
    { n: 16, qTotal: 11, name: "E-Mail-Protokolle",         href: "16-email-protokolle.html",         hint: "SMTP versendet, POP3 lädt lokal, IMAP synchronisiert — plus Ports und SSL/TLS", kw: "email smtp pop3 imap port ssl tls postfach senden empfangen" },
    { n: 17, qTotal: 15, name: "Netzwerktechnologien",      href: "17-netzwerktechnologien.html",     hint: "Ethernet-Frame & FCS, MAC-Adresse (OUI), ARP-Auflösung, MAC-Tabelle (Learning/Flooding)", kw: "ethernet frame fcs mac oui arp broadcast unicast switch learning flooding tabelle" },
    { n: 18, qTotal: 10, name: "VLAN",                      href: "18-vlan.html",                     hint: "Virtuelle LANs nach 802.1q: Access vs. Trunk, VLAN-Tag/ID, Managed Switch, Inter-VLAN-Routing", kw: "vlan 802.1q tag id access trunk managed switch inter vlan routing segmentierung broadcast domäne" },
    { n: 19, qTotal: 11, name: "OSI-Modell",                href: "19-osi-modell.html",               hint: "7 OSI-Schichten vs. TCP/IP (4 Schichten), Windows-Tools (ipconfig, ping, tracert, nslookup, arp, netstat), Troubleshooting", kw: "osi schicht modell tcp ip referenzmodell kapselung ipconfig ping tracert nslookup arp netstat troubleshooting fehlerquelle" },
    { n: 20, qTotal: 9,  name: "VPN",                      href: "20-vpn.html",                      hint: "Virtual Private Network: Tunnel & IP-Tunneling, fiktive IP; End-to-Site, Site-to-Site, End-to-End", kw: "vpn virtual private network tunnel ip-tunneling verschlüsselung remote access site-to-site end-to-end gateway openvpn firmennetz ländersperre" },
    { n: 21, qTotal: 12, name: "Virtualisierung",          href: "21-virtualisierung.html",          hint: "VM & Hypervisor (VMM), Typ 1 Bare-Metal vs. Typ 2 Hosted, Server-/Desktop-/App-Virtualisierung, VDI vs. DaaS", kw: "virtualisierung vm virtuelle maschine hypervisor vmm bare-metal hosted typ1 typ2 hyper-v virtualbox esx vdi daas desktop server applikation sandbox wirt gast" }
  ];

  /* ---- Hilfsfunktionen ---- */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  /* ---- Themen-Fortschritt ----
     quiz.js speichert beantwortete Auswahlfragen unter "fuit-mc:<pfad>#<nr>".
     Daraus wird je Thema der Bearbeitungsstand ermittelt und am Stern-Knoten
     sowie auf den Themen-Kacheln angezeigt (Zahl + Leiste, nicht nur Farbe). */
  function progressFor(t) {
    var p = { done: 0, ok: 0, total: t.qTotal || 0 };
    try {
      var prefix = "fuit-mc:" + new URL(t.href, location.href).pathname + "#";
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf(prefix) !== 0) continue;
        p.done++;
        try { if (JSON.parse(localStorage.getItem(k)).ok) p.ok++; } catch (e2) {}
      }
    } catch (e) {}
    if (p.done > p.total) p.total = p.done;
    return p;
  }
  function progressLabel(t, p) {
    return "Thema " + t.n + ": " + t.name + " — " + p.done + " von " + p.total +
      " beantwortet, " + p.ok + " richtig";
  }

  /* kompakte, anklickbare Themen-Kachel (geteilt von Suche/Memory/Schatzsuche) */
  function topicLink(t) {
    var a = document.createElement("a");
    a.className = "x-topic";
    a.href = t.href;
    var p = progressFor(t);
    a.innerHTML =
      '<span class="xt-num">' + t.n + "</span>" +
      '<span class="xt-text"><span class="xt-name">' + esc(t.name) + "</span>" +
      '<span class="xt-hint">' + esc(t.hint) + "</span></span>" +
      (p.done ? '<span class="xt-progress">' + p.done + "/" + p.total + "</span>" : "") +
      '<span class="xt-go" aria-hidden="true">→</span>';
    if (p.done) a.setAttribute("aria-label", progressLabel(t, p));
    return a;
  }

  /* Stern-Knoten (statisches SVG der Startseite) mit Leiste + Zähler versehen */
  function decorateStar() {
    var panel = root.querySelector('.explore-panel[data-mode="star"]');
    if (!panel) return;
    var NS = "http://www.w3.org/2000/svg";
    TOPICS.forEach(function (t) {
      var link = panel.querySelector('a[href="' + t.href + '"]');
      var g = link && link.querySelector("g.node");
      var box = g && g.querySelector("rect");
      if (!box) return;
      var p = progressFor(t);
      link.setAttribute("aria-label", progressLabel(t, p));
      if (!p.done || !p.total) return;   // ohne Bearbeitung bleibt der Knoten ruhig
      var x = parseFloat(box.getAttribute("x")), y = parseFloat(box.getAttribute("y"));
      var w = parseFloat(box.getAttribute("width")), h = parseFloat(box.getAttribute("height"));
      var track = document.createElementNS(NS, "rect");
      track.setAttribute("class", "node-progress");
      var fill = document.createElementNS(NS, "rect");
      fill.setAttribute("class", "node-progress-fill");
      [track, fill].forEach(function (r) {
        r.setAttribute("x", x + 6); r.setAttribute("y", y + h - 6);
        r.setAttribute("width", w - 12); r.setAttribute("height", 4);
        r.setAttribute("rx", 2);
      });
      fill.style.setProperty("--p", String(p.done / p.total));
      var num = document.createElementNS(NS, "text");
      num.setAttribute("class", "node-progress-text");
      num.setAttribute("x", x + w - 6); num.setAttribute("y", y + 14);
      num.setAttribute("text-anchor", "end");
      num.textContent = p.done + "/" + p.total;
      g.appendChild(track); g.appendChild(fill); g.appendChild(num);
    });
  }
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================================
     Tab-/Toggle-Steuerung
     ===================================================================== */
  var tabs = Array.prototype.slice.call(root.querySelectorAll(".seg-btn"));
  var panels = {};
  Array.prototype.slice.call(root.querySelectorAll(".explore-panel")).forEach(function (p) {
    panels[p.getAttribute("data-mode")] = p;
  });
  var built = {};  // Spiele werden faul beim ersten Öffnen aufgebaut
  var LEAVE = {};  // optionale Aufräum-/Pause-Hooks je Modus (z. B. Snake pausieren)
  var current = null;

  function activate(mode, focusTab) {
    if (current && current !== mode && LEAVE[current]) LEAVE[current]();
    tabs.forEach(function (b) {
      var on = b.getAttribute("data-mode") === mode;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.setAttribute("tabindex", on ? "0" : "-1");
      if (on && focusTab) b.focus();
    });
    Object.keys(panels).forEach(function (k) { panels[k].hidden = (k !== mode); });
    if (!built[mode] && BUILD[mode]) { BUILD[mode](panels[mode]); built[mode] = true; }
    current = mode;
    try { localStorage.setItem("explore-mode", mode); } catch (e) {}
  }

  tabs.forEach(function (b, idx) {
    b.addEventListener("click", function () { activate(b.getAttribute("data-mode")); });
    b.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = (idx + dir + tabs.length) % tabs.length;
      activate(tabs[next].getAttribute("data-mode"), true);
    });
  });

  /* =====================================================================
     Spiel 2 · Schnellsuche — Tippen filtert die Themen (schnelles Navigieren)
     ===================================================================== */
  function buildSearch(panel) {
    panel.innerHTML =
      '<div class="game-card">' +
        '<p class="game-tip">Tippe ein Stichwort, eine Nummer oder einen Themennamen — die Liste filtert sofort. <kbd>Enter</kbd> öffnet den ersten Treffer.</p>' +
        '<div class="xs-bar"><input class="xs-input" id="xs-input" name="themensuche" type="search" inputmode="search" ' +
          'placeholder="z. B. „raid", „subnetz", „13" …" aria-label="Themen durchsuchen" autocomplete="off"></div>' +
        '<div class="xs-results x-topic-list" aria-live="polite"></div>' +
      "</div>";
    var input = panel.querySelector(".xs-input");
    var out = panel.querySelector(".xs-results");

    function render(q) {
      q = (q || "").trim().toLowerCase();
      out.innerHTML = "";
      var hits = TOPICS.filter(function (t) {
        if (!q) return true;
        return (t.name.toLowerCase().indexOf(q) >= 0) ||
               (t.hint.toLowerCase().indexOf(q) >= 0) ||
               (t.kw.indexOf(q) >= 0) ||
               (String(t.n) === q);
      });
      if (!hits.length) {
        out.appendChild(el("p", "game-empty", "Kein Thema gefunden — versuch ein anderes Stichwort."));
        return;
      }
      hits.forEach(function (t) { out.appendChild(topicLink(t)); });
    }
    input.addEventListener("input", function () { render(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = out.querySelector(".x-topic");
        if (first) window.location.href = first.getAttribute("href");
      }
    });
    render("");
  }

  /* =====================================================================
     Spiel 3 · Memory — Nummer und Themenname paaren; Paar = freigeschaltetes Thema
     ===================================================================== */
  function buildMemory(panel) {
    panel.innerHTML =
      '<div class="game-card">' +
        '<div class="game-bar">' +
          '<p class="game-tip">Finde die Paare aus <b>Nummer</b> und <b>Thema</b>. Jedes gelöste Paar wird zum anklickbaren Link.</p>' +
          '<div class="game-stat"><span class="gs-pair">0</span>/' + TOPICS.length + ' Paare · <span class="gs-moves">0</span> Züge ' +
            '<button class="btn game-reset" type="button">Neu mischen</button></div>' +
        "</div>" +
        '<div class="mem-grid" aria-label="Memory-Feld"></div>' +
        '<div class="game-win" hidden></div>' +
      "</div>";
    var grid = panel.querySelector(".mem-grid");
    var pairEl = panel.querySelector(".gs-pair");
    var moveEl = panel.querySelector(".gs-moves");
    var win = panel.querySelector(".game-win");
    panel.querySelector(".game-reset").addEventListener("click", start);

    var first = null, lock = false, pairs = 0, moves = 0;

    function start() {
      grid.innerHTML = ""; win.hidden = true; first = null; lock = false;
      pairs = 0; moves = 0; pairEl.textContent = "0"; moveEl.textContent = "0";
      var deck = [];
      TOPICS.forEach(function (t) {
        deck.push({ id: t.n, face: "num", t: t });
        deck.push({ id: t.n, face: "name", t: t });
      });
      shuffle(deck).forEach(function (card) {
        var btn = el("button", "mem-card");
        btn.type = "button";
        btn.setAttribute("aria-label", "Verdeckte Karte");
        btn.dataset.id = card.id;
        btn.dataset.face = card.face;
        btn._card = card;
        btn.innerHTML = '<span class="mem-back">?</span><span class="mem-front"></span>';
        btn.addEventListener("click", function () { flip(btn); });
        grid.appendChild(btn);
      });
    }

    function faceHTML(card) {
      return card.face === "num"
        ? '<span class="mem-num">' + card.t.n + "</span>"
        : '<span class="mem-name">' + esc(card.t.name) + "</span>";
    }
    function flip(btn) {
      if (lock || btn.classList.contains("revealed") || btn.classList.contains("matched")) return;
      btn.querySelector(".mem-front").innerHTML = faceHTML(btn._card);
      btn.classList.add("revealed");
      if (!first) { first = btn; return; }
      moves++; moveEl.textContent = moves;
      if (first.dataset.id === btn.dataset.id && first !== btn) {
        match(first, btn); first = null;
      } else {
        lock = true;
        var a = first, b = btn; first = null;
        setTimeout(function () {
          a.classList.remove("revealed"); b.classList.remove("revealed");
          a.querySelector(".mem-front").innerHTML = "";
          b.querySelector(".mem-front").innerHTML = "";
          lock = false;
        }, reduceMotion ? 250 : 750);
      }
    }
    function match(a, b) {
      [a, b].forEach(function (btn) {
        btn.classList.add("matched");
        btn.classList.remove("revealed");
        var t = btn._card.t;
        var link = el("a", "mem-link", faceHTML(btn._card));
        link.href = t.href;
        link.title = "Thema " + t.n + ": " + t.name + " öffnen";
        btn.replaceWith(link);
      });
      pairs++; pairEl.textContent = pairs;
      if (pairs === TOPICS.length) {
        win.hidden = false;
        win.innerHTML = "🎉 Alle " + TOPICS.length + " Paare in <b>" + moves + "</b> Zügen! Klick ein Paar an, um direkt zum Thema zu springen.";
      }
    }
    start();
  }

  /* =====================================================================
     Spiel 4 · Quiz-Tor — Thema anhand seiner Beschreibung erkennen, dann freischalten
     ===================================================================== */
  function buildQuiz(panel) {
    panel.innerHTML =
      '<div class="game-card">' +
        '<div class="game-bar">' +
          '<p class="game-tip">Welches Thema steckt hinter der Beschreibung? Richtig getippt = Thema freigeschaltet.</p>' +
          '<div class="game-stat"><span class="gs-unlock">0</span>/' + TOPICS.length + ' frei · <span class="gs-tries">0</span> Versuche</div>' +
        "</div>" +
        '<div class="quiz-stage"></div>' +
        '<div class="quiz-unlocked x-topic-list" aria-label="Freigeschaltete Themen"></div>' +
      "</div>";
    var stage = panel.querySelector(".quiz-stage");
    var unlockedBox = panel.querySelector(".quiz-unlocked");
    var unlockEl = panel.querySelector(".gs-unlock");
    var triesEl = panel.querySelector(".gs-tries");

    var queue = shuffle(TOPICS);
    var pos = 0, unlocked = 0, tries = 0;

    function nextQuestion() {
      if (pos >= queue.length) {
        stage.innerHTML = '<div class="game-win" style="position:static;margin:0;">🏁 Alle ' + TOPICS.length + ' Themen erkannt! Unten geht es direkt weiter.</div>';
        return;
      }
      var correct = queue[pos];
      var distractors = shuffle(TOPICS.filter(function (t) { return t.n !== correct.n; })).slice(0, 3);
      var options = shuffle(distractors.concat(correct));
      var html = '<p class="quiz-q"><span class="quiz-ix">' + (pos + 1) + "/" + TOPICS.length + "</span> " +
        esc(correct.hint) + "</p><div class='quiz-opts'>";
      options.forEach(function (o) {
        html += '<button class="quiz-opt" type="button" data-n="' + o.n + '">' +
          '<span class="qo-num">' + o.n + "</span> " + esc(o.name) + "</button>";
      });
      html += "</div>";
      stage.innerHTML = html;
      Array.prototype.slice.call(stage.querySelectorAll(".quiz-opt")).forEach(function (btn) {
        btn.addEventListener("click", function () { answer(btn, correct); });
      });
    }
    function answer(btn, correct) {
      if (btn.disabled || stage.querySelector(".quiz-opt.right")) return;
      tries++; triesEl.textContent = tries;
      if (parseInt(btn.dataset.n, 10) === correct.n) {
        btn.classList.add("right");
        Array.prototype.slice.call(stage.querySelectorAll(".quiz-opt")).forEach(function (b) { b.disabled = true; });
        unlocked++; unlockEl.textContent = unlocked;
        unlockedBox.appendChild(topicLink(correct));
        pos++;
        setTimeout(nextQuestion, reduceMotion ? 300 : 650);
      } else {
        btn.classList.add("wrong"); btn.disabled = true;
      }
    }
    nextQuestion();
  }

  /* =====================================================================
     Spiel 5 · Schatzsuche — die 21 Themen in einem Raster aus Störsignalen aufspüren
     ===================================================================== */
  function buildHunt(panel) {
    var DECOYS = ["Störsignal", "Rauschen", "Leeres Feld", "Kollision", "Timeout", "Paketverlust", "CRC-Fehler", "Echo", "Jitter", "Broadcast-Sturm", "Latenz"];
    panel.innerHTML =
      '<div class="game-card">' +
        '<div class="game-bar">' +
          '<p class="game-tip">Hinter den Feldern verstecken sich die ' + TOPICS.length + ' Themen — dazwischen nur Störsignale. Deck sie auf und jage alle Themen!</p>' +
          '<div class="game-stat"><span class="gs-found">0</span>/' + TOPICS.length + ' gefunden · <span class="gs-clicks">0</span> Aufdeckungen ' +
            '<button class="btn game-reset" type="button">Neues Feld</button></div>' +
        "</div>" +
        '<div class="hunt-grid" aria-label="Schatzsuche-Feld"></div>' +
        '<div class="game-win" hidden></div>' +
      "</div>";
    var grid = panel.querySelector(".hunt-grid");
    var foundEl = panel.querySelector(".gs-found");
    var clickEl = panel.querySelector(".gs-clicks");
    var win = panel.querySelector(".game-win");
    panel.querySelector(".game-reset").addEventListener("click", start);
    var found = 0, clicks = 0;

    function start() {
      grid.innerHTML = ""; win.hidden = true; found = 0; clicks = 0;
      foundEl.textContent = "0"; clickEl.textContent = "0";
      var cells = TOPICS.map(function (t) { return { topic: t }; });
      DECOYS.forEach(function (d) { cells.push({ decoy: d }); });
      shuffle(cells).forEach(function (c) {
        var btn = el("button", "hunt-cell");
        btn.type = "button";
        btn.setAttribute("aria-label", "Verdecktes Feld");
        btn.innerHTML = '<span class="hunt-mark">▦</span>';
        btn._c = c;
        btn.addEventListener("click", function () { dig(btn); });
        grid.appendChild(btn);
      });
    }
    function dig(btn) {
      if (btn.classList.contains("done")) return;
      clicks++; clickEl.textContent = clicks;
      btn.classList.add("done");
      var c = btn._c;
      if (c.topic) {
        btn.classList.add("hit");
        var t = c.topic;
        var link = el("a", "hunt-found");
        link.href = t.href;
        link.title = "Thema " + t.n + " öffnen";
        link.innerHTML = '<span class="hf-num">' + t.n + '</span><span class="hf-name">' + esc(t.name) + "</span>";
        btn.replaceWith(link);
        found++; foundEl.textContent = found;
        if (found === TOPICS.length) {
          win.hidden = false;
          win.innerHTML = "🏆 Alle " + TOPICS.length + " Themen aufgespürt mit <b>" + clicks + "</b> Aufdeckungen! Klick ein Thema an.";
        }
      } else {
        btn.classList.add("miss");
        btn.innerHTML = '<span class="hunt-decoy">' + esc(c.decoy) + "</span>";
        btn.disabled = true;
      }
    }
    start();
  }

  /* =====================================================================
     Spiel 6 · Glücksrad — den Zufall ein Thema wählen lassen
     ===================================================================== */
  function buildWheel(panel) {
    var R = 150, C = 160, SEG = 360 / TOPICS.length;
    var colors = ["#DD5430", "#15786E"];
    var segs = "";
    var labels = "";
    TOPICS.forEach(function (t, i) {
      var a0 = (i * SEG - 90) * Math.PI / 180;
      var a1 = ((i + 1) * SEG - 90) * Math.PI / 180;
      var x0 = C + R * Math.cos(a0), y0 = C + R * Math.sin(a0);
      var x1 = C + R * Math.cos(a1), y1 = C + R * Math.sin(a1);
      segs += '<path d="M' + C + ' ' + C + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
        ' A' + R + ' ' + R + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z" ' +
        'fill="' + colors[i % 2] + '" stroke="#fff" stroke-width="1.5"></path>';
      var am = (i * SEG + SEG / 2 - 90) * Math.PI / 180;
      var lr = R * 0.66;
      var lx = C + lr * Math.cos(am), ly = C + lr * Math.sin(am);
      labels += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" fill="#fff" ' +
        'font-family="IBM Plex Mono, monospace" font-size="15" font-weight="700" ' +
        'text-anchor="middle" dominant-baseline="central" ' +
        'transform="rotate(' + (i * SEG + SEG / 2).toFixed(1) + ' ' + lx.toFixed(1) + ' ' + ly.toFixed(1) + ')">' + t.n + "</text>";
    });

    panel.innerHTML =
      '<div class="game-card wheel-card">' +
        '<p class="game-tip">Keine Lust zu wählen? Lass das Glücksrad ein Thema bestimmen und leg direkt los.</p>' +
        '<div class="wheel-wrap">' +
          '<div class="wheel-pointer" aria-hidden="true">▼</div>' +
          '<svg class="wheel-svg" viewBox="0 0 320 320" role="img" aria-label="Glücksrad mit den ' + TOPICS.length + ' Themen">' +
            '<g class="wheel-rot">' + segs + labels + "</g>" +
            '<circle cx="160" cy="160" r="26" fill="#16242E"></circle>' +
            '<text x="160" y="160" fill="#fff" font-family="IBM Plex Mono, monospace" font-size="11" text-anchor="middle" dominant-baseline="central">DREH</text>' +
          "</svg>" +
        "</div>" +
        '<div class="wheel-ctrl">' +
          '<button class="btn primary wheel-spin" type="button">Glücksrad drehen</button>' +
          '<div class="wheel-result" aria-live="polite"></div>' +
        "</div>" +
      "</div>";

    var rot = panel.querySelector(".wheel-rot");
    var btn = panel.querySelector(".wheel-spin");
    var res = panel.querySelector(".wheel-result");
    var angle = 0, spinning = false;
    if (!reduceMotion) rot.style.transition = "transform 4s cubic-bezier(.17,.67,.12,1)";

    function spin() {
      if (spinning) return;
      spinning = true; btn.disabled = true; res.innerHTML = "";
      var i = Math.floor(Math.random() * TOPICS.length);
      var target = TOPICS[i];
      // Zielsegment-Mitte unter den oberen Zeiger drehen (+ einige volle Umdrehungen)
      var center = i * SEG + SEG / 2;
      var base = ((angle % 360) + 360) % 360;
      angle += (360 * 5) + ((360 - center) - base % 360);
      var fallback = null;
      function done() {
        if (fallback !== null) { clearTimeout(fallback); fallback = null; }
        rot.removeEventListener("transitionend", done);
        rot.removeEventListener("transitioncancel", done);
        spinning = false; btn.disabled = false;
        res.innerHTML = '<span class="wr-label">Dein Thema</span>';
        res.appendChild(topicLink(target));
      }
      if (reduceMotion) { rot.style.transform = "rotate(" + angle + "deg)"; done(); }
      else {
        // transitioncancel + Timeout: ein Ansichtswechsel mitten im Dreh
        // (display:none bricht die Transition ab) darf das Rad nicht sperren.
        rot.addEventListener("transitionend", done);
        rot.addEventListener("transitioncancel", done);
        fallback = setTimeout(done, 4600);
        requestAnimationFrame(function () { rot.style.transform = "rotate(" + angle + "deg)"; });
      }
    }
    btn.addEventListener("click", spin);
  }

  /* =====================================================================
     Spiel 7 · Snake — Datenpaket durchs Netz steuern; jeder Punkt schaltet
     ein Thema frei. Steuerung per Pfeiltasten oder WASD. Der Spielhintergrund
     erwärmt sich dynamisch von Teal zu Orange, je mehr Themen frei sind, und
     das Gitter wird mit steigendem Level heller.
     ===================================================================== */
  function buildSnake(panel) {
    var N = 18, CELL = 20, SIZE = N * CELL;      // 18×18-Raster, 360px logisch
    var TEAL = [21, 120, 110], ORANGE = [221, 84, 48];

    panel.innerHTML =
      '<div class="game-card snake-card">' +
        '<p class="game-tip">Du bist ein Datenpaket — sammle Knoten ein. <b>Jeder Punkt schaltet ein Thema frei.</b> ' +
          'Steuerung: <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> oder <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>.</p>' +
        '<div class="snake-layout">' +
          '<div class="snake-left">' +
            '<div class="snake-hud">' +
              '<span>Score <b class="sn-score">0</b></span>' +
              '<span>Level <b class="sn-level">1</b></span>' +
              '<span>Frei <b class="sn-unlocked">0</b>/' + TOPICS.length + '</span>' +
              '<span>Best <b class="sn-best">0</b></span>' +
            '</div>' +
            '<div class="snake-board">' +
              '<canvas class="snake-canvas" width="' + (SIZE) + '" height="' + (SIZE) + '" aria-label="Snake-Spielfeld"></canvas>' +
              '<div class="snake-overlay"><h4 class="sn-msg">Snake</h4><p class="sn-sub">Pfeiltasten / WASD oder „Start" — los geht’s.</p>' +
                '<button class="btn primary sn-start" type="button">Start</button></div>' +
            '</div>' +
            '<div class="snake-controls">' +
              '<div class="snake-dpad" aria-hidden="false">' +
                '<button class="sn-d" data-dir="up"    type="button" aria-label="Hoch">↑</button>' +
                '<button class="sn-d" data-dir="left"  type="button" aria-label="Links">←</button>' +
                '<button class="sn-d" data-dir="down"  type="button" aria-label="Runter">↓</button>' +
                '<button class="sn-d" data-dir="right" type="button" aria-label="Rechts">→</button>' +
              '</div>' +
              '<button class="btn sn-reset" type="button">Neues Spiel</button>' +
            '</div>' +
          '</div>' +
          '<div class="snake-right">' +
            '<p class="snake-unlock-label">Freigeschaltete Themen</p>' +
            '<div class="snake-unlocks"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var canvas = panel.querySelector(".snake-canvas");
    var ctx = canvas.getContext("2d");
    var board = panel.querySelector(".snake-board");
    var overlay = panel.querySelector(".snake-overlay");
    var msgEl = panel.querySelector(".sn-msg");
    var subEl = panel.querySelector(".sn-sub");
    var startBtn = panel.querySelector(".sn-start");
    var scoreEl = panel.querySelector(".sn-score");
    var levelEl = panel.querySelector(".sn-level");
    var unlockedEl = panel.querySelector(".sn-unlocked");
    var bestEl = panel.querySelector(".sn-best");
    var unlocksBox = panel.querySelector(".snake-unlocks");

    // hochauflösend zeichnen
    var dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = SIZE * dpr; canvas.height = SIZE * dpr;
    canvas.style.width = SIZE + "px"; canvas.style.height = SIZE + "px";
    ctx.scale(dpr, dpr);

    var snake, dir, nextDir, food, score, level, state, loopId;
    // Ergebnisse (freigeschaltete Themen & Bestpunktzahl) werden bewusst NICHT
    // persistiert – bei jedem Besuch muss man sich die Themen neu erspielen.
    var unlocked = 0, best = 0;

    function lerpColor(a, b, t) {
      return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," +
                      Math.round(a[1] + (b[1] - a[1]) * t) + "," +
                      Math.round(a[2] + (b[2] - a[2]) * t) + ")";
    }
    function updateBackground() {
      var f = unlocked / TOPICS.length;                 // 0 … 1 (Fortschritt)
      var glow = lerpColor(TEAL, ORANGE, f);
      var intensity = 0.18 + f * 0.34;
      board.style.background =
        "radial-gradient(120% 130% at 50% 0%, " + glow.replace("rgb", "rgba").replace(")", "," + intensity.toFixed(2) + ")") +
        " 0%, #16242E 62%)";
    }

    function renderUnlocks() {
      unlocksBox.innerHTML = "";
      TOPICS.forEach(function (t, i) {
        if (i < unlocked) {
          var a = document.createElement("a");
          a.className = "snake-chip unlocked";
          a.href = t.href;
          a.title = "Thema " + t.n + ": " + t.name;
          a.innerHTML = '<span class="sc-num">' + t.n + "</span> " + esc(t.name);
          unlocksBox.appendChild(a);
        } else {
          var s = el("span", "snake-chip locked", '<span class="sc-num">' + t.n + "</span> 🔒");
          s.title = "Noch gesperrt — sammle Punkte!";
          unlocksBox.appendChild(s);
        }
      });
    }
    function unlockNext() {
      if (unlocked < TOPICS.length) {
        unlocked++;
        renderUnlocks();
      }
      unlockedEl.textContent = unlocked;
      updateBackground();
    }

    function emptyCell() {
      var c, tries = 0;
      do {
        c = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        tries++;
      } while (tries < 400 && snake.some(function (s) { return s.x === c.x && s.y === c.y; }));
      return c;
    }
    function reset() {
      stop();
      snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
      dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
      score = 0; level = 1; state = "idle";
      food = emptyCell();
      scoreEl.textContent = "0"; levelEl.textContent = "1";
      bestEl.textContent = best;
      showOverlay("Snake", "Pfeiltasten / WASD oder „Start“ — los geht’s.", "Start");
      draw();
    }
    function delay() { return Math.max(70, 150 - (level - 1) * 9); }

    function start() {
      if (state === "running") return;
      if (state === "over") reset();
      state = "running";
      hideOverlay();
      schedule();
    }
    function schedule() {
      stop();
      loopId = setTimeout(tick, delay());
    }
    function stop() { if (loopId) { clearTimeout(loopId); loopId = null; } }
    function pause() {
      if (state !== "running") return;
      state = "paused"; stop();
      showOverlay("Pausiert", "Richtungstaste oder âWeiter“ zum Fortsetzen.", "Weiter");
    }

    function tick() {
      dir = nextDir;
      var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N) return gameOver();
      for (var i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return gameOver();
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++; scoreEl.textContent = score;
        level = 1 + Math.floor(score / 4); levelEl.textContent = level;
        if (score > best) { best = score; bestEl.textContent = best; }
        unlockNext();
        food = emptyCell();
      } else {
        snake.pop();
      }
      draw();
      schedule();
    }
    function gameOver() {
      state = "over"; stop();
      var done = unlocked >= TOPICS.length;
      showOverlay("Game Over · Score " + score,
        done ? "Alle " + TOPICS.length + " Themen frei! Rechts geht es direkt weiter." : "Sammle weiter, um Themen freizuschalten.",
        "Nochmal");
    }

    function showOverlay(title, sub, btn) {
      msgEl.textContent = title; subEl.textContent = sub;
      startBtn.textContent = btn; overlay.hidden = false;
    }
    function hideOverlay() { overlay.hidden = true; }

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      // Netz-Gitter, heller mit steigendem Level
      ctx.strokeStyle = "rgba(255,255,255," + Math.min(0.20, 0.05 + level * 0.012).toFixed(3) + ")";
      ctx.lineWidth = 1;
      for (var g = 1; g < N; g++) {
        ctx.beginPath(); ctx.moveTo(g * CELL + .5, 0); ctx.lineTo(g * CELL + .5, SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, g * CELL + .5); ctx.lineTo(SIZE, g * CELL + .5); ctx.stroke();
      }
      // Futter = Knoten
      var fx = food.x * CELL, fy = food.y * CELL;
      ctx.fillStyle = "#DD5430";
      roundRect(fx + 4, fy + 4, CELL - 8, CELL - 8, 4); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.85)";
      roundRect(fx + CELL / 2 - 2, fy + CELL / 2 - 2, 4, 4, 1); ctx.fill();
      // Schlange
      for (var s = snake.length - 1; s >= 0; s--) {
        var seg = snake[s];
        ctx.fillStyle = s === 0 ? "#1FA093" : "#15786E";
        roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 5); ctx.fill();
        if (s === 0) {
          ctx.fillStyle = "#fff";
          roundRect(seg.x * CELL + 6, seg.y * CELL + 6, 3, 3, 1); ctx.fill();
          roundRect(seg.x * CELL + CELL - 9, seg.y * CELL + 6, 3, 3, 1); ctx.fill();
        }
      }
    }
    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function setDir(nx, ny) {
      // 180°-Wende verhindern
      if (snake.length > 1 && nx === -dir.x && ny === -dir.y) return;
      nextDir = { x: nx, y: ny };
    }
    var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    function handleDir(d) {
      if (state === "over") return;
      if (state === "idle" || state === "paused") start();
      setDir(d[0], d[1]);
    }

    // Tastatur (nur wenn dieses Panel sichtbar ist)
    function onKey(e) {
      if (panel.hidden) return;
      var k = e.key.toLowerCase();
      var map = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right" };
      if (map[k]) { e.preventDefault(); handleDir(DIRS[map[k]]); }
      else if (k === " " || k === "enter") { e.preventDefault(); if (state === "running") pause(); else start(); }
    }
    document.addEventListener("keydown", onKey);

    // Touch-Steuerkreuz + Wisch-Gesten
    Array.prototype.slice.call(panel.querySelectorAll(".sn-d")).forEach(function (b) {
      b.addEventListener("click", function () { handleDir(DIRS[b.getAttribute("data-dir")]); });
    });
    var tsx = 0, tsy = 0;
    canvas.addEventListener("touchstart", function (e) { var t = e.touches[0]; tsx = t.clientX; tsy = t.clientY; }, { passive: true });
    canvas.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0], dx = t.clientX - tsx, dy = t.clientY - tsy;
      if (Math.abs(dx) < 16 && Math.abs(dy) < 16) return;
      if (Math.abs(dx) > Math.abs(dy)) handleDir(dx > 0 ? DIRS.right : DIRS.left);
      else handleDir(dy > 0 ? DIRS.down : DIRS.up);
    }, { passive: true });

    startBtn.addEventListener("click", function () { if (state === "running") pause(); else start(); });
    panel.querySelector(".sn-reset").addEventListener("click", reset);

    // Beim Verlassen des Tabs pausieren (kein Hintergrundlauf)
    LEAVE.snake = function () { if (state === "running") pause(); };

    // Test-Schnittstelle (kein UI; erlaubt deterministische Verifikation)
    panel._snake = {
      getState: function () { return { score: score, unlocked: unlocked, state: state, head: snake[0], food: { x: food.x, y: food.y }, dir: { x: dir.x, y: dir.y } }; },
      start: start,
      foodAhead: function () { food = { x: snake[0].x + nextDir.x, y: snake[0].y + nextDir.y }; }
    };

    renderUnlocks();
    unlockedEl.textContent = unlocked;
    updateBackground();
    reset();
  }

  /* ---- Registry & Start ---- */
  var BUILD = {
    search: buildSearch,
    memory: buildMemory,
    quiz: buildQuiz,
    hunt: buildHunt,
    wheel: buildWheel,
    snake: buildSnake
  };

  var initial = "star";
  try {
    var saved = localStorage.getItem("explore-mode");
    if (saved && (saved === "star" || BUILD[saved])) initial = saved;
  } catch (e) {}
  decorateStar();
  activate(initial);
})();
