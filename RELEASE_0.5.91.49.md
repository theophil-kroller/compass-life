# Compass Life 0.5.91.49 — Obst, Gemüse, Calpis und Dinkelspaghetti

## Neue Einträge (13) plus bestehende Banane

- Gedämpfter Brokkoli mit Salz/Pfeffer — 250 g gekocht (Gewicht geschätzt; Salzmenge offen)
- Frische Maracuja — 1 Frucht, ca. 18 g Fruchtfleisch
- Karotte roh — 1 Stück, ca. 80 g
- Mango frisch — 1 Frucht, ca. 200 g essbar
- Mandarine — 1 Stück, ca. 90 g
- Drachenfrucht/Pitaya — 1 Frucht, ca. 200 g; wenige Mikronährstoffe aus Quellen sicher quantifizierbar
- Pomelo — ½ Frucht standardmäßig ca. 250 g essbar; 1 ganze Pomelo ≈ 500 g
- Granatapfel — 1 Stück, ca. 170 g Kerne
- Kiwi grün — 1 Stück, ca. 75 g
- Avocado — 1 Stück, ca. 140 g
- Süßkartoffel gedämpft — 1 Stück, ca. 200 g gegart
- Calpis Kyoho Grape — 1 Glas (150 ml TRINKFERTIG, 5 Teile Wasser : 1 Teil Konzentrat) = 74 kcal, 16,5 g Zucker. Herstelleretikett liefert keine Mikronährstoffe. Eiweiß <0,75 g je 150 ml; nicht als 0 g ausgegeben.
- Dinkelspaghetti — 80 g TROCKEN, ca. 200 g gekocht. Nährwerte Referenz gewöhnlicher Dinkelspaghetti, nicht automatisch Vollkorn.
- **Banane** bleibt unter der bereits existierenden Food-ID `banana`, Standard 1 Stück 120 g essbar und generische USDA-Makro-/Mikrowerte. Kein Duplicate.

## Datenqualität und Zuordnung

Nährstoffprofile: Makros, Zucker und Ballaststoffe soweit bekannt; relevante Vitamine und Mineralien aus generischen Lebensmittelkompositionsdaten (keine Markenspezifik). Fehlende Werte werden NICHT als 0 gespeichert. Nutzer kann alle Portionsmengen verändern. Bioaktive Stoffe nur als mögliche Präsenz ohne Mengen-/Wirknachweis.

Dr. Greger Daily Dozen: Brokkoli = Kreuzblütler; Karotte/Süßkartoffel = sonstiges Gemüse; frisches Obst = anderes Obst; Calpis nicht automatisch als Wasser-/ungesüßte Getränkeportion; normale Dinkelspaghetti nicht als Vollkorn ohne Beleg. Anti-Aging Eight: Gemüse/Kreuzblütler und ballaststoffhaltige Früchte können als dokumentierter Ernährungsbeitrag zählen; NAD+, tatsächliche Postbiotika und Xenohormesis-/microRNA-Wirkung sind mit Essensjournal nicht messbar. Keine gesundheitsbezogene Pseudobewertung.

## Erhalt des Bestands

13 eindeutige neue Produkt-IDs, unverändert alle 101 bestehenden Produkt-IDs aus v0.5.91.48. Kein Umbau oder Migration vorhandener Tagebucheinträge, keine Änderungen an Verschlüsselung oder Tresordaten. Alle bisherigen Menükategorien bleiben; neuer Gemüsefilter ergänzend. Portionsinterpretation sichert `½ Pomelo`, `1 Pomelo`, `1 ganze Pomelo`, Gramm und `200 g gekochte Dinkelspaghetti` ab. Optional Mengenänderung im Menü.

## Quellen / Unsicherheit

- USDA FoodData Central (https://fdc.nal.usda.gov/) und USDA SR Legacy / CoFID 2021: generische botanische Roh- und Garmittelwerte, arts-/reife-/zubereitungsbedingt variabel.
- UK/CoFID steamed broccoli: https://patient.info/nutrition/foods/broccoli-green-steamed
- Pomegranate USDA reference: https://www.growables.org/information/TropicalFruit/documents/PomegranateNutrient.pdf
- Dinkelspaghetti Vergleichsetikett EDEKA (Stand 15.01.2026): https://edeka-foodservice.de/eigenmarken/produkte/3537795007/edeka-dinkel-spaghetti-500g
- Daily Dozen https://nutritionfacts.org/daily-dozen/ und How Not to Age https://nutritionfacts.org/book/how-not-to-age/
- Calpis: vom Nutzer fotografierte englischsprachige Zubereitungs- und Nährwertangaben bei 5:1 Verdünnung, 49 kcal und 11 g Zucker pro 100 ml trinkfertig.

## Prüfstatus

- 14/14 gezielte Alt-/Neu-Tests bestanden; 33/33 Release-/Deploymentprüfungen bestanden.
- Vollständige Regression: 2.270 Tests bestanden, 66 bekannte Altfehler; **exakt identische Namen der 66 Fehlschläge wie bei v0.5.91.48** (dort 2.264 bestanden, 66 fehlerhaft).
- Importgraph: 299 Module, ohne fehlende relative Imports.
- Kein lokaler Vite-Produktionsbuild, weil `vite` in dieser Runtime nicht installiert ist. GitHub Actions muss den Produktionsbuild bestätigen. Nicht als deployed oder ausgeliefertes Binary ausgeben.
