# Compass Life 0.5.83 — Life in Weeks Overview

GitHub BASE main `2a19d7b85942ad585b4fc228122c23fbbdbc407e` (0.5.82).

- Zoom in der Lebensmatrix 100%, 90%, 80%, 75%, 70%, 60%, 50% und Alles einpassen; nur Matrix verkleinert, nicht ganze App.
- In-place-Zoom ohne Springen an den Seitenanfang, Browser-Resize aktualisiert den Einpassen-Modus.
- In der ersten Zeile Lebenstag (inklusive heutiger Tag), absolvierte Tage, absolute Lebenswoche, Lebensmonat, Lebensjahr und 7-Jahreszyklus mit Zyklusjahr.
- Siebenjahreszyklen alle sieben Lebensjahre dezent getrennt; bestehende Bronze-/Silber-/Gold- und Reise-Farbkodierungen bleiben.
- Bestehende Ereignisverwaltung, Google-Kalendervorschläge, Sync, Datumsgrenzen und alle anderen App-Bereiche unverändert.

**Deploy:** npm run check:deploy; vollständiger npm/Vite-Build nur bei vorhandenen node_modules.
**Install:** PATCH ausschließlich auf exakt genannter GitHub-BASE; sonst FULL SOURCE mit vorherigem Repo-Diff, niemals beide.

## PDF-Poster, Erweiterung
- Direkter A4/A3-Vektor-PDF-Download im Querformat, ohne externe Bibliotheken/Cloud oder Browser-Zoom.
- PDF enthält genau eine Seite mit allen derzeit eingeblendeten 80, 100 oder 110 Lebensjahren, realen Kalendermonatsgrenzen, Farb-Legende, 7-Jahreslinien, Lebensstatistik und dynamisch farbigen Ereignissen.
- Warnhinweis: PDF außerhalb des Tresors ist unverschlüsselt.
