# Compass Life 0.5.77.59.9 — GTD Workspace Premium

Basis: GitHub `theophil-kroller/compass-life`, main, Commit `1eec006f78c05227ff377d6bad0ef81cbe8c1569` (25.10.2026).

## GitHub-Upload

Die Dateien relativ zum Repository-Hauptverzeichnis hochladen:

1. **Ersetzen:** `client/index.html`
2. **Neu:** `client/public/gtd-workspace-premium-v577599.css`
3. **Neu:** `client/public/gtd-workspace-premium-v577599.js`
4. **Neu (Regressionstest):** `tests/compass-0577599-gtd-workspace.test.mjs`

`tests/test_ux_0599.py` ist nur ein lokaler visueller Prüfhelfer und **nicht** Teil des Upload-ZIPs.

## Änderungen

- Projektansicht: kompakte Sidebar/Outline, klarer Fokus und selektierbare Zeilen, Inspector optional; auf schmalen Displays als Overlay bzw. unter 760 px als mobil bedienbares Bottom Sheet.
- Heute und Inbox: harmonisierte Abstände, Ränder, Eingabefelder und Fokusindikatoren.
- Tastatur: Auf/Ab in Projekt-, Task-, Inbox- und Heute-Listen; Rechts/Links für auf-/zuklappbare Ordner; Alt+Shift+I (Inspector) und Alt+Shift+N (neue Projektaufgabe) bei aktivem Projekt-Workspace. Enter/Click verwenden vorhandene Aktionen.
- Accessibility: Fokus sichtbar, Eingabefelder von Tastaturkürzeln ausgenommen, reduzierte Bewegung respektiert.

Keine Änderungen an `client/vite.config.js`, Vault, Datenmigration, Sync oder Berechnungen. Die bestehenden Ansichten und ihre Aktionen bleiben maßgeblich.

## Tests

- `node --test tests/compass-0577599-gtd-workspace.test.mjs` — 4/4 lokal bestanden
- `python tests/test_ux_0599.py` mit Chromium — lokal bestanden bei 1900, 1200 und 390 px; zusätzliche Tasten- und Inspector-Prüfungen

Die gesamte GitHub-Actions-Suite und der Produktions-Build laufen nach dem Upload; sie konnten in der lokalen Teilkopie nicht vollständig ausgeführt werden.
