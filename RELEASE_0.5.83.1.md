# Compass Life 0.5.83.1 — Hotfix: GPT-Bonimport aus formatierten ChatGPT-Antworten

Verbindliche GitHub-Ausgangsbasis: `main` / `74ac23843b5ba2351cf1edc87828df75b287fd8a` (Compass 0.5.83).

## Änderungen
- Bestehendes `compass_receipt_v1`-JSON (Einzelbon, Array oder `{ "receipts": [...] }`) bleibt unverändert lesbar.
- Normalisierung von HTML-Leerzeichen (`&#x20;`, `&#32;`, `&nbsp;` und geschützten Leerzeichen) und Backslash-Zeilenumbrüchen, wie sie beim Kopieren aus ChatGPT vorkommen.
- Bei nicht parsebarem JSON einmalig gezielte Reparatur doppelt maskierter Anführungszeichen (`\\"`), ohne Valides zu verändern. Zum Beispiel `"ISS REIF!" MANGO`.
- Erkennung von Markdown-JSON-Codeblöcken mit vorausgehendem oder folgendem erklärendem Text sowie JSON-encodierter JSON-Zeichenkette.
- Die erlaubte Bon-Kategorie `Bücher` wird beibehalten (entsprechend dem GPT-Prompt), nicht zu `Sonstiges` umklassifiziert.
- Der gewohnte Review-Bildschirm bleibt erhalten: kein automatischer Import in Finanzen, keine automatische Erfassung als gegessenes Lebensmittel.
- Unvollständige oder inhaltlich ungültige Schemas, falsche Daten und verbotene Zahlen werden weiterhin abgelehnt. Keine Ausführung von beliebigem JS/JSON5, kein stilles Raten von Preisen.

## Konkreter Regressionstest
Vier vom Nutzer gepostete Beispielbons (SPAR 29.10., SPAR 31.10., Hofer 16.10., SPAR 27.10.) mit 20 Positionen und 50,35 EUR. Das Beispiel testet `&#x20;`, Backslash am Zeilenende und doppelte Maskierung bei `"ISS REIF!" MANGO`. Die Originalbontexte enthalten zusätzliche Anmerkungen; Testdaten bilden die betreffenden Strukturen und Preiszeilen nach.

## Ergebnisse
- Neue Hotfix-Tests: 8/8.
- Bon-Regressionstests gemeinsam: 24/24.
- `npm run check:deploy`: 33/33 erfolgreich, inkl. Importgraph und Worker-Checks.
- `npm test`: 1784/1817, 33 bestehende historische Fehlschläge.
- Vite-Produktion: in dieser Umgebung wegen fehlender `node_modules` nicht lokal kompiliert; GitHub Actions prüfen.

## Installation
Den PATCH nur auf dem exakt geprüften GitHub-Ausgangscommit anwenden. FULL SOURCE ist eine Alternative, kein zusätzliches zweites Paket. Keine Änderungen am Tresor, D1-Datenbank oder bestehenden Bons. Vor erneutem Import zunächst Vorschau prüfen; bereits gespeicherte Bons werden bei identischem Fingerprint übersprungen.
