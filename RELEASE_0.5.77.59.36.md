# Compass 0.5.77.59.36 — Offline Calendar & Family Today

Ausgangsbasis: erfolgreicher GitHub Actions Workflow #270, Commit `d0c75fc91b83e01f3dfc75cfcdd1c8e7c86ee631`.

## Verbesserungen

- „Heute“, Kalender- und Forecast-Ansichten zeigen die Termine aus dem **verschlüsselten Kalenderarchiv**, auch wenn das temporäre Google-Zugriffstoken abgelaufen ist. Die Google-Freigabe ist nur für das aktive **Aktualisieren** nötig. Google-OAuth-Tokens werden nicht gespeichert.
- Gespeicherte Termine werden als solche gekennzeichnet, mit Stand des letzten erfolgreichen Abgleichs und einer optionalen „Aktualisieren“-Aktion.
- Kalenderbezogene People-/Review-Vorschläge verwenden ebenfalls bereits gespeicherte Termine ohne neuen Login.
- Family Radar erkennt die bekannten Kind-Namenspräfixe Nathanael/Nathaniel und Seraphina auch bei Personenprofilen mit Nachnamen; ausdrücklich als erwachsene Kontakte klassifizierte Personen werden nicht als Kinder interpretiert.
- Englischschularbeit, Englisch-Schularbeit und andere zusammengesetzte Schultermin-Bezeichnungen werden erkannt.
- Für Nathanaels eindeutig markierte Schularbeiten wird ein **rein informativer Hinweis** in „Heute“ ermöglicht, wenn die People-Kontakte auf dem Gerät noch nicht synchronisiert sind. Der Hinweis führt dann zum Kalendertermin. Es wird keine Aufgabe bzw. kein Kontakt automatisch angelegt.
- Alte Familienentscheidungen bleiben erhalten; es erfolgen weder Google-Kalender-Änderungen noch automatisches Entfernen von Daten.

## Installation

**Patch:** ZIP entpacken und die enthaltenen Dateien mit der bestehenden Verzeichnisstruktur in das GitHub-Repository `theophil-kroller/compass-life` auf Branch `main` hochladen. Vorhandene gleichnamige Dateien ersetzen.

**Full Source:** Vollständiger Quellcode aus exakt demselben Stand (zum Sichern oder vollständigen Ersetzen), nicht zusätzlich zum Patch hochladen.

## Wichtige Grenzen

Der Offline-Modus zeigt nur bereits tatsächlich im jeweiligen verschlüsselten Tresor vorhandene oder per bestehendem E2EE-Geräteabgleich übertragene Kalendereinträge. Wenn dieses Gerät noch keinen Kalendercache besitzt, ist **ein einmaliger Google-Kalenderabgleich** weiterhin notwendig. Die App lädt keine neuen Google-Termine ohne gültige Freigabe.

Teststatus: `npm run check` vollständig erfolgreich (1.462/1.462 Tests), einschließlich neuer Offline-Kalender- und Family-Tests. Die 42 registrierten Vite-Quelltext-Transformationen wurden als Gesamtkette angewendet und der resultierende Haupt-JavaScript-Code syntaktisch geprüft. Ein **kompilierter Vite-Produktions-Build** konnte lokal nicht durchgeführt werden, da npm-Abhängigkeiten nicht im Snapshot liegen und die npm-Registry in dieser Laufzeit nicht erreichbar ist. GitHub Actions muss den Produktions-Build bestätigen.
