# Compass 0.5.77.1 — Schlafarchiv, konsistente Zeitachsen & Importtransparenz

**Ausgangsbasis:** Compass 0.5.77. Reines Client-Update, keine Cloudflare-Worker- oder D1-Migration.

## Korrekturen

- **Schlafkonsistenz:** Die Kurve verwendet nur Schlafnächte innerhalb der aktuell gewählten Datumsspanne. Das bisherige unsichtbare Abschneiden auf 220 Nächte wird entfernt. Die Legende zählt die tatsächlich gezeichneten Nächte. Ältere Punkte können nicht länger außerhalb des angezeigten X-Achsenfensters liegen.
- **Schlaf-Jahresübersicht:** Die Monats-/Wochen-/Tagesansicht ist unabhängig von der neuen Navigation „Vorheriges Jahr“, „Nächstes Jahr“ und „Aktuell“. Jedes Jahresfenster enthält zwölf zusammenhängende Kalendermonate. Frühere Fenster lassen sich auch öffnen, wenn alte Garmin-Einträge zwar gespeichert sind, aber noch keine auswertbare Schlafdauer haben.
- **Kalender / Heatmap:** Der Schlafkalender zeigt denselben navigierten Zeitraum wie das Diagramm; Monate vor November 2025 sind erreichbar, sofern ältere Datensätze im Vault existieren.
- **Datentransparenz:** Oberhalb der Diagramme stehen Gesamtzahl und erster/letzter Tag der im lokalen Tresor gespeicherten Garmin-Nächte, Zahl mit auswertbarer Schlafdauer, Zahl in der aktuellen Zeitraumauswahl und Zeitstempel des letzten bestätigten Garmin-/Fitdays-Imports. Unvollständige Garmin-Schlafdatensätze werden kenntlich gemacht.

## Technischer Befund

Der alte Jahresüberblick war auf zwölf Monate **fix um das heutige Datum** begrenzt. Darum beweist eine Darstellung ab November 2025 **nicht**, dass Juli 2025 beim Import verworfen wurde. Die tatsächliche ältere Datenabdeckung kann nur anhand der im Vault vorhandenen Nächte festgestellt werden. Die bestehende Importfunktion führt alte und neue Nächte nach Kalendertag zusammen und behält neue Kalendertage bei; ein Import wird nicht automatisch als vollständig betrachtet.

## Tests

807/807 Node-Tests bestanden, darunter fünf neue Regressionstests für die Datumsachse, mehr als 220 Nächte, Archivnavigation, Importabdeckung und historischen Backfill. `npm run check -w worker` sowie JavaScript-Syntaxprüfungen erfolgreich. Vite-Produktionsbuild nicht lokal geprüft (im Quellpaket sind `node_modules` und ein Lockfile nicht vorhanden; `vite` ist in dieser Ausführungsumgebung nicht installiert). GitHub-Actions-Build und Browsertest sind vor produktiver Nutzung notwendig.

## Datenhaltung

Keine vorhandenen Schlafdaten werden verändert oder gelöscht. Keine neue API, Worker-Version, Drittanbieterbibliothek oder D1-Migration erforderlich.
