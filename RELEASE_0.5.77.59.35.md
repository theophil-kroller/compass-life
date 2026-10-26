# Compass 0.5.77.59.35 – V-Taper Trainingszyklen & Family Radar

Basis: GitHub Actions #269 (Commit `9691d5c614343a2cb64cb785aadbd986ab1aac5d`, erfolgreicher Build).

## Neuerungen

- Family Radar: Nathanaels (und ausdrücklich aktivierter Kinder) Schularbeiten erscheinen bis 14 Tage vorher in „Heute“ auch dann **informativ**, wenn Lernunterstützung für das Schulfach deaktiviert ist. Beispiel: Englisch-Schularbeit nächste Woche. Höchstens zwei Hinweise. Keine neuen Aufgaben ohne Zustimmung, keine Google-Kalender-Schreibzugriffe, keine zusätzlichen API-Abfragen in „Heute“.
- V-Taper Coach: Optionaler Sechs-Wochen-Trainingsblock mit sichtbarer Blockwoche und manueller Verlängerung/Neustart; nach Woche 6 Hinweis zur Überprüfung statt automatischer Entlastung.
- Deload: Nur explizit vom Nutzer aktivierbar. Während der 7-tägigen Entlastung werden die geplanten V-Taper-Sätze vorsichtig etwa halbiert; **keine automatische Gewichtsänderung**.
- Recovery-Hinweis: Entlastungsempfehlung nur bei mehrfach sehr schweren bestätigten Sätzen (RIR 0) **zusammen mit** ungünstigen persönlichen Schlaf- und HRV-Trends, nicht bei einer einzelnen schlechten Nacht.
- Muskelkarte/Coach: Getrennte **belegte** Wochen-Satzzahlen für seitliche und hintere Schulter. Nicht zugeordnete Garmin-Übungen bleiben unbekannt.
- Desktop/Handy: Buildnummer 0.5.77.59.35; Fokus-Modus unverändert und keine GPS-Abfrage.

## Standort-Kontext – geplant, nicht aktiviert

Eine optionale Standortfunktion für „Zuhause / Arbeit / unterwegs“ wäre über die Geolocation API möglich, nur nach expliziter Gerätefreigabe. Keine Standortabfrage beim Laden der Heute-Ansicht, keine Hintergrund-Ortung oder Cloud-Übertragung vorgesehen. Die Definition der lokalen Ortszonen und eine manuelle Kontextübersteuerung werden in einem eigenen Build umgesetzt.

## Prüfung

- `npm run check`: 1454 / 1454 Tests erfolgreich, inklusive 9 neuer Tests.
- JavaScript-Syntax für geänderte Module/Bridges und Vite-Konfiguration erfolgreich.
- `npm run build`: in dieser Laufzeit nicht ausführbar, da das aus GitHub archivierte Repository keine installierten npm-Dependencies enthält (`vite: not found`). **Der Produktions-Deployment-Erfolg muss daher durch GitHub Actions bestätigt werden.**

## Installation

- Für das Update die PATCH-ZIP entpacken und die darin enthaltenen Dateien in derselben Ordnerstruktur in GitHub `main` hochladen; bestehende Dateien gleichen Namens ersetzen.
- Die FULL_SOURCE-ZIP ist ein vollständiger Quellcode-Snapshot auf demselben Stand und wird **nicht zusätzlich** über den Patch hochgeladen.
- Kein lokales Skript, keine Datenbankmigration erforderlich.
