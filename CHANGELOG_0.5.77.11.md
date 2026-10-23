# Compass Life 0.5.77.11 – Matcha-Frühstück mit und ohne Honig

## Frühstücks-Presets

- Neu: `matcha-oat-plain` – **Matcha mit Hafermilch (ohne Honig)**, Frühstück, circa 35–60 kcal.
- Aktualisiert: bestehendes Preset `matcha` – **Matcha mit Hafermilch & Honig (1 TL)**, Frühstück, circa 55–85 kcal. Die bisherige ID bleibt unverändert; historische Einträge und Journal-Synchronisierung bleiben kompatibel.
- Beide Rezepte: etwa **1 TL Matcha-Pulver (~2 g)**, heißes Wasser, anfänglich geschätzte **75 ml Hafermilch** bei **ca. 500 ml gesamter Trinkmenge**. Honigvariante zusätzlich 1 TL Honig (~7 g).
- Hinweis direkt im Frühstücksmenü sowie Detailhinweise über den Kacheln (Tooltips). Preset-Werte bleiben nur eine freiwillige Schätzung, keine Messung.

## Nährwert-Logik

Die geschätzten kcal richten sich nach der *tatsächlich eingefüllten Hafermilch*, nicht nach der Gesamtmenge heißem Wasser plus Matcha. Referenzband: ca. 40–70 kcal je 100 ml Haferdrink, 5–9 kcal für 1 TL Matcha, bei Honig 20–25 kcal zusätzlich. Die Schätzung rundet auf 5 kcal.

Im Ernährungstagebuch kann die Hafermilchmenge pro Eintrag über **Menge** konkretisiert werden, z. B. `1 Becher (ca. 500 ml; 120 ml Hafermilch)`; die Kalorienschätzung passt sich entsprechend an. Bei Angaben ohne separate Hafermilchmenge gilt weiterhin die transparente Schätzung von 75 ml.

**Alt-Daten:** Historische Einträge mit `foodId: "matcha"` und beispielsweise `1 Tasse (250 ml)` werden nicht verändert oder gelöscht. Ihre bisherige, sehr breite Schätzung von 70–160 kcal wird auf die neue Rezeptannahme (55–85 kcal) umgerechnet; tatsächliche damalige Mengen sind nicht bekannt. Die gesamte Getränkemenge wird ausdrücklich nicht als Hafermilchmenge interpretiert.

## Tests / Deployment

- Vier neue Tests für beide Presets, Kalorienband, editierbare Hafermilchmenge, Wasseranteil und Bestandsdaten.
- Historische, versionsgebundene Testassertions auf versionsunabhängige Prüfung angepasst, damit zukünftige Compass-Versionen keine unnötigen Tests brechen.
- Keine D1-Migration, keine neuen Worker-Endpunkte, keine Änderung am Synchronisierungsformat.
