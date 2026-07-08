# IT-Lernmaterial – Themen 1–21 (Fachunterricht IT)

Eigenständige Selbsttest-Website zum Fach **FUIT** über alle Themen 1–21:
Grundbegriffe, Gebäude-/Verkabelungsplan, Übertragungsmedien, Stückliste, Geräteklassen,
strukturierte Verkabelung, IT-Infrastruktur, Edge-/Fog-Computing, Server-Betriebssysteme,
Adressierung, DHCP & DNS, Übertragungsarten, Topologien, Speichersysteme, RAID,
E-Mail-Protokolle, Netzwerktechnologien, VLAN, OSI-Modell/TCP-IP, VPN und Virtualisierung.

21 Themenseiten mit insgesamt **332 Aufgaben** (auto-bewertete MC/Mehrfachauswahl,
manuelle Rechen-, Zuordnungs- und Szenarioaufgaben mit Musterlösung sowie **Freitextaufgaben
mit KI-Feedback**), **76 Inline-SVG-Diagramme**, eine **Lernseite** zum Wiederholen der
Kernkonzepte (70 Diagramme) und eine **Probe-SA** (Prüfungssimulation mit 34 Auswahlfragen,
6 offenen Aufgaben und 90 Minuten Zeit). Statisch, ohne externe Abhängigkeiten.

**Live:** [testspeda.github.io/Website_Learn_IT_Network](https://testspeda.github.io/Website_Learn_IT_Network/)

## Bedienung

- **Öffnen:** `index.html` im Browser öffnen (oder den Live-Link aufrufen). Die Auswahl im Menü
  bzw. die Sterntopologie auf der Startseite führt zur jeweiligen Themenseite.
- **Aufgaben:** Multiple-Choice wird beim Anklicken sofort bewertet; bei Mehrfachauswahl erst alle
  Antworten wählen, dann „Auswerten". Rechen-/Zuordnungs-/Freitextaufgaben selbst lösen und die
  Musterlösung mit „Lösung anzeigen" aufdecken. Der Zähler oben zählt die auswertbaren Fragen.
- **Freitextaufgaben mit KI-Feedback:** Antwort ins Feld schreiben, „KI-Bewertungs-Prompt kopieren"
  und den Prompt samt eigener Antwort von einer KI nach den genannten Kriterien bewerten lassen.
  Das Feedback dient der Selbstkontrolle; Punkte gibt es dafür nur in der Probe-SA.
- **Probe-SA:** Prüfungssimulation über alle Themen mit Countdown (90 min). „Test starten" blendet
  die Aufgaben ein und startet die Zeit; wer ohne Zeitdruck üben will, aktiviert vor dem Start
  „Ohne Zeitlimit üben" oder verlängert laufend per „+10 min". Beim Abgeben wird der Auswahlteil
  automatisch bewertet; den offenen Teil per KI-Prompt bewerten lassen und die Punkte eintragen –
  Gesamtpunkte und Note (IHK-Schlüssel) werden berechnet und im Verlauf gespeichert.
- **Fortschritt:** Beantwortete MC-Fragen, Freitexteingaben und Prüfungsergebnisse werden im Browser
  (localStorage) gespeichert und beim erneuten Öffnen wiederhergestellt. Die Startseite zeigt je
  Thema den Bearbeitungsstand; „Antworten zurücksetzen" auf einer Themenseite löscht deren Stand.
- **Drucken/PDF:** Über die Druckfunktion des Browsers; Bedienelemente werden ausgeblendet und alle
  Lösungen aufgedeckt.

## Selbsttests (für Änderungen)

Ohne Abhängigkeiten, direkt mit Node im Website-Ordner ausführen:

```
node assets/content.test.js    # Verdrahtung, Navigation, Zähler, Aufgabenstruktur
node assets/pruefung.test.js   # Punkteverrechnung und Notenschlüssel der Probe-SA
```

Die Zähler-Prüfungen gleichen die Pills der Startseite und die Themenkarten-Metadaten mit den
echten Aufgaben-/Diagrammzahlen der Seiten ab – nach dem Ergänzen von Aufgaben oder Themen
schlagen sie fehl, bis die Zahlen aktualisiert sind.
