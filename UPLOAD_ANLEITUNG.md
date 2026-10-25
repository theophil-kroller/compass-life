# Compass 0.5.77.59.7 – MatchaTherapy als Getränk

Dieser gezielte Hotfix korrigiert ausschließlich die Cup-&-Plate-Klassifikation in der Ernährungsgrafik.

## In GitHub hochladen

Die beiden Dateien im ZIP unter Beibehaltung ihrer Ordnerstruktur ersetzen:

1. `client/src/nutrition-timing-v57725.js`
2. `tests/compass-nutrition-cup-plate.test.mjs`

Bei GitHub **Add file → Upload files** im jeweiligen Ordner hochladen oder die jeweiligen Dateien ersetzen. Keine anderen Dateien aus älteren ZIPs erneut hochladen.

## Behebung

- `matcha` (MatchaTherapy mit Hafermilch & Honig) wird unabhängig von `Frühstück` und `🍯` als Getränk erkannt.
- `matcha-oat-plain` (ohne Honig) wird ebenfalls als Getränk erkannt.
- Zusätzliche Erkennung von `MatchaTherapy`/`Matcha Therapy` bei eigenen Lebensmitteln.
- Kalorien, Portionen, Lebensmittelgruppe, Timing und gespeicherte Daten bleiben unverändert.
- Die Größe der Tasse bleibt von der kcal-Schätzung abhängig.
- Nur JavaScript und Testdatei geändert; **kein** `vite.config.js`-Eingriff, keine neue Bridge, keine Migration.

## Prüfungen

`node --test tests/compass-nutrition-cup-plate.test.mjs`

9/9 gezielte Tests erfolgreich mit unverändertem Index/CSS aus dem vorausgehenden Build. Ein gesamter CI-/Produktionsbuild lässt sich nach dem GitHub-Upload über Actions prüfen; lokal wurde die gesamte Repo-Suite hier nicht ausgeführt.

Basis: GitHub `main`, Originaldatei `client/src/nutrition-timing-v57725.js` mit Git-Blob-SHA `3b28f844ab4e1334985d4823a03fbc0f9f57ac15`.
