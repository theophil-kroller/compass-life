# Compass 0.5.77.59.37 – Family Radar Phase 2

**Ausgangsbasis:** GitHub `main` Commit `9009520d12d929d8acff53d639f53186055347e4`, erfolgreicher Workflow #271.

## Neu

- **Forecast:** Familienereignisse der nächsten 21 Tage als schlanke, rein lesende Übersicht. Nur explizit kindbezogene Profile; bekannte Namenpräfixe ohne lokales Profil werden ausschließlich informativ gezeigt.
- **Lernzeitvorschläge:** Für erkannte Schularbeiten können drei unverbindliche 45-Minuten-Fenster aus einem *vollständig erfassten und maximal 2 Stunden alten* Google-Kalender errechnet werden. Ganztägige Belegungen und der Prüfungstag selbst werden ausgeschlossen. Angezeigte Zeitfenster bedeuten keine Garantie, dass alle Beteiligten Zeit haben.
- **Bestätigungspflicht:** Nur nach ausdrücklichem Tippen wird **eine** GTD-Lernaufgabe mit gewünschtem Tag und Uhrzeit im Notizfeld erfasst. Google Calendar wird nicht verändert. Doppelbuchung derselben Empfehlung wird lokal verhindert.
- **E2EE Geräteabgleich:** Family-Radar-Unterstützungsregeln sowie angenommene, verschobene und verworfene Entscheidungen werden in den vorhandenen verschlüsselten persönlichen Journal-Abgleich integriert. Konflikte nutzen Änderungszeitpunkte. Funktion setzt einen eingerichteten, freigegebenen Geräteabgleich voraus.
- **Fokus-Modus:** Keine zusätzlichen GPS-Abfragen, Netzwerkanfragen oder Forecast-Berechnungen beim Start von „Heute“. Die bisherigen Family-Heute-Hinweise bleiben unverändert.

## Prüfung

- `npm run check`: **1472/1472 Tests erfolgreich**.
- Zusätzlich als dauerhafter Regressionstest: 43 Vite-Plugins in historischer Reihenfolge über die echte `client/src/main.js` ausgeführt; resultierendes JavaScript ist syntaktisch gültig.
- Beide ZIP-Dateien werden aus denselben Änderungen erzeugt und nach dem Packen bytegenau auf Konsistenz geprüft.
- `npm run build` konnte lokal nicht ausgeführt werden: npm-Abhängigkeiten (`vite`) sind im Quellcode-Snapshot nicht installiert. GitHub Actions übernimmt den tatsächlichen Produktions-Build beim Upload.

## Installation

`PATCH_READY_UPLOAD.zip` entpacken und die Dateien in ihrer erhaltenen Pfadstruktur ins GitHub-Repository hochladen, bereits vorhandene gleichnamige Dateien überschreiben. **Nicht zusätzlich den Full Source hochladen.** Der `FULL_SOURCE_READY.zip` dient als Sicherheitskopie des vollständigen aktuellen Quellcodes.

**Wichtig:** Ein alter Offline-Kalender bleibt für Ereignisse lesbar, aber führt nicht zu fingierten freien Terminvorschlägen. Die Uhrzeit einer Lernaufgabe bleibt derzeit in der Notiz; sie reserviert keinen Kalenderblock. Der Mehrgeräte-Abgleich kann parallele, vor Abschluss der Synchronisierung auf verschiedenen Geräten akzeptierte Entscheidungen nicht vollständig atomar sperren.
