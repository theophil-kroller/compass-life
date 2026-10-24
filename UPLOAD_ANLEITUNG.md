# Compass Life 0.5.77.49.1 — Deployment-Hotfix

## Ausgangslage

Im GitHub-Repository sind die Dateien von 0.5.77.49 bereits hochgeladen (Commit `2458e50`). GitHub Actions #210 meldete **1189/1189 Tests bestanden**, aber der Vite-Build brach mit `Compass .49: body insights screen: expected one integration anchor; found 0` ab.

## Hochladen

Dieses ZIP entpacken und **nur die enthaltenen Dateien** in GitHub im gleichen Verzeichnispfad hochladen. Die alten Versionen der folgenden Dateien ersetzen:

- `client/compass749-bridge.js` — **ersetzen**
- `tests/compass-0577491-vite-hotfix.test.mjs` — **neu**
- `CHANGELOG_0.5.77.49.1.md` — neu, optional
- `UPLOAD_ANLEITUNG.md` — ersetzen, optional

Keine anderen Dateien entfernen! Alle übrigen Dateien von 0.5.77.48 und 0.5.77.49 müssen im Repository bleiben.

## Warum es scheiterte

Seit Build 0.5.77.28 liegt im transformierten Insights-Code zwischen **Körper** und **Aktivität** der separate **Krafttraining**-Tab. Das frühere 0.5.77.49-Bridge-Skript suchte fälschlicherweise `body` unmittelbar vor `activity` und scheiterte daher erst beim echten Vite-Build. Der alte Modultest hatte die vollständige Plugin-Kette nicht simuliert.

Der korrigierte Anker hängt nur vom eindeutig vorhandenen Körper-Ausdruck ab. Der zusätzliche Regressionstest rekonstruiert ausdrücklich den `body → strength → activity`-Fall und schützt gegen fehlende/doppelte Anker.

## Testen

Nach dem Commit in GitHub **Actions → Deploy Compass Web** prüfen:

1. `npm run check` grün, einschließlich Test `compass-0577491-vite-hotfix`.
2. `npm run build` grün (dieser Schritt schlug bei #210 fehl).
3. `Deploy to GitHub Pages` grün.
4. Compass neu laden und **Insights → Gesundheit → Körper** aufrufen; die neue Body-Transformation-Karte sollte oberhalb des bisherigen Fitdays-Reports erscheinen.
5. In **Fristen & Kapazität** speichern und prüfen, dass vorhandene Arbeitspakete bestehen bleiben.

Kein Datenbank-Update und keine Neuanmeldung erforderlich. Ist der Vite-Build erneut rot, ist der konkrete Fehler im GitHub-Actions-Protokoll maßgeblich.
