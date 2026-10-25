# Compass Life 0.5.77.58.1 — CI-only Hotfix

## Behebung

- 5 alte CI-Tests suchten fälschlich nach einer `.57`-Bridge als absolut letztem Vite-Plugin.
- Reihenfolge `.50 → .57` wird weiterhin streng geprüft; **nachfolgende** neue Plugins sind erlaubt.
- Vollständiger Ketten-/Versions-/Syntax-Test für `.58` bleibt unverändert die verbindliche Integrationsprüfung.

## Nicht geändert

- App-Version `0.5.77.58`, Main-JavaScript, Vite-Konfiguration, CSS, Projektansicht, Inbox/Dreams, Verschlüsselung und Synchronisation.

## Nachweis

- GitHub #223: 1246/1251 Tests erfolgreich, genau fünf veraltete Plugin-Endanker-Tests fehlgeschlagen. Vollständiger Main.js-Transformations- und Syntax-Test **grün**.
- 58/58 lokal ausgeführte Tests nach Korrektur grün.
- Produktiver Vite-Build und Deployment **noch nicht nachgewiesen**.
