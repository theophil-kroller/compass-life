# Compass 0.5.77.59.25 – Adaptive Coach & Garmin Quick Assign

## Installation über GitHub-Weboberfläche

1. ZIP lokal entpacken.
2. Im Repository `theophil-kroller/compass-life` die Dateien unter **den angegebenen relativen Pfaden** hochladen (bestehende Dateien ersetzen):
   - `client/src/strength-coach-v5775910.js`
   - `client/src/strength-guided-v5775920.js`
   - `client/compass5910-strength-habits-bridge.js`
   - `tests/compass-05775925-adaptive-import.test.mjs` (neu)
3. In GitHub Actions auf den Erfolg von `Deploy Compass Web` prüfen.
4. Im Handy ggf. PWA einmal schließen/neu öffnen, damit die aktualisierte Version lädt.

**Nicht hochladen:** ZIP als ZIP, `UPLOAD_ANLEITUNG.md` (nur Begleitinfo).

## Änderungen

- Coach-Trainingshistorie aus bestätigten Coach- und zugeordneten Garmin-Sätzen bleibt erhalten; keine automatische Doppelzählung identischer Sätze.
- Zuletzt verwendetes **tatsächliches** Gewicht pro Übung wird im Coach als vorherige Last angezeigt und im Workout-Player vorausgefüllt, soweit der Wert zum Gerät passt.
- Double Progression: Erreichen alle geplanten Sätze den oberen Wiederholungswert, schlägt Compass eine kleine Steigerung vor (Zuhause beispielhaft +2 kg am benutzten Gerät, Gym +2,5 kg). Sonst zuerst Wiederholungen steigern bzw. bisheriges Gewicht beibehalten. Vorschläge ändern keine protokollierten Werte selbsttätig.
- Warnung, wenn zuletzt mehrere Sätze für geplante Muskeln erst heute/gestern dokumentiert wurden. Keine physiologisch gemessene Erholung.
- Garmin-Editor: „Zuletzt verwendet“ aus bestätigten Coach-Sätzen und manuellen Zuordnungen, aktuellste oben.
- Eindeutige englische Garmin-Übungsnamen werden im Formular vorausgewählt; das ist **nur ein Formularvorschlag**, wird erst mit „Speichern“ übernommen. Nicht eindeutig erkannte Titel bleiben frei.
- Original-Garmin-Sätze, FIT-Import und Vault sind unverändert; keine D1-Migration, kein zusätzliches Vite-Plugin und keine Änderung an Wim-Hof/Makko-Ho.

## Grenzen / Ausblick

- Körperkomposition (Fitdays), Schlaf/HRV und Tagesform beeinflussen die aktuelle Progression noch nicht mathematisch. Solche Messungen sind nicht gleichbedeutend mit gemessener Muskelregeneration.
- Lastvorschläge sind konservative Regeln und berücksichtigen keine automatische 1RM-Bestimmung oder Körpertechnik-Erkennung.
- Neue personalisierte Premium-Start-/Endbilder fehlen für weitere Übungen weiterhin. Die bereits vorhandenen Demonstrationen werden durch diesen Patch **nicht** überschrieben.
- Einzelne Trainingsgewichte für Zuhause sind die tatsächlich dokumentierten Werte am jeweiligen Trainingsgerät; die 28 kg sind der gesamte verfügbare Scheibensatz, nicht das Gewicht pro Kurzhantel.

## Tests

- 43 relevante lokale Coach-/Workout-Regressionstests bestanden.
- Die neue Editor-Transformation wurde mit den aktuell verfügbaren GitHub-Quelltextankern abgeglichen; exakte englische Zuordnung und zuletzt verwendete Übungs-Reihenfolge wurden separat geprüft.
- Der vollständige `npm`-/GitHub-Actions-Produktionslauf kann nur nach Upload bestätigt werden.
