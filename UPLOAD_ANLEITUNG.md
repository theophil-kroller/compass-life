# Compass 0.5.77.59.10 — Strength Coach + Makko-Ho + kompakte Planung

Basis: aktuelles GitHub `main` nach erfolgreichem .59.9 Deployment.

## Upload (Pfadstruktur beibehalten)

**Vorhandene Dateien ersetzen**

- `client/vite.config.js`
- `client/index.html`

**Neue Dateien anlegen**

- `client/compass5910-strength-habits-bridge.js`
- `client/public/compact-plan-v5775910.css`
- `client/src/strength-coach-v5775910.js`
- `client/src/strength-coach-v5775910.css`
- `client/src/makko-ho-guide-v5775910.js`
- `client/src/makko-ho-guide-v5775910.css`
- `tests/compass-05775910-strength-habits.test.mjs`

Kein direktes Überschreiben von `main.js`, `strength-editor-v57732.js` oder `strength-anatomy-v57737.js`: der neue, *guarded* Vite-Transform ergänzt diese Dateien beim Build. Die historische `.50`–`.58`-Brückenkette bleibt in ihrer bisherigen Reihenfolge erhalten.

## Was funktioniert

1. Planen: Next Actions, Projekte, Kalender, Einkaufen und Freizeit/Erholung sichtbar; zusätzliche Perspektiven über „Weitere Planung“.
2. Strength: Kneeling Ab Wheel, Kurzhantel-/Verbindungsstangen- und Kabelzugübungen im Dropdown; feine anatomische Muskelzuordnung für neu erfasste Sätze.
3. StrongLifts 5×5 A/B: optionale Trainingsvorlage im bestehenden Editor, nur nach Bestätigung werden bestehende Formularwerte ersetzt. Bestehende Garmin-Einträge bleiben unverändert.
4. Lokaler Trainingscoach: Ziele Muskelbalance, V-Taper, Bauchmuskeln, allgemeine Kraft; Zuhause/Gym; kompakte, schematische Bewegungsillustrationen. Vorschläge basieren auf manuell zugeordneten Übungssätzen der letzten 28 Tage. Bei fehlenden Daten keine erfundene Muskelhistorie.
5. Makko-Ho: Play statt Checkbox im Habit-Schnellmenü sowie aus Habits Insights. Sechs Positionen mit schematischen Zeichnungen, Text, variabler Zeit (30/45/60/90 s), Start/Pause, Signalton und manuellem Weiter. Abschluss verwendet den vorhandenen Habit-Speicherweg.
6. Lazy Loading: Coach und Makko-Modul inklusive ihrer CSS-Dateien werden erst beim jeweiligen Klick über `import()` geladen. Workbox schließt die lazy Chunks aus dem Installations-Precache aus und cached sie nach dem ersten Abruf zur Offline-Wiederverwendung.

## Test- und Qualitätsstatus

- `node --test tests/compass-05775910-strength-habits.test.mjs`: 7/7 lokal bestanden.
- `node --check`: alle neuen JS-Dateien sowie Vite-Konfiguration erfolgreich.
- Eingriffsanker anhand der aktuellen GitHub-Quellen einmalig geprüft.
- Browser-Smoke-Test: Makko Desktop (Timer, Pause, Weiter); Coach Desktop (Ziel/Equipment); Makko Mobile ohne horizontales Überlaufen.
- **Nicht** durchgeführt: komplette Repository-Tests und finaler Vite-Produktionsbuild. Dafür ist nach dem Upload GitHub Actions maßgeblich.

## Grenzen

- Die Bewegungsabbildungen sind **schematische Orientierung**, kein detailliertes Technikvideo. Sie zeigen Bewegungsrichtung, ersetzen keine fachliche Einweisung.
- Makko-Ho ist eine Shiatsu-Dehnfolge; traditionelle Meridianzuordnungen sind keine medizinisch gemessenen Effekte.
- Sichtbare Bauchmuskeln hängen auch vom Körperfettanteil ab; Bauchübungen allein bewirken keinen gezielten Fettverlust am Bauch.
- Kein automatischer Trainingsplan im Kalender, keine Lastvorgaben, keine neuen Cloud-Schnittstellen, keine Datenbankmigration.
- Gespeicherter Habit-ID `hakka-5` bleibt aus Kompatibilitätsgründen unverändert; in den neuen Oberflächen wird die sechsteilige Makko-Ho-Folge angezeigt.
- Die sichtbare App-Version im Sidebar-Branding kann weiterhin `0.5.77.58.2` anzeigen (historische Vite-Transformationsverträge werden nicht angefasst).

## Bei CI-Problemen

Im GitHub-Actions-Log die erste fehlgeschlagene Testzeile bzw. `Compass .59.10: ... source anchor` prüfen. Die neuen Source-Transforms schlagen absichtlich fehl, falls ältere Dateien inzwischen anders aussehen. **Nicht** auf Verdacht weitere Bridges umsortieren.
