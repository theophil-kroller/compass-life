# Compass 0.5.91.13 · Krautroulade mit Räuchertofu statt Gemüse-Tofu-Strudel

**Basis:** GitHub `main`, Compass **0.5.91.12**, Commit `ce5370b8d97ab92680e9ac249c76a7b0c501a958` (02.11.2026).

## Gezielte Korrektur

- Neue bestätigte Information: **Krautroulade mit Räuchertofu**. Kein Blätterteig als Zutat, keine belegte koreanische Sauce. Schärfe stammt nur aus ursprünglicher Beschreibung.
- **Stabile ID** `korean-spicy-tofu-vegetable-strudel` bleibt absichtlich erhalten (Kompatibilität mit bestehenden gespeicherten Buchungen/Tagebuch-Einträgen). Sichtbarer Titel und Zutatenmodell sind aktualisiert; es entsteht kein zweites Gericht. Alte snapshots von `strudel-pastry` werden nicht mehr berechnet.
- Die vorher als 521 kcal geschätzte 288-g-Portion ist nicht mehr gültig. Für die neue, **weiterhin ungewogene** Beispielportion werden angenommen: **170 g gegartes Kraut, 100 g Räuchertofu, 8 g Öl, 10 g scharfe Würzung = 288 g**. Öl, Gewürze und Mengen sind **nicht bestätigt**, sondern jederzeit editierbar; weitere Gemüsebestandteile standardmäßig 0 g. Nährwerte sind ein REZEPTPROXY, keine Laboranalyse.
- Räuchertofu: Makro-/Salzprofil nach generischem Räuchertofu (als Orientierung Taifun Räuchertofu Klassik, ca. 163 kcal, 19 g Protein und 1,7 g Salz pro 100 g), Markenidentität unbestätigt; Calcium und weitere Mineralstoffe nochmals ungesicherter. Krautprofil basiert auf generischem gegartem Weißkohl, hitzelabile Vitamine vorsichtig angesetzt.
- Daily Dozen: **Kraut als Kreuzblütler** (je ca. 80 g eine geschätzte Portion), Räuchertofu als **Soja/Hülsenfrüchte** (je ca. 125 g eine geschätzte Portion). Kein doppeltes „sonstiges Gemüse“ für Kraut. Kein Vollkorn- oder Fermentationsbonus.
- Anti-Aging Eight nutzt die schon vorhandenen Protokolleinträge/Nährwerte und macht keine Wirkungsbehauptung aus dem Räuchern; keine automatische Mahlzeitenerfassung.

## Tests

- **13/13** gezielte Rezept- und Regressionsfunktionstests bestanden (davon 5 neue Korrekturtests).
- **33/33** Deployment-Tests inkl. Importgraph/Worker-Check bestanden.
- **1973/2008** vollständige Tests bestanden; **exakt dieselben 35 historischen Fehler** wie in 0.5.91.12, ohne neue Regression.
- `npm run build` konnte nicht fertig gebaut werden (`vite: not found`, lokale Abhängigkeit nicht installiert), **kein bestätigter Produktionsbuild**. Nach Upload GitHub Actions prüfen.
- Der PATCH-/Full-Source-Inhaltsabgleich und ZIP-CRC werden bei Paketierung geprüft.
