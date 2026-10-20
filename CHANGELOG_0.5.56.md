# Compass 0.5.56 — Projektreparatur, Fortschrittsdarstellung & erweiterter Conference Radar

Basis: **Compass 0.5.55**. **Keine neue D1-Migration.** Kein Reset und keine Änderung gespeicherter Projektdaten erforderlich.

## Regression-Fixes

- `isTemplateTask` wird jetzt im `client/src/main.js` importiert; die fehlende JavaScript-Referenz war für den sichtbaren Projekt-Renderer-Fehler verantwortlich (`ReferenceError: isTemplateTask is not defined`).
- Der generische Projekt-Fehlerbildschirm behauptet nicht mehr fälschlich, ein Datenrecord sei fehlerhaft.
- In den Aufgabenlisten **Heute** und **Next Actions** gibt es wieder den Fortschrittszähler mit schmalem Balken, ohne dass der Titel verdeckt wird; `+1` bleibt nutzbar. In den kompakten Projektbaum-Zeilen bleibt absichtlich nur `x/y` + `+1`.
- Unter **Insights > Fortschritt > Projektfortschritt** haben Projekttitel und kompakter `x/y`-Zähler getrennte Layoutspalten, sodass der Titel umbrechen kann und nicht vom Zähler überlagert wird.

## Conference Radar — Fachrecherche vom 20. Oktober 2026

- **32 kuratierte Einträge** (3 aus 0.5.55 + 29 hinzugefügt). Jeder Eintrag hat eine offizielle Veranstalter-URL. Die Rechercheliste liegt zusätzlich als CSV bei.
- Neu: Forschungsschwerpunkte **Bildungsforschung**, **EdTech & KI**, **Sprachlernen & Migration**, **Mehrsprachigkeit**, **Entrepreneurship** und **Entrepreneurship Education**.
- Neuer Filter **Forschungsfokus** mit **Learnly**, **Dissertation**, **Entrepreneurship-Lehre** und **Sonstige Forschung**. Ein Call kann mehreren Fokussen zugeordnet sein.
- Learnly-spezifische Optionen u. a. CALICO, EARLI/JURE, EuroSLA, EUROCALL, ECER/ERC, LiP Vienna, ÖDaF, Mercator und DoCNet. Dissertation u. a. NBM, EURAM, R&D Management, ECIE, HICSS, EGOS, ISDRS. Kleinere Formate explizit eingeschlossen.
- Termin, Einreichformat und Forschungskontext werden in der Kartenansicht angezeigt. Vergangene Fristen erscheinen hinter künftigen; für vergangene Fristen ist der Projektentwurf deaktiviert.
- Die vorhandenen drei Seed-IDs bleiben unverändert. Gespeicherte Merkliste- und Ausblenden-Entscheidungen bleiben über die bestehende Status-Overlay-Logik erhalten.
- **HICS-Abkürzung** ist nicht zweifelsfrei zugeordnet; HICSS wurde als überprüfbare Hypothese aufgenommen (2027-Einreichfrist bereits vorbei).

## Datenqualität & Einschränkungen

- Nur **bekannt gegebene**, offiziell belegte Einreichfristen wurden als `deadline` gesetzt. Ohne belegte Frist bleibt der Wert leer; Einträge sind dann reine Watchlist-Optionen und lassen sich nicht voreilig in einen Deadline-Projektentwurf übernehmen.
- Redaktionelle Momentaufnahme: **keine Live-Suche oder Hintergrundüberwachung**. Daten und Aktualisierungen aus Veranstalterwebsites können sich ändern. Kosten, formale Qualität, Akzeptanz und Publikationsmöglichkeiten wurden nicht universell überprüft.
- Beim 3E-Call ist die **1. Dezember 2026** Frist der Veranstalterseite und dem BAM-Announcement entnommen; eine ECSB-Übersichtsseite nennt abweichend den 11. Dezember. Bitte verbindliche Frist beim Veranstalter überprüfen.
- Einreichung eines Projekts erfolgt weiterhin **nur über die bisherige lokale Projekt-Importvorschau und explizite Bestätigung**; bestehende lokale Daten werden nicht automatisch verändert.

## Prüfstand

- **588/588 Node-Tests erfolgreich**.
- **Worker-Syntaxprüfung erfolgreich**.
- Production-Vite-Build **nicht ausführbar**: `vite`/`node_modules` sind in der Buildumgebung nicht installiert. Bitte mit `npm install` und `npm run build` im Repository oder via bestehendem GitHub Actions Deployment bauen.
- Live-Browser-/PWA-/Cloudflare-Abnahme **nicht durchgeführt**.
