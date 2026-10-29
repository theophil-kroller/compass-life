# Compass 0.5.77.59.40.25.17 · Fitdays Einordnung (additiv)

Basis: GitHub Actions #328, Commit `9bd607983dae746d0a02b7d72210c0fd57e00c49`.

## Einbau

Patch-ZIP im Root des Repositories entpacken und die 6 Dateien in gleicher Pfadstruktur übernehmen. Bestehende Dateien nur an den ausdrücklich angegebenen Stellen ersetzen. Alternativ Full-Source-ZIP (nicht beides).

Geänderte Dateien:
- `client/src/main-full-v57759402510.js`: nur View-Einbindung (Versionskonstante des historischen Full-Source-Snapshots unverändert).
- `client/src/health-import.js`: optionale Fitdays-Felder und verlustfreier Reimport.
Neue Dateien:
- `client/src/fitdays-interpretation-v57759402517.js`
- `client/src/fitdays-interpretation-v57759402517.css`
- `tests/compass-40-25-17-fitdays-interpretation.test.mjs`
- `README_FITDAYS_KOERPERANALYSE_40.25.17.md`

## Inhalt

Insights → Gesundheit & Körper → Körperanalyse: Eigene interpretative Leiste zwischen den bestehenden Verlaufs-/Dot-Plots und den bestehenden gestapelten Fitdays- und segmentalen Detail-Charts. Nur echte Fitdays-Daten. Re-importierbare optionale CSV/XLS-Felder: BMI, Subkutanfett, WHR, BMR, fettfreie Masse, Körperalter, ASMI. Bestehende 5-Segment- und Garmin-Grafiken bleiben erhalten.

Ein fehlendes Feld wird nicht mit Werten aus einem Fitdays-Screenshot gefüllt; dort steht „Nicht im Export“. Bei wiederholtem Import eines kürzeren Exports bleiben bisher gespeicherte Zusatzfelder erhalten. Es werden weder Cloud-Worker noch Journals verändert.

Kategorien für BMI sind nur WHO-/CDC-Erwachsenen-Orientierung, keine Diagnose. Die übrigen Skalen sind bewusst neutral; Herstellerindikatoren sind keine klinischen Grenzwerte. Kein proprietärer Fitdays-Score wird nachgebaut.

## Prüfung

`node --test tests/*.test.mjs` und `npm run check -w worker` im Root. Produktion: nach Upload den GitHub-Actions-Build und die Live-Anzeige prüfen. Bei einem ersten Anlauf kein Cache-Leeren mit Löschung von Website-Daten verwenden – das würde den lokalen Tresor gefährden.

Der Import hat keinen neuen Hintergrundabruf und aktualisiert ausschließlich lokale Daten nach expliziter Freigabe.
