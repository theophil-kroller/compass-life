# Compass 0.5.77.39 – GitHub Actions Hotfix (Workflow #198)

**Nur eine Datei ersetzen:**

`client/src/strength-premium-v57738.js`

Der Test `tests/compass-057738.test.mjs` verlangt explizit die textliche Zusicherung
„nicht in Sätze umgerechnet“. Das neue .39-Redesign trennt Radfahrminuten bereits
korrekt von Kraftsätzen, aber der Hinweistext benutzte eine andere Formulierung.
Dies ist jetzt im Modul korrigiert. Das Layout, die Muskelkarte und die Datenlogik
werden dabei nicht verändert.

## Schritte
1. Das ZIP entpacken.
2. Die Datei `client/src/strength-premium-v57738.js` unter genau diesem Pfad in GitHub ersetzen.
3. Commit durchführen; danach `Deploy Compass Web` unter GitHub Actions kontrollieren.
4. Falls Tests erfolgreich sind, aber `npm run build` anschließend fehlschlägt, die erste Fehlerzeile aus diesem Schritt weitergeben.

**Version:** bleibt `0.5.77.39`.
**Tests:** `node --test tests/compass-057738.test.mjs` in einem lokalen Patch-Arbeitsstand: 9/9 bestanden. Der vollständige GitHub-Check sowie das Deployment sind noch nicht bestätigt.
