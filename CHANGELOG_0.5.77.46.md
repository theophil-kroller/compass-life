# Compass 0.5.77.46 – Weekly Life Intelligence

Basis: veröffentlichte Compass 0.5.77.45 (GitHub Actions #205 erfolgreich).

## Neue Ansicht
- **Insights → Wochenkompass** in Desktop-Sidebar und Insights-Unterreitern.
- Immer die **letzten sieben vollständig vergangenen Kalendertage** (heute bewusst ausgeschlossen). Navigation in älteren Sieben-Tage-Zeiträumen.
- Pro Datenquelle letzte dokumentierte Messung und 0–7 tatsächlich vorhandene Tage, kein künstliches Auffüllen von Datenlücken.
- **Dot-Plots** für Garmin-Schlafdauer/Schritte, Fitdays-Gewicht/Körperfett, Zeitjournal, dokumentierte Forschung, Familienzeit, Ernährungserfassungen und importierte Einkaufsbons.
- GTD-Aufgabenfristen als separat gekennzeichneter **aktueller Ausblick** der kommenden 14 Tage plus überfällige Aufgaben.
- Hinweise zu Datenabdeckung und zurückhaltende Zusammenfassung beobachteter Muster, ohne Diagnosen, Scores oder Spekulation über heutige Energie.
- Importstatus je Datenquelle basiert auf dem tatsächlichen **jüngsten Datum in den bereits importierten Beobachtungen**. Kein Live-Garmin- oder Fitdays-Zugriff.

## Sicherheits- und Datenprinzipien
- Auswertungen lesen die bereits lokal entschlüsselten Daten. **Kein zusätzlicher Server, keine neue Datenübertragung, keine D1-Migration**.
- Kein neuer Kontakt- oder Familienzeit-Trackingzwang. Nur als `family` protokollierte Zeit wird als Familienzeit gezeigt; Zeit mit Sohn und Partnerin wird nicht erfunden.
- Kaufdaten stammen nur aus dem Bonjournal und werden **nicht mit Banktransaktionen addiert**.
- Fehlende Mahlzeiten sind keine Fastentage; Fitdays-BIA-Werte sind Schätzungen und keine tägliche Messung von Muskelzuwachs.
- „Forschung“ erkennt ausschließlich explizit benannte Zeitjournaleinträge zu Forschung, Paper oder Dissertation.

## Tests
37 gezielte lokale Node-Tests bestanden, einschließlich drei bisheriger 0.5.77.45-Regressionssuiten und neuer Wochenkompass-Tests.
**Kein vollständiger Vite-Produktionsbuild**: Im Arbeitscontainer sind weder die vollständigen GitHub-Repositoriumsdateien noch installierte npm-Abhängigkeiten verfügbar. Nach Upload auf GitHub Actions den Gesamt-Check abwarten.
