# Compass 0.5.77.35 installieren

1. **Voraussetzung:** Zuerst Compass **0.5.77.34** vollständig auf GitHub hochladen und deployen.
2. Dieses ZIP lokal entpacken.
3. Im GitHub-Repository `theophil-kroller/compass-life` alle enthaltenen Dateien **unter exakt demselben relativen Pfad** hochladen. Bestehende `client/vite.config.js` ersetzen.
4. Unverändert bleiben alle vorherigen .27–.34-Bridges, Datenbanken und bisherigen Ernährung/Kraft-Importdateien.
5. GitHub Actions / Pages deployment abwarten und auf dem Mobilgerät nach dem Update die PWA neu öffnen. Anzeige links sollte **0.5.77.35** lauten.
6. In **Insights → Krafttraining** siehst du Vorder-/Rückansicht und kannst zwischen Haupt/Neben und Satzbelastung wechseln.
7. In **Insights → Berührung & Nähe** stehen Streicheln, Tanzen und Massage zur Wahl. Die neue Zeitleiste befindet sich unter der bisherigen Zählübersicht.

## Paketinhalt
- `client/vite.config.js` – aktiviert den zusätzlichen .35 Vite-Bridge nach .34
- `client/strength-touch735-bridge.js` – additive, abgesicherte Integrationsänderungen
- `client/src/strength-visual-v57735.css` – Muskelkarte, Navigation und mobile Darstellung
- `client/src/touch-insights-v57735.js` – freiwilliges Berührungsjournal mit Verlauf
- `client/src/touch-insights-v57735.css` – kompakte Zeit- und Verteilungsdiagramme
- `tests/gtd-057735-muscles-touch.test.mjs` – gezielte Tests (auf dem vollständigen Repository ausführbar)
- `CHANGELOG_0.5.77.35.md`, `UPLOAD_ANLEITUNG.md`

## Testhinweis
Die Tests wurden erfolgreich mit lokal vorhandenen v.32/v.33-Quellbestandteilen und Modul-Fakes ausgeführt (7/7). Ein komplettes Repository-`npm run build` wurde nicht ausgeführt. Wenn der Vite-Build einen **Integrationsanker** meldet, liegt eine abweichende Quellversion vor; in diesem Fall nicht mit manuellen Teilpatches weitermachen, sondern den genauen Fehler prüfen.
