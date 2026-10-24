# Compass 0.5.77.50 – Insights Navigation Consolidation

**Basis:** 0.5.77.49.1, GitHub Actions **#211 erfolgreich**.

## Ziel
Die bisher auf rund 20 Einträge gewachsene Insights-Seitenleiste wird in **fünf erkennbare Bereiche** zusammengefasst. Alte Berichte werden nicht entfernt und erhalten weiterhin ihre bisherigen IDs und Aktionen.

## Neue Navigation

1. **Übersicht & Intelligence:** neues read-only **Cockpit** mit knappem Datenstand; Untertabs Wochenkompass, Fristen & Kapazität, Life Balance, Zusammenhänge und Explore.
2. **Gesundheit & Körper:** Schlaf, Body Battery, Stress, Körperanalyse, Krafttraining, Ernährung und Aktivitäten.
3. **Leben & Orte:** Gefühlswelt, Berührung & Nähe, Traumwelt, Orte & Weltkarte und Erholung.
4. **Zeit & Produktivität:** Arbeitszeit, Zeitjournal, Produktivität, Habits und Fortschritt. Die bisher doppelte Arbeitszeitnavigation wird als **ein Themenbereich mit zwei eigenen Untertabs** geführt; es werden keine bislang getrennten Daten zusammengefasst.
5. **Datenquellen:** bisherige Import- und Verbindungsübersicht.

Diese Gruppen erscheinen in der Desktop-Seitenleiste und in der mobilen Insights-Navigation. Innerhalb eines Bereichs stehen kompakte Untertabs zur Verfügung. Der zuletzt geöffnete Untertab jedes Bereichs wird **während der laufenden Sitzung** gemerkt (nicht im Vault gespeichert).

## Cockpit
- Nur bestehende lokale Daten: Garmin-Nächte der letzten sieben vollständig vergangenen Tage, Fristen der kommenden 14 Tage und letzter dokumentierter Fitdays-Gewichtsstand.
- Keine fiktiven Messwerte, Scores oder Aussagen zur heutigen Leistungsfähigkeit.
- Direkte Links zu den umfassenden, bestehenden Auswertungen.

## Kompatibilität und Sicherheit
- **Keine Änderungen** an D1, Worker, Vault-Schema, Sync, Importformaten oder den bestehenden Erfassungen.
- Aktivitäten, Erholung und Fortschritt sind weiterhin eigenständige Ansichten; sie werden aus dem zugehörigen Themenbereich verlinkt.
- Der 0.5.77.50-Bridge-Transform ist `enforce:'pre'` und führt sich nach allen älteren Source-Bridges aus. Die historische VitePWA-Plugin-Nachbarschaft bleibt für vorhandene Tests erhalten.

## Lokal geprüft
- Sechs neue Node-Testgruppen: Navigation, Vollständigkeit der Zielrouten, Datenschutz/Datenlücken, Transformation, Syntax und die historischen CI-Anker.
- Syntaxprüfungen der neuen JS- und Vite-Konfiguration durchgeführt.
- Der vollständige npm-/Vite-Produktionsbuild ist durch den nachfolgenden GitHub-Actions-Lauf zu bestätigen.
