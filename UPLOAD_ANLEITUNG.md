# GitHub-Upload — Compass Life 0.5.77.53 PATCH

**Voraussetzung:** Das bestehende GitHub-Repository enthält bereits `0.5.77.52` (Actions #214 grün).

1. ZIP auf deinem Rechner entpacken.
2. Alle Dateien unterhalb von `client/` und `tests/` unter ihren **identischen Pfaden** in `theophil-kroller/compass-life` auf `main` hochladen. Vorhandene Dateien ersetzen, neue hinzufügen.
3. `CHANGELOG_0.5.77.53.md` kann ebenfalls im Repository-Hauptverzeichnis abgelegt werden. `UPLOAD_ANLEITUNG.md` muss nicht hochgeladen werden.
4. Möglichst einen Commit für alle Änderungen verwenden.
5. GitHub → **Actions → Deploy Compass Web**. Der Lauf muss sowohl Tests als auch den Vite-Build erfolgreich durchlaufen; erst danach die Web-PWA neu laden.

## Zu ersetzen

- `client/vite.config.js`
- `tests/compass-057750-insights-nav.test.mjs`
- `tests/compass-057751-premium-ui.test.mjs`
- `tests/compass-057752-chart-first.test.mjs`

## Neue Dateien

- `client/compass753-bridge.js`
- `client/src/finance-premium-v57753.js`
- `client/src/finance-premium-v57753.css`
- `tests/compass-057753-finance-performance.test.mjs`

## Manuelles UI-Checking

- Finanzen → Überblick: Kennzahlen, Monatsdiagramm und Kategorieanteile sofort sichtbar (ohne Öffnen von Details).
- Perioden-/Kontofilter wählen und prüfen, ob das Diagramm entsprechend wechselt.
- „Cashflow-Details“, „Ausgaben“, „Portfolio“, „Buchungen“ und „Prüfen“ müssen die bisherigen Unterbereiche öffnen.
- Insights → Gesundheit → Schlaf: zuerst Wochen-Schlafphasen und Schlaftrend, danach KPI- und Erklärungstexte; Boxplot sichtbar.
- „Heute“: Aufgaben bearbeiten, Inspector öffnen/schließen und Termine ansehen — unverändert.

**Nicht erforderlich:** Vault neu erstellen, lokale Daten löschen oder D1-Migration. Bei PWA-Cache den normalen Reload verwenden; nur wenn der neue Service Worker nicht aktiv wird, App schließen und erneut öffnen.
