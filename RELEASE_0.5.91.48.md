# Compass Life 0.5.91.48 — Kompaktes, durchsuchbares Ernährungsmenü

## Neu

- Unveränderte Food-IDs und Tresoreinträge: vorhandene Food-Presets bleiben vollständig erhalten.
- Schnellfilter **Für dich**, **Proteinreich**, **Milchprodukte**, **Brot & Gebäck**, **Shakes & Supplemente**, **Gerichte & Beilagen**, **Obst & Nüsse**, **Süßes & Snacks**, **Getränke**, **Zutaten**, **Weitere**, **Alle**.
- Suche durchsucht Produkte in **allen** Kategorien, auch andere als die gerade gewählte.
- BCAA und Whey werden zusammen auffindbar, ohne die historische Food-Gruppe zu überschreiben.
- Drei Produkte ergänzt: Milsani High Protein Pfirsich-Maracuja 200 g (136 kcal, 24,8 g Protein), All Stars Iced Matcha Whey (30 g, 117 kcal, 20 g Protein), NutriNorm Whey Deluxe Cookies & Cream (30 g, 112 kcal, 22,3 g Protein).
- Golden Turtle Erdnüsse mit Haut (30 g, ca. 170 kcal, 7,8 g Protein) als Portionswert vom Etikett.
- Zwei hausgemachte Rezepte als gewichtsvariable Einträge: Indisches Zitronen-Rotkraut (58 kcal/100 g) und Rotkraut-Rote-Rübe-Kimchi (34 kcal/100 g), beides **grob geschätzt**. Kimchi-Salz und Fermentation nicht als bestätigt ausgeben.
- Zwei hausgemachte Backwaren als eigenständige Food-IDs: Muffin **1 Stück ≈80 g, ≈225 kcal, ≈4 g Protein**; Kuchenstück **1 Stück ≈100 g, ≈270 kcal, ≈4 g Protein**. Geringerer Zuckergehalt nach Angabe, aber alle Makros sind **grobe Portionsschätzungen**, Rezept nicht bekannt.
- Portionsangaben in Gramm, Bechern, Stücken und 0,5 Portionen frei anpassbar; Nährwerte werden proportional berechnet. Keine automatischen Mahlzeitenbuchungen.
- Proteincoach kann die beiden neuen Shakes aus der bestehenden Nährwertdatenbank empfehlen.
- Kompakte Produktkacheln: keine langen Warntexte; Details bleiben bei Bedarf im Produktprofil.

## Qualitätssicherung

- Bestehende Produkt-IDs laut gespeicherter 0.5.91.47-Referenz vollständig weiterhin vorhanden. Keine Datei gegenüber 0.5.91.47 entfernt.
- 33/33 Release-/Deployment-Prüfungen bestanden.
- 2.264 Tests bestanden, 66 bekannte Altfehler; Vergleichsstand 0.5.91.47: 66 Altfehler, **keine neuen**.
- Ein lokaler Vite-Produktionsbuild war mangels installierter Abhängigkeit nicht möglich; GitHub Actions muss die Kompilierung/Deployment bestätigen.

## Installation

Patch nur auf dem vollständig installierten Stand **0.5.91.47** anwenden: enthaltene Dateien mit Ordnerstruktur über die gleichnamigen Repository-Dateien kopieren. Full Source kann stattdessen als vollständiger Repositorystand verwendet werden. Kein Tresorinhalt in den ZIPs enthalten.
