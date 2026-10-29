# Compass Life — Mensa Rooftop Study-Teller (incremental .40.25.12)

**Basis:** zuletzt erfolgreich veröffentlichte Compass-Web-Quellen, GitHub Actions #323, Commit `9a525c77e275878f44c918756206885d6a9478c7`. Diese Datei ergänzt den bestehenden Snapshot, keine Änderung an Cloudflare-Migration, Garmin-Programm oder persönlichen Daten.

## Installation

- **Patch-ZIP:** ZIP entpacken. Die Dateien mit den darin enthaltenen relativen Pfaden (`client/src/...`, `tests/...`, `README_MENSA_40.25.12.md`) über die gleichnamigen Dateien im GitHub-Repository legen. **Nicht den gesamten `client/src`-Ordner löschen.**
- **Full-Source-ZIP:** Alternative zum Patch, nicht beide anwenden.
- Der geänderte Source-Snapshot wird weiterhin durch `client/vite.fullsource.config.js` als `main-full-v57759402510.js` gebaut. Nichts an der Cloudflare-Datenbank migrieren oder zurücksetzen.

## Verhalten

1. Öffnen von **Insights → Ernährung** lädt das große Mensa-Modul und setzt einmalig den vorbereiteten Vier-Tage-Katalog vom 27.–30.10.2026 in den verschlüsselten Tresor. Sofern E2EE-Journal-Abgleich eingerichtet ist, wird der bestehende Abgleich aufgerufen. Das Abgleich-Ergebnis ist im bestehenden Journalstatus zu kontrollieren.
2. Die neue Unterseite **Mensa** enthält die Menüvorschau, den kopierbaren GPT-Webrecherche-Prompt sowie `JSON prüfen` → `geprüfte Menüs importieren`. Das Speichern ist explizit; Menüimport erzeugt keine Ernährungseinträge.
3. Der **Study-Teller**-Button im bestehenden Ernährungserfassungsmenü liest nur lokal den Tageseintrag, ohne API, GPT-Suche oder Katalog-Download. Wenn die Daten fehlen, sagt die App, dass unter Insights recherchiert/importiert werden muss; **kein Gericht von einem anderen Tag** wird übernommen.
4. **Heute:** 11:00 bis 13:59 Europe/Vienna erscheint ein schmaler Chip mit dem gespeicherten Gericht und `Study-Teller gegessen ✓`. Nur dessen Klick schreibt genau einen Essenstagebucheintrag; nach dem Klick verschwindet der Chip am selben Tag. Fehlende Menüs für die kommenden drei Werktage erzeugen ansonsten einen dezenten Recherchehinweis, der unmittelbar zur Mensa-Unterseite navigiert.
5. Ein dokumentierter Study-Teller erhält einen unveränderlichen Snapshot von Gericht, Schätzspannen, Menübericht und Quellen. Nachträgliche Menükorrekturen und wiederholte Importe verändern bestehende Mahlzeiten nicht und erzeugen keine Daily-Dozen-Häkchen.
6. Menükatalog `mensaCatalog` gehört zum verschlüsselten Tresor und zur bestehenden E2EE-Journal-Payload; `mergeJournalData` erhält alle Katalogeinträge beim Geräteabgleich. Kassenbons, Trainings- und Traumjournale bleiben unangetastet.

**Keine vollautomatische GPT-Suche innerhalb der Webapp:** Der kopierbare Prompt beauftragt ChatGPT mit selbstständiger öffentlicher Recherche und einer JSON-Antwort. Die App selbst sendet keine API-Anfragen an OpenAI und besitzt keinen OpenAI-API-Schlüssel.

## Prüfung

- `node --test tests/*.test.mjs`: 1.728 von 1.728 bestanden (lokaler vollständiger Repo-Testlauf).
- Node-Syntaxcheck für alle geänderten JS-Dateien erfolgreich.
- Ein tatsächlicher **Vite-Produktionsbuild / GitHub-Deployment** ist erst nach Upload in GitHub Actions zu überprüfen, weil die NPM-Abhängigkeiten im Ausführungscontainer nicht installiert sind. Deshalb kein Deployment-Versprechen.
