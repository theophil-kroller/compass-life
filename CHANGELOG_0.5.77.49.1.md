# Compass 0.5.77.49.1 — CI/Vite-Integrations-Hotfix

- Basis: `0.5.77.49`, Commit `2458e50`, GitHub Actions #210.
- `npm run check` war im letzten Lauf vollständig grün (1189 Tests), aber `npm run build` brach im .49-Vite-Bridge-Modul ab.
- Root Cause: `strength728Bridge()` fügt den Insights-Tab `strength` zwischen `body` und `activity` ein; der .49-Bridge-Anker nahm fälschlich direkte Nachbarschaft an.
- Fix: Ersetze nur den eindeutigen `healthBodyView(...)`-Zweig, unabhängig vom nachfolgenden Tab.
- Neue Regression: prüft explizit `body → strength → activity`, einmalige Ersetzung, dynamisches JS und Fail-Closed bei doppeltem Anker.
- Sichtbare Client-Versionsnummer: `0.5.77.49.1`.
- Unverändert: Gesundheits-, Trainings- und Ernährungsdaten, Kalenderlogik, Vault, Worker, D1, Synchronisation.
- Vor Auslieferung isoliert geprüft. Der vollständige Produktionsbuild ist durch GitHub Actions zu verifizieren.
