# Compass 0.5.17 · Finance Visual Intelligence

Basis: vollständiger Stand **0.5.16**. Patch-ZIP enthält nur die neuen/geänderten Repository-Dateien; FULL_SOURCE.zip enthält den vollständigen Quellcode inklusive unverändertem Worker, Android und Garmin.

## Enthalten

- Neun Finanz-Panes inklusive eigener **Einnahmen**- und **Prognose**-Sicht; zentraler, klar beschrifteter Zeitfilter: dieser Monat, letzte drei Monate, letzte zwölf Monate, Jahr bis heute, gesamter Zeitraum, einzelne Jahre und Monate.
- Fünf SVG-Visualisierungen: **Sankey-Abflüsse**, **Treemap**, **Stacked Area**, **Waterfall** und **indikatives Forecast-Band**. Zusätzlich interaktiver Ausgaben-Donut, Einnahmenübersicht und Monatsbalken.
- Originale **Category Insight Cards** mit kontinuierlichem Verlauf von Dunkelgrün (deutlich unter historischer Referenz) bis Orange/Rot (deutlich darüber), historischen Mittelwerten und *typischem Bereich* (empirisches 20.–80. Perzentil). Dabei werden Budgetziele nicht mit Normalwerten verwechselt.
- Hochrechnung des laufenden Monats nur bei mindestens sechs beobachteten Referenzmonaten, wenigstens sieben Kalendertagen des Monats und hinreichend gleichmäßiger Kategorie. Unregelmäßige Kategorien zeigen **keine Prognose**.
- Trend aus drei jüngsten vs. drei vorhergehenden **zusammenhängenden** Referenzmonaten; bei zu wenig Daten "Unklar".
- Click-through Kategorie → 12-Monats-Details → passende Bankbuchungen. HTML-Escaping auch in SVGs. Farbpalette nach Kategorie.
- CSV- und private-Regeln-Importe unverändert, optisch in ausklappbarer Datensektion; zusätzlich bleiben sie im zentralen Wochenreview von 0.5.16.

## Datenintegrität und Grenzen

- Rein lokale Finanzverarbeitung: keine neue API, keine Worker-Migration, keine geänderten Vault-Schlüssel. Bankdaten und besondere Empfängerregeln gehören **nie** in das öffentliche GitHub-Repository.
- Geldflüsse zeigen Bankabgänge; ein Sankey von *Einnahmen zu denselben Ausgaben* wäre ohne Bankkonten-/Bestandsabgleich eine unzulässige Behauptung. Transfers und Bargeld getrennt ausweisen.
- Monate ohne Buchungen sind keine Nullmonate. Die Vollständigkeit importierter Monate lässt sich aus Bankbuchungen allein nicht nachweisen; erste angefangene Importmonate werden aus der rollenden 12-Monats-Referenz ausgeschlossen.
- Forecast in 0.5.17 ist ein **nicht kalibriertes Szenario** aus historischen Monatsausgaben und Streuung; kein statistisches Konfidenzintervall und keine kassenmäßige Vorhersage. Größere Prognose-/Backtesting-Ausbaustufe für 0.5.18.
- Noch fehlen andere Konten, Kreditkarten, endgültiger Geldtransfer-Abgleich und Portfolio-Bestände.

## Installation

1. **Verschlüsseltes Vault-Backup** anlegen.
2. `Compass_0.5.17_GITHUB_PATCH.zip` entpacken und enthaltene Dateien mit identischen Pfaden in `theophil-kroller/compass-life`, Branch `main`, hochladen/ersetzen. Kein Generator notwendig.
3. GitHub Actions → **Deploy Compass Web** abwarten; erst nach erfolgreichem Deploy Compass neu laden.
4. Finanzen → Überblick, Ausgaben, Cashflow, Einnahmen, Prognose sowie Datensektion prüfen. Bestehende CSVs und private Regeln bleiben unverändert.

## Tests

`node --test tests/*.test.mjs` sowie `node --check` für geänderte JS-Module; Vite-Produktionsbuild optional nach Installation der npm-Abhängigkeiten (`npm install && npm run build`).
