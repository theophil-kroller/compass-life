# Compass Web 0.5.77.59.40.17 – Nutrition UX: Grafik zuerst

Basis: Compass Web **0.5.77.59.40.16** (Apfelkuchen und Wasser).
Die gesamte bestehende Ernährungsdatenbank, der verschlüsselte Vault, die Watch Bridge und alle Diagramm-Module bleiben erhalten.

## Was sich ändert

- Unter Insights → Gesundheit & Körper → Ernährung beginnt die Seite nun mit **Heute**, einem echten Uhrzeit-Dot-Plot aus den gespeicherten Ernährungseinträgen (Essen und Getränke getrennt, Punktgröße nach geschätzten kcal, unbekannte kcal als Umriss).
- Erst darunter: kompakte, quellgetreue Angaben zu protokollierter Energie, Daily Dozen und Eintragsanzahl; keinerlei erfundene Mahlzeiten oder Messwerte.
- Schnelle Lebensmittel-Erfassung in der Titelzeile sowie eine anklickbare Liste der letzten Einträge zum Bearbeiten.
- Vier Hauptbereiche: **Heute**, **Daily Dozen**, **Nährstoffe**, **Trends**. Tiefe Ansichten bleiben erhalten: Zeit-/Fastenplots, Nährstoff-Trends, Zusammenhänge, Fettqualität, Anti-Aging Eight, Pflanzenstoffe. Die manuelle Daily-Dozen-Checkliste ist weiterhin in der entsprechenden Ansicht erreichbar.
- Der bisherige **ungefragte volle Daily-Dozen-Block vor dem Menü** entfällt.
- Historischer kcal-Verlauf sowie das komplette Tagebuch mit Editor bleiben im Bereich Heute als ausklappbare Detailabschnitte erreichbar. Beim Bearbeiten eines Eintrags öffnet sich der Editor automatisch.
- Keine Änderung an Ernährungseinträgen, kcal-Quellen, Synchro-API oder Datenbankschema.

## Installation

### PATCH
Die Dateien aus `Compass_Web_0.5.77.59.40.17_NUTRITION_UX_PATCH_FROM_0.5.77.59.40.16.zip` im **Stammverzeichnis des bestehenden, funktionierenden .40.16-Repositories** hochladen. Relative Ordnerpfade unverändert erhalten und gleichnamige Dateien ersetzen. Erst nach grünem GitHub-Actions-Workflow `Deploy Compass Web` Browser/PWA neu laden.

### FULL SOURCE
`Compass_Web_0.5.77.59.40.17_NUTRITION_UX_FULL_SOURCE.zip` enthält den vollständigen Projektcode einschließlich Worker, Client, allen bisherigen Assets und Tests. Alternativ zum Patch als komplette Ausgangsbasis verwenden, nicht zusätzlich zum Patch einspielen.

## Prüfstand

- Full Source gegen .40.16 byteweise abgeglichen; Patch stellt aus .40.16 den .40.17-Quellstand her.
- `node --test --test-force-exit tests/*.test.mjs`: **1602/1602 bestanden**.
- 64 Transformations-Plugins gegen `main.js` in Reihenfolge geprüft, Syntax des fertig transformierten `main.js` und Worker geprüft.
- ZIP-Integrität erfolgreich geprüft.
- **Ein realer Vite-Build und browserbasierter End-to-End-Test sind lokal nicht bestätigt**: npm-Pakete waren in dieser Umgebung nicht installiert und konnten ohne Registry-Zugriff nicht nachinstalliert werden. Der bestehende GitHub-Workflow führt weiterhin `npm install`, `npm run check`, `npm run build` vor einem Deployment aus.

## Smoke-Test nach Deployment

1. Insights → Gesundheit & Körper → Ernährung: direkt `Heute` mit Dot-Plot und vier Tabs, kein großer Daily-Dozen-Block oberhalb.
2. Lebensmittel mehrfach erfassen (Apfelkuchen und Wasser); neue Punkte erscheinen an den tatsächlichen Uhrzeiten und lassen sich über die Liste bearbeiten.
3. Daily Dozen öffnen; grafische Portionenübersicht und manuelle Checkliste prüfen.
4. Nährstoffe sowie alle sechs Unteransichten von Trends öffnen; bisherige Diagramme prüfen.
5. Historische kcal-Grafik und Tagebucheditor unter Heute aufklappen; Synchronisation von Laptop und Android kontrollieren.

Keine Cloudflare-D1-Migration, keine Worker-Aktualisierung, keine Garmin-App-Änderung.
