# Compass 0.5.77.56 – GTD Workspace Redesign

Basis: erfolgreicher GitHub Actions Deploy #219 / Compass 0.5.77.55.2. Kein neues Schema, keine Migration.

## Installation
ZIP entpacken und ALLE enthaltenen Dateien mit derselben Ordnerstruktur in GitHub `theophil-kroller/compass-life` unter `main` hochladen.

- Ersetzen: `client/vite.config.js`.
- Hinzufügen: `client/compass756-bridge.js`, `client/src/gtd-workspace-v57756.css`, `tests/compass-057756-workspace.test.mjs`.
- Ersetzen: die **sechs** enthaltenen `tests/compass-057750` bis `057755` (neue Bridge in Kettenprüfungen berücksichtigt).
- Dokumentation ist optional.

Nach dem Upload: Actions > Deploy Compass Web. **Erst bei grünem Workflow ist der Web-Produktionsbuild bestätigt.**

## Verhalten

- Focus zeigt GTD sowie die schnellen Erfassungsknöpfe für Gefühle und Ernährung; Extended bietet weiterhin Insights und Finanzen auf Abruf.
- Ein einziges farbiges Zielscheiben-Symbol bedeutet Focus; im Extended-Modus ist es grau. Ein Klick wechselt zwischen den Modi.
- Heute: Aufgaben / Inbox-Erfassung zuerst, darunter Termine, rechts Inspector.
- Weitere Tagesplanung erscheint nur nach Klick auf „Weitere Planung“.
- **Empfehlungen werden nur über den Knopf „Empfehlungen berechnen“ ausgeführt**. Erst erneutes Klicken auf ↻ berechnet neu; × schließt das Ergebnis. Task-/Kalender-/Sync-Render lösen keine automatische Empfehlungsberechnung mehr aus.
- Klassische Aufgaben- und Synchronisationspfade sowie Vault bleiben unverändert. Vorhandene Daten werden nicht verändert.

## Prüfumfang

45/45 lokale Regressionstests grün, inklusive syntaktischer Prüfung eines transformierten `.55.2` + `.56`-Fixtures und einem Default-Heute-Test, bei dem kostspielige Zusatzberechnungen absichtlich Fehler werfen würden.

**Nicht bestätigt**: kompletter Vite-Produktionsbuild mit allen Repository-Dateien, echte UI-Laufzeit auf Windows/Android, reale Performance nach Upload. Eine deutliche Beschleunigung ist das Ziel, kein garantierter Messwert. 
